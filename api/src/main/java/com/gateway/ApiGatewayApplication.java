package com.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-route", r -> r.path("/auth/**")
                        .uri("https://cc-book-app-735691842d39.herokuapp.com")) // Replace with the Auth service URL
                .route("slots-route", r -> r.path("/slots/**")
                        .uri("https://cc-book-app-735691842d39.herokuapp.com")) // Replace with the Appointments service URL
                .route("admin-route", r -> r.path("/admin/**")
                        .uri("https://cc-book-app-735691842d39.herokuapp.com")) // Replace with the Admin route URL
                .build();
    }
}
