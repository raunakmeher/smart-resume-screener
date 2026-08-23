package com.smartresume.backend.controller;

import com.smartresume.backend.service.BiasAwareService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bias")
public class BiasController {

    private final BiasAwareService biasAwareService;

    public BiasController(
            BiasAwareService biasAwareService) {

        this.biasAwareService =
                biasAwareService;
    }

    @GetMapping("/audit")
    public ResponseEntity<?> audit() {

        return ResponseEntity.ok(
                biasAwareService.audit()
        );
    }
}