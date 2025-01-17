package com.booking.book.service;

import com.booking.book.model.Slots;
import com.booking.book.model.User;
import com.booking.book.model.SlotStatus;
import com.booking.book.repository.SlotRepository;
import com.booking.book.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class SlotService {
    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Slots> getAllSlots() {
        return slotRepository.findByStatus(SlotStatus.BOOKED);
    }

    public Slots getSlotById(Long id) {
        return slotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
    }

    public Slots createSlot(Slots slot) {
        return slotRepository.save(slot);
    }

    public Slots updateSlot(Long id, Slots updatedSlot) {
        Slots slot = getSlotById(id);
        slot.setDate(updatedSlot.getDate());
        slot.setTime(updatedSlot.getTime());
        slot.setRoomNumber(updatedSlot.getRoomNumber());
        slot.setRegistrarName(updatedSlot.getRegistrarName());
        slot.setStatus(updatedSlot.getStatus());
        return slotRepository.save(slot);
    }

    @Transactional
    public void deleteSlot(Long id) {
        Slots slot = slotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Slot not found for ID: " + id));

        // Break the relationship from the user side
        User user = slot.getUser();
        if (user != null) {
            user.setAppointment(null);
            userRepository.save(user);
        }

        slotRepository.delete(slot);
    }

    public List<Slots> getAvailableSlots() {
        return slotRepository.findByStatus(SlotStatus.AVAILABLE);
    }

    public Slots bookSlot(Long id) {
        Slots slot = getSlotById(id);
        if (slot.getStatus() == SlotStatus.BOOKED) {
            throw new IllegalStateException("Slot already booked");
        }
        slot.setStatus(SlotStatus.BOOKED);
        return slotRepository.save(slot);
    }

    public Slots cancelSlot(Long id) {
        Slots slot = getSlotById(id);
        if (slot.getStatus() == SlotStatus.AVAILABLE) {
            throw new IllegalStateException("Slot is already available");
        }
        slot.setStatus(SlotStatus.AVAILABLE);
        return slotRepository.save(slot);
    }

    // New or Updated Methods for User-Specific Appointment Logic

    public Slots getAppointment(User user) {
        return slotRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("No appointment found for userId: " + user));
    }

    public Slots bookSlotForUser(User user, LocalDate date, LocalTime time) {
        // 1) Check if the user already has an appointment
        if (slotRepository.findByUser(user).isPresent()) {
            throw new IllegalStateException("User already has an appointment");
        }

        // 2) Strict check if the date and time are already booked
        if (slotRepository.existsByDateAndTimeAndStatus(date, time, SlotStatus.BOOKED)) {
            throw new IllegalArgumentException("That date/time is already booked");
        }

        // 3) Create and assign the slot to the user
        Slots slot = new Slots();
        slot.setDate(date);
        slot.setTime(time);
        slot.setRoomNumber("A0");
        slot.setRegistrarName("JORJE");
        slot.setStatus(SlotStatus.BOOKED);
        slot.setUser(user);

        return slotRepository.save(slot);
    }

    public Slots updateAppointment(User user, LocalDate newDate, LocalTime newTime) {
        // Retrieve the user's current appointment
        Slots currentSlot = slotRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("No appointment found for userId: " + user));

        // Update the slot details
        currentSlot.setDate(newDate);
        currentSlot.setTime(newTime);

        // Save and return the updated slot
        return slotRepository.save(currentSlot);
    }

    @Transactional
    public void deleteAppointment(User user) {
        Slots slot = slotRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("No appointment found for this user"));

        // Break the parent-child relationship first
        user.setAppointment(null);
        // The call below ensures JPA sees the user is no longer referencing 'slot'
        userRepository.save(user);

        // Optionally, you can STILL remove the slot manually, but typically setting
        // user.setAppointment(null) + orphanRemoval will do the job.
        slotRepository.delete(slot);
    }

    // Helper Method to Check Slot Availability
    private boolean isSlotAvailable(LocalDate date, LocalTime time) {
        return slotRepository.findByDateAndTime(date, time).isEmpty();
    }
}