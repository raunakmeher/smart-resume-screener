package com.smartresume.backend.controller;

import com.smartresume.backend.dto.JobRequest;
import com.smartresume.backend.entity.Job;
import com.smartresume.backend.repository.JobRepository;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository jobRepository;

    public JobController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
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