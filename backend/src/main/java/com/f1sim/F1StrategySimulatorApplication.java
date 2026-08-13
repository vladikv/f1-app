package com.f1sim;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableScheduling
@EnableCaching
@EnableRetry
public class F1StrategySimulatorApplication {
    public static void main(String[] args) {
        SpringApplication.run(F1StrategySimulatorApplication.class, args);
    }
}
