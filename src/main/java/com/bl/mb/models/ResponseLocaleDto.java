package com.bl.mb.models;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ResponseLocaleDto {
    private List<String> sliderMedia;
    private String htmlContent;
}
