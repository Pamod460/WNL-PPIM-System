package lk.wnl.wijeya.advisor;

import lk.wnl.wijeya.security.CurrentUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdviceAdapter;

import java.lang.reflect.Method;
import java.lang.reflect.Type;

/**
 * Request DTOs carry a "logger" field that the services use as "created by". The browser used to
 * fill it in, so anyone could save a record as Admin. Before the body reaches a controller, this
 * replaces it with the username from the JWT, or with the public account for the two public forms
 * (agent registration and public agent order).
 */
@ControllerAdvice
public class LoggerFromTokenAdvice extends RequestBodyAdviceAdapter {

    private final String publicUsername;

    public LoggerFromTokenAdvice(@Value("${app.public-user:Agent}") String publicUsername) {
        this.publicUsername = publicUsername;
    }

    @Override
    public boolean supports(MethodParameter methodParameter, Type targetType,
                            Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object afterBodyRead(Object body, HttpInputMessage inputMessage, MethodParameter parameter,
                                Type targetType, Class<? extends HttpMessageConverter<?>> converterType) {
        if (body == null) return null;
        Method setter = loggerSetter(body.getClass());
        if (setter != null) {
            String username = CurrentUser.username();
            try {
                setter.invoke(body, username != null ? username : publicUsername);
            } catch (ReflectiveOperationException e) {
                throw new IllegalStateException("Could not set logger on " + body.getClass().getSimpleName(), e);
            }
        }
        return body;
    }

    private static Method loggerSetter(Class<?> type) {
        try {
            return type.getMethod("setLogger", String.class);
        } catch (NoSuchMethodException e) {
            return null;
        }
    }
}
