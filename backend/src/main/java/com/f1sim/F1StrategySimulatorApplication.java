package com.f1sim;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableScheduling
@EnableCaching
public class F1StrategySimulatorApplication {
    public static void main(String[] args) {
        SpringApplication.run(F1StrategySimulatorApplication.class, args);
    }
}
