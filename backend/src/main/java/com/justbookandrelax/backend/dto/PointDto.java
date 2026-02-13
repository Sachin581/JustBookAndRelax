package com.justbookandrelax.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointDto {
    private Long id;
    private String locationName;
    private String address;
    private LocalDateTime time;
}
