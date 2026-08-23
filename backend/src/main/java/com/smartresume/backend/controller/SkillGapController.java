package com.smartresume.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartresume.backend.dto.CandidateProfile;
import com.smartresume.backend.dto.JobProfile;
import com.smartresume.backend.dto.SkillGapResult;
import com.smartresume.backend.entity.Job;
import com.smartresume.backend.entity.Resume;
import com.smartresume.backend.repository.JobRepository;
import com.smartresume.backend.repository.ResumeRepository;
import com.smartresume.backend.service.LLMService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import com.smartresume.backend.service.BiasFilterService;
@RestController
@RequestMapping("/api/skill-gap")
public class SkillGapController {

    private final ResumeRepository resumeRepository;
    private final JobRepository jobRepository;
    private final LLMService llmService;
    private final ObjectMapper objectMapper;
    private final BiasFilterService biasFilterService;
    public SkillGapController(
            ResumeRepository resumeRepository,
            JobRepository jobRepository,
            LLMService llmService,

            BiasFilterService biasFilterService) {

        this.resumeRepository = resumeRepository;
        this.jobRepository = jobRepository;
        this.llmService = llmService;
        this.objectMapper = new ObjectMapper();
        this.biasFilterService =
                biasFilterService;
    }

    @PostMapping("/resume/{resumeId}/job/{jobId}")
    public ResponseEntity<?> analyzeSkillGap(
            @PathVariable Long resumeId,
            @PathVariable Long jobId) {

        try {

            Resume resume = resumeRepository
                    .findById(resumeId)
                    .orElse(null);

            if (resume == null) {
                return ResponseEntity.notFound().build();
            }

            Job job = jobRepository
                    .findById(jobId)
                    .orElse(null);

            if (job == null) {
                return ResponseEntity.notFound().build();
            }

            CandidateProfile candidate =
                    new CandidateProfile();

            candidate.setSkills(
                    objectMapper.readValue(
                            resume.getSkills(),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(
                                            List.class,
                                            String.class
                                    )
                    )
            );

            candidate.setExperience(
                    objectMapper.readValue(
                            resume.getExperience(),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(
                                            List.class,
                                            com.smartresume.backend.dto.ExperienceItem.class
                                    )
                    )
            );

            candidate.setEducation(
                    objectMapper.readValue(
                            resume.getEducation(),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(
                                            List.class,
                                            com.smartresume.backend.dto.EducationItem.class
                                    )
                    )
            );

            candidate.setProjects(
                    objectMapper.readValue(
                            resume.getProjects(),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(
                                            List.class,
                                            String.class
                                    )
                    )
            );

            candidate.setTotalExperienceYears(
                    resume.getTotalExperienceYears()
            );

            JobProfile jobProfile =
                    new JobProfile();

            jobProfile.setRequiredSkills(
                    objectMapper.readValue(
                            job.getRequiredSkills(),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(
                                            List.class,
                                            String.class
                                    )
                    )
            );

            jobProfile.setPreferredSkills(
                    objectMapper.readValue(
                            job.getPreferredSkills(),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(
                                            List.class,
                                            String.class
                                    )
                    )
            );

            jobProfile.setMinimumExperienceYears(
                    job.getMinimumExperienceYears()
            );

            jobProfile.setEducation(
                    job.getEducation()
            );

            jobProfile.setResponsibilities(
                    objectMapper.readValue(
                            job.getResponsibilities(),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(
                                            List.class,
                                            String.class
                                    )
                    )
            );

            CandidateProfile filteredCandidate =
                    biasFilterService.filter(candidate);

            SkillGapResult result =
                    llmService.analyzeSkillGap(
                            filteredCandidate,
                            jobProfile
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "resumeId",
                            resumeId,
                            "jobId",
                            jobId,
                            "skillGap",
                            result
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .body(
                            Map.of("error",
                                    "Skill gap analysis failed",
                                    "details",
                                    e.getMessage()
                            )
                    );
        }
    }
}