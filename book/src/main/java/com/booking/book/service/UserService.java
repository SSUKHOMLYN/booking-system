package com.booking.book.service;

// import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.booking.book.model.User;


import com.booking.book.repository.UserRepository;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Long validateUser(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isPresent()) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        if (!password.equals(user.get().getPassword())) { // Compare passwords
            throw new IllegalArgumentException("Invalid username or password");
        }

        return user.get().getId(); // Return userId
    }
}
