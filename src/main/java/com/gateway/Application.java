package com.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

import com.gateway.filter.JwtGatewayFilter;

@SpringBootApplication
public class Application {

        public static void main(String[] args) {
                SpringApplication.run(Application.class, args);
        }

        @Bean
        public RouteLocator routeLocator(RouteLocatorBuilder builder) {
                return builder.routes()
                                // Route for Slots
                                .route("slots-route", r -> r.path("/slots/**")
                                                .filters(f -> f
                                                                .filter(new JwtGatewayFilter()) // Apply JWT filter

                                                )
                                                .uri("lb://appointments-server")) // Route to slots service
                                // Route for Auth
                                .route("auth-route", r -> r.path("/auth/**")

                                                .uri("lb://auth-server")) // Route to auth service
                                .route("admin-route", r -> r.path("/admin/**")
                                                .filters(f -> f.filter(new JwtGatewayFilter()))
                                                .uri("lb://appointments-server"))
                                .build();
        }
}
