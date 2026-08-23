package com.smartresume.backend.controller;

import com.smartresume.backend.entity.Resume;
import com.smartresume.backend.repository.ResumeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;
import com.smartresume.backend.service.LLMService;
import com.smartresume.backend.service.ResumeParserService;
@RestController
@RequestMapping("/api/resumes")
public class ResumeController {
    private final ResumeParserService resumeParserService;
    private final ResumeRepository resumeRepository;
    private final LLMService llmService;

    public ResumeController(
            ResumeParserService resumeParserService,
            ResumeRepository resumeRepository,
            LLMService llmService) {

        this.resumeParserService = resumeParserService;
        this.resumeRepository = resumeRepository;
        this.llmService = llmService;
    }
    @PostMapping("/test-ai")
    public ResponseEntity<?> testAi(
            @RequestBody Map<String, String> request) {

        String text = request.get("text");

        if (text == null || text.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Text is required"));
        }

        return ResponseEntity.ok(
                llmService.analyzeResume(text)
        );
    }
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadResume(
            @RequestPart(value = "file", required = false) MultipartFile file) {

        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Resume file is empty"));
            }

            String name = file.getOriginalFilename();

            if (name == null || !name.toLowerCase().endsWith(".pdf")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Only PDF resumes are supported"));
            }

            String text = resumeParserService.extractText(file);

            if (text.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Could not extract text from resume"));
            }

            Resume resume = new Resume(name, text);

            Resume savedResume = resumeRepository.save(resume);

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Resume uploaded and stored successfully",
                            "resumeId", savedResume.getId(),
                            "fileName", savedResume.getFileName(),
                            "textLength", savedResume.getRawText().length()
                    )
            );

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to read PDF"));
        }
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