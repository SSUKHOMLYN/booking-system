package com.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Application {
        public static void main(String[] args) {
                SpringApplication.run(Application.class, args);
        }

        @Bean
        public RouteLocator routeLocator(RouteLocatorBuilder builder) {
                return builder.routes()
                                .route("auth-route", r -> r.path("/auth/**")
                                                .uri("lb://auth-server"))
                                .route("slots-route", r -> r.path("/slots/**")
                                                .uri("lb://appointments-server"))
                                .route("admin-route", r -> r.path("/admin/**")
                                                .uri("lb://appointments-server"))
                                .build();
        }
}