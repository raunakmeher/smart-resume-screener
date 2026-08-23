package com.smartresume.backend.controller;

import com.smartresume.backend.dto.JobRequest;
import com.smartresume.backend.entity.Job;
import com.smartresume.backend.repository.JobRepository;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import com.smartresume.backend.service.LLMService;
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository jobRepository;
    private final LLMService llmService;
    public JobController(
            JobRepository jobRepository,
            LLMService llmService) {

        this.jobRepository = jobRepository;
        this.llmService = llmService;
    }

    @PostMapping
    public ResponseEntity<?> createJob(
            @Valid @RequestBody JobRequest request) {

        Job job = new Job(
                request.getTitle(),
                request.getDescription()
        );

        Job savedJob = jobRepository.save(job);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Job created successfully",
                        "jobId", savedJob.getId(),
                        "title", savedJob.getTitle()
                )
        );
    }
    @PostMapping("/test-ai")
    public ResponseEntity<?> testAi(
            @RequestBody Map<String, String> request) {

        String description = request.get("description");

        if (description == null || description.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Job description is required"));
        }

        return ResponseEntity.ok(
                llmService.analyzeJob(description)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJob(@PathVariable Long id) {

        return jobRepository.findById(id)
                .map(job -> ResponseEntity.ok(
                        Map.of(
                                "id", job.getId(),
                                "title", job.getTitle(),
                                "description", job.getDescription()
                        )
                ))
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }
}