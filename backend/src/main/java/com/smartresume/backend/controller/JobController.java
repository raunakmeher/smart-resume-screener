package com.smartresume.backend.controller;

import com.smartresume.backend.dto.JobRequest;
import com.smartresume.backend.entity.Job;
import com.smartresume.backend.repository.JobRepository;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import com.smartresume.backend.service.LLMService;
import com.smartresume.backend.service.ProfileAssembler;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartresume.backend.dto.JobProfile;
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository jobRepository;
    private final LLMService llmService;
    private final ProfileAssembler profileAssembler;
    public JobController(
            JobRepository jobRepository,
            LLMService llmService,
            ProfileAssembler profileAssembler) {

        this.jobRepository = jobRepository;
        this.llmService = llmService;
        this.profileAssembler = profileAssembler;
    }

    @PostMapping
    public ResponseEntity<?> createJob(
            @Valid @RequestBody JobRequest request) {

        Job job = new Job(
                request.getTitle(),
                request.getDescription()
        );

        job.setScreeningPrompt(
                request.getScreeningPrompt()
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

    @PostMapping("/{id}/analyze")
    public ResponseEntity<?> analyzeJob(
            @PathVariable Long id) {

        try {
            return jobRepository.findById(id)
                    .map(job -> {

                        JobProfile profile =
                                llmService.analyzeJob(
                                        job.getDescription()
                                );

                        try {
                            ObjectMapper objectMapper =
                                    new ObjectMapper();

                            job.setRequiredSkills(
                                    objectMapper.writeValueAsString(
                                            profile.getRequiredSkills()
                                    )
                            );

                            job.setPreferredSkills(
                                    objectMapper.writeValueAsString(
                                            profile.getPreferredSkills()
                                    )
                            );

                            job.setMinimumExperienceYears(
                                    profile.getMinimumExperienceYears()
                            );

                            job.setEducation(
                                    profile.getEducation()
                            );

                            job.setResponsibilities(
                                    objectMapper.writeValueAsString(
                                            profile.getResponsibilities()
                                    )
                            );

                            Job saved =
                                    jobRepository.save(job);

                            return ResponseEntity.ok(
                                    Map.of(
                                            "message",
                                            "Job analyzed successfully",
                                            "jobId",
                                            saved.getId(),
                                            "profile",
                                            profile
                                    )
                            );

                        } catch (Exception e) {
                            throw new RuntimeException(
                                    "Failed to save job profile",
                                    e
                            );
                        }
                    })
                    .orElseGet(() ->
                            ResponseEntity.notFound().build()
                    );

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(
                            Map.of(
                                    "error",
                                    "Job analysis failed"
                            )
                    );
        }
    }
    @GetMapping
    public ResponseEntity<?> listJobs() {

        List<Map<String, Object>> jobs =
                new ArrayList<>();

        for (Job job :
                jobRepository.findAllByOrderByCreatedAtDesc()) {

            Map<String, Object> summary =
                    new LinkedHashMap<>();

            summary.put("id", job.getId());
            summary.put("title", job.getTitle());
            summary.put(
                    "analyzed",
                    profileAssembler.isAnalyzed(job)
            );
            summary.put(
                    "hasScreeningPrompt",
                    job.getScreeningPrompt() != null
                            && !job.getScreeningPrompt().isBlank()
            );
            summary.put("createdAt", job.getCreatedAt());

            jobs.add(summary);
        }

        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJob(@PathVariable Long id) {

        return jobRepository.findById(id)
                .<ResponseEntity<?>>map(job -> {

                    Map<String, Object> body =
                            new LinkedHashMap<>();

                    body.put("id", job.getId());
                    body.put("title", job.getTitle());
                    body.put("description", job.getDescription());
                    body.put(
                            "screeningPrompt",
                            job.getScreeningPrompt()
                    );
                    body.put(
                            "analyzed",
                            profileAssembler.isAnalyzed(job)
                    );
                    body.put(
                            "profile",
                            profileAssembler.toJobProfile(job)
                    );
                    body.put("createdAt", job.getCreatedAt());

                    return ResponseEntity.ok(body);
                })
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }
}