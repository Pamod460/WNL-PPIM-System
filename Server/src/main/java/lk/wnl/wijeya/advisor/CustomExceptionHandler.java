package lk.wnl.wijeya.advisor;


import lk.wnl.wijeya.exception.CustomAccessDeniedException;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class CustomExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<StandardResponse> handleResourceNotFoundException(ResourceNotFoundException exception){
        return new ResponseEntity<StandardResponse>(
                new StandardResponse(404,"Error",errorBody(exception)), HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(ResourceAlreadyExistException.class)
    public ResponseEntity<StandardResponse> handleResourceAlreadyExistException(ResourceAlreadyExistException exception){
        return new ResponseEntity<StandardResponse>(
                new StandardResponse(409,"Error",errorBody(exception)), HttpStatus.CONFLICT
        );
    }

        @ExceptionHandler(CustomAccessDeniedException.class)
    public ResponseEntity<StandardResponse> handleAccessDeniedException(CustomAccessDeniedException exception) {
        return new ResponseEntity<>(
                new StandardResponse(403, "Access Denied", exception.getMessage()),
                HttpStatus.FORBIDDEN
        );
    }

    /** Thrown by @PreAuthorize when the logged-in user lacks the privilege for this action. */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<StandardResponse> handleSpringAccessDenied(AccessDeniedException exception) {
        return new ResponseEntity<>(
                new StandardResponse(403, "Access Denied",
                        Map.of("message", "You do not have permission to perform this action.")),
                HttpStatus.FORBIDDEN
        );
    }

    /**
     * Only the message goes back to the client (it reads error.data.message).
     * Serializing the exception itself leaked the stack trace and class names.
     */
    private static Map<String, String> errorBody(Exception exception) {
        return Map.of("message", exception.getMessage() == null ? "" : exception.getMessage());
    }
}
