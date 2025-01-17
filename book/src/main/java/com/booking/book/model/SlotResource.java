package com.booking.book.model;

import org.springframework.hateoas.RepresentationModel;
import lombok.Data;

@Data
public class SlotResource extends RepresentationModel<SlotResource> {
    private Long id;
    private Long userId;
    private String date;
    private String time;
    private String roomNumber;
    private String registrarName;
    private String status;
}
