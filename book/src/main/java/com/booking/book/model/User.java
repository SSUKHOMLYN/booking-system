package com.booking.book.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id") // Matches the database column name
    private Long userId;

    @Column(name = "u_role")
    private String role;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @JsonBackReference
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true) // One-to-One mapping
    private Slots appointment;

    // Getters and Setters
    public Long getId() {
        return userId;
    }

    public void setId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Slots getAppointment() {
        return appointment;
    }

    public void setAppointment(Slots appointment) {
        this.appointment = appointment;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return this.role;
    }

}
