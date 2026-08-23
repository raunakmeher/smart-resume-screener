package com.smartresume.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadResume(
            @RequestPart(value = "file", required = false) MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Resume file is empty"));
        }

        String name = file.getOriginalFilename();

        if (name == null || !name.toLowerCase().endsWith(".pdf")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Only PDF resumes are supported"));
        }

        return ResponseEntity.ok(
                Map.of(
                        "message", "Resume uploaded successfully",
                        "fileName", name,
                        "size", file.getSize()
                )
        );
    }

    @PostMapping("/text")
    public ResponseEntity<?> submitResumeText(
            @RequestBody Map<String, String> request) {

        String text = request.get("text");

        if (text == null || text.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Resume text cannot be empty"));
        }

        return ResponseEntity.ok(
                Map.of(
                        "message", "Resume text received",
                        "length", text.length()
                )
        );
    }
}