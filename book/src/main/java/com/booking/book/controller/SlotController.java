package com.booking.book.controller;

import com.booking.book.mapper.SlotResourceAssembler;
import com.booking.book.model.SlotResource;
import com.booking.book.model.SlotStatus;
import com.booking.book.model.Slots;
import com.booking.book.model.User;
import com.booking.book.repository.SlotRepository;
import com.booking.book.repository.UserRepository;
import com.booking.book.service.SlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/slots")
public class SlotController {

    private static final String SECRET_KEY = "e797c0013811a1d1e35ad7edd10fb99986db664b0996c76ed9ae5e0a5151bbf9";

    @Autowired
    private SlotService slotService;

    @Autowired
    private SlotResourceAssembler slotResourceAssembler;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<SlotResource> getAllSlots() {
        return slotService.getAllSlots().stream()
                .map(slotResourceAssembler::toResource)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public SlotResource getSlotById(@PathVariable Long id) {
        return slotResourceAssembler.toResource(slotService.getSlotById(id));
    }

    @PostMapping
    public SlotResource createSlot(@RequestBody Slots slot) {
        Slots createdSlot = slotService.createSlot(slot);
        return slotResourceAssembler.toResource(createdSlot);
    }

    @PutMapping("/{id}")
    public SlotResource updateSlot(@PathVariable Long id, @RequestBody Slots slot) {
        Slots updatedSlot = slotService.updateSlot(id, slot);
        return slotResourceAssembler.toResource(updatedSlot);
    }

    @DeleteMapping("/{id}")
    public void deleteSlot(@PathVariable Long id) {
        slotService.deleteSlot(id);
    }

    @PostMapping("/{id}/book")
    public SlotResource bookSlot(@PathVariable Long id) {
        Slots bookedSlot = slotService.bookSlot(id);
        return slotResourceAssembler.toResource(bookedSlot);
    }

    @PostMapping("/{id}/cancel")
    public SlotResource cancelSlot(@PathVariable Long id) {
        Slots canceledSlot = slotService.cancelSlot(id);
        return slotResourceAssembler.toResource(canceledSlot);
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookSlotForUser(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> bookingDetails) {
        try {
            // Parse the token to extract the user ID
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token.replace("Bearer ", ""))
                    .getBody();
            Long userId = Long.parseLong(claims.getSubject());

            // Load the User from the database
            User userEntity = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if the user already has an appointment
            if (userEntity.getAppointment() != null) {
                return ResponseEntity.badRequest().body("User already has an appointment");
            }

            // Save the slot
            Slots savedSlot = slotService.bookSlotForUser(userEntity, LocalDate.parse(bookingDetails.get("date")),
                    LocalTime.parse(bookingDetails.get("time")));

            // Return the saved slot
            return ResponseEntity.ok(savedSlot);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to book slot: " + e.getMessage());
        }
    }

    @PutMapping("/appointment")
    public SlotResource updateAppointment(@RequestBody Map<String, String> updateDetails,
            @RequestHeader("Authorization") String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token.replace("Bearer ", ""))
                .getBody();
        Long userId = Long.parseLong(claims.getSubject());

        String date = updateDetails.get("date");
        String time = updateDetails.get("time");
        Slots updatedSlot = slotService.updateAppointment(userRepository.findByUserId(userId), LocalDate.parse(date),
                LocalTime.parse(time));
        return slotResourceAssembler.toResource(updatedSlot);
    }

    @DeleteMapping("/appointment/delete")
    public ResponseEntity<?> deleteAppointment(@RequestHeader("Authorization") String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token.replace("Bearer ", ""))
                    .getBody();
            Long userId = Long.parseLong(claims.getSubject());

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            slotService.deleteAppointment(user); // This calls slotRepository.delete(...)
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
