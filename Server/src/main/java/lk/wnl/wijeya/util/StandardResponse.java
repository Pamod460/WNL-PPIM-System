package lk.wnl.wijeya.util;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StandardResponse {
    private Integer code;
    private String message;
    private Object data;

    public StandardResponse(String message, Object data) {
        this.message = message;
        this.data = data;
    }
}
