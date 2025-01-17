package com.booking.book.mapper;

import com.booking.book.model.SlotResource;
import com.booking.book.model.Slots;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;
import com.booking.book.controller.SlotController;

@Component
public class SlotResourceAssembler {

    public SlotResource toResource(Slots slot) {
        SlotResource resource = new SlotResource();
        resource.setId(slot.getId());
        resource.setUserId(slot.getUser().getId());
        resource.setDate(slot.getDate().toString());
        resource.setTime(slot.getTime().toString());
        resource.setRoomNumber(slot.getRoomNumber());
        resource.setRegistrarName(slot.getRegistrarName());
        resource.setStatus(slot.getStatus().toString());

        // Add self link
        resource.add(WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(SlotController.class).getSlotById(slot.getId())
        ).withSelfRel());

        // Add book link
        resource.add(WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(SlotController.class).bookSlot(slot.getId())
        ).withRel("book"));

        // Add cancel link (only if the slot is currently booked)
        if (slot.getStatus().toString().equals("BOOKED")) {
            resource.add(WebMvcLinkBuilder.linkTo(
                    WebMvcLinkBuilder.methodOn(SlotController.class).cancelSlot(slot.getId())
            ).withRel("cancel"));
        }

        return resource;
    }
}
