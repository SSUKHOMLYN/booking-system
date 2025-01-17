package com.booking.book.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.booking.book.model.Slots;
import com.booking.book.service.SlotService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private SlotService slotService;

    // View ALL booked appointments from all users
    @GetMapping("/slots")
    public List<Slots> getAllBookedSlotsForAdmin() {
        // For admin, we can return slotRepository.findByStatus(SlotStatus.BOOKED)
        return slotService.getAllSlots();
    }

    // Admin can delete any user’s booked slot
    @DeleteMapping("/slots/{slotId}")
    public ResponseEntity<?> adminDeleteSlot(@PathVariable Long slotId) {
        try {
            slotService.deleteSlot(slotId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin can update any user’s slot
    @PutMapping("/slots/{slotId}")
    public ResponseEntity<?> adminUpdateSlot(@PathVariable Long slotId, @RequestBody Slots updatedSlot) {
        try {
            Slots result = slotService.updateSlot(slotId, updatedSlot);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
