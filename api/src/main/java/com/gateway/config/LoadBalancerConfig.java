package com.gateway.config;

import org.springframework.cloud.client.DefaultServiceInstance;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.loadbalancer.core.ServiceInstanceListSupplier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Flux;


import java.util.List;

@Configuration
public class LoadBalancerConfig {

    @Bean
    public ServiceInstanceListSupplier staticServiceInstanceListSupplier() {
        return new ServiceInstanceListSupplier() {
            @Override
            public String getServiceId() {
                return "appointments-server";
            }

            @Override
            public Flux<List<ServiceInstance>> get() {
                return Flux.just(List.of(
                    new DefaultServiceInstance("instance1", "appointments-server", "localhost", 8082, false),
                    new DefaultServiceInstance("instance2", "auth-server", "localhost", 8080, false)
                ));
            }
        };
    }
}
