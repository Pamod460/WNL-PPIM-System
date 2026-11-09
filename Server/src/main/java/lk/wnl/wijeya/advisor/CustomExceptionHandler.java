package lk.wnl.wijeya.advisor;


import lk.wnl.wijeya.exception.CustomAccessDeniedException;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.Map;
import java.util.stream.Collectors;

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

    /** @Valid on a request body failed: send back the field messages (e.g. "Invalid NIC"). */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<StandardResponse> handleInvalidBody(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .distinct()
                .collect(Collectors.joining(", "));
        return badRequest(message.isEmpty() ? "Invalid request" : message);
    }

    /** Entity constraints (@NotNull, @Size...) checked by Hibernate when saving. */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<StandardResponse> handleConstraintViolation(ConstraintViolationException exception) {
        return badRequest(violationMessage(exception));
    }

    /** Spring wraps entity validation errors thrown at commit time in a TransactionSystemException. */
    @ExceptionHandler(TransactionSystemException.class)
    public ResponseEntity<StandardResponse> handleTransactionSystemException(TransactionSystemException exception) {
        Throwable cause = exception.getRootCause();
        if (cause instanceof ConstraintViolationException) {
            return badRequest(violationMessage((ConstraintViolationException) cause));
        }
        throw exception;
    }

    /** Duplicate unique value, or a delete blocked because other records still use this one. */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<StandardResponse> handleDataIntegrityViolation(DataIntegrityViolationException exception) {
        return new ResponseEntity<>(
                new StandardResponse(409, "Error", Map.of("message",
                        "This record is in use by other records or duplicates an existing one.")),
                HttpStatus.CONFLICT
        );
    }

    private static String violationMessage(ConstraintViolationException exception) {
        String message = exception.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .distinct()
                .collect(Collectors.joining(", "));
        return message.isEmpty() ? "Invalid request" : message;
    }

    private static ResponseEntity<StandardResponse> badRequest(String message) {
        return new ResponseEntity<>(
                new StandardResponse(400, "Error", Map.of("message", message)), HttpStatus.BAD_REQUEST
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
