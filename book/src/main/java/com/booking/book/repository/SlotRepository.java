package com.booking.book.repository;

import com.booking.book.model.Slots;
import com.booking.book.model.User;
import com.booking.book.model.SlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface SlotRepository extends JpaRepository<Slots, Long> {
    List<Slots> findByStatus(SlotStatus status);

    Optional<Slots> findByDateAndTime(LocalDate date, LocalTime time);

    Optional<Slots> findByUser(User user);

    boolean existsByDateAndTimeAndStatus(LocalDate date, LocalTime time, SlotStatus status);
}
