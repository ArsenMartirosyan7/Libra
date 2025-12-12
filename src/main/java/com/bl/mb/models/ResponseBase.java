package com.bl.mb.models;


import lombok.*;
import org.springframework.http.HttpStatus;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseBase<T> implements Serializable {
    private T data;
    private HttpStatus httpStatus;
    private int httpStatusCode;

    private Date date;
    private boolean isSuccess;


}
