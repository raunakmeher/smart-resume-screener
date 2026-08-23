package com.smartresume.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartresume.backend.dto.CandidateProfile;
import com.smartresume.backend.dto.JobProfile;
import com.smartresume.backend.dto.MatchResult;
import com.smartresume.backend.entity.Job;
import com.smartresume.backend.entity.Resume;
import com.smartresume.backend.entity.ScreeningResult;
import com.smartresume.backend.repository.JobRepository;
import com.smartresume.backend.repository.ResumeRepository;
import com.smartresume.backend.repository.ScreeningResultRepository;
import com.smartresume.backend.service.LLMService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/screening")
public class ScreeningController {

    private final ResumeRepository resumeRepository;
    private final JobRepository jobRepository;
    private final ScreeningResultRepository screeningResultRepository;
    private final LLMService llmService;
    private final ObjectMapper objectMapper;

    public ScreeningController(
            ResumeRepository resumeRepository,
            JobRepository jobRepository,
            ScreeningResultRepository screeningResultRepository,
            LLMService llmService) {

        this.resumeRepository = resumeRepository;
        this.jobRepository = jobRepository;
        this.screeningResultRepository =
                screeningResultRepository;
        this.llmService = llmService;
        this.objectMapper = new ObjectMapper();
    }

    @PostMapping(
            "/resume/{resumeId}/job/{jobId}"
    )
    public ResponseEntity<?> screenCandidate(
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
                                            java.util.List.class,
                                            String.class
                                    )
                    )
            );

            candidate.setExperience(
                    objectMapper.readValue(
                            resume.getExperience(),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(
                                            java.util.List.class,
                                            com.smartresume.backend.dto.ExperienceItem.class
                                    )
                    )
            );

            candidate.setEducation(
                    objectMapper.readValue(
                            resume.getEducation(),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(
                                            java.util.List.class,
                                            com.smartresume.backend.dto.EducationItem.class
                                    )
                    )
            );

            candidate.setProjects(
                    objectMapper.readValue(
                            resume.getProjects(),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(
                                            java.util.List.class,
                                            String.class
                                    )
                    )
            );

            candidate.setTotalExperienceYears(
                    resume.getTotalExperienceYears()
            );

            JobProfile jobProfile = new JobProfile();

            jobProfile.setRequiredSkills(
                    objectMapper.readValue(
                            job.getRequiredSkills(),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(
                                            java.util.List.class,
                                            String.class
                                    )
                    )
            );

            jobProfile.setPreferredSkills(
                    objectMapper.readValue(
                            job.getPreferredSkills(),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(
                                            java.util.List.class,
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
                                            java.util.List.class,
                                            String.class
                                    )
                    )
            );

            MatchResult match =
                    llmService.matchCandidate(
                            candidate,
                            jobProfile,
                            job.getScreeningPrompt()
                    );

            ScreeningResult result =
                    screeningResultRepository
                            .findByResumeIdAndJobId(
                                    resumeId,
                                    jobId
                            )
                            .orElse(new ScreeningResult());

            result.setResumeId(resumeId);
            result.setJobId(jobId);
            result.setMatchScore(
                    match.getMatchScore()
            );

            result.setMatchedSkills(
                    objectMapper.writeValueAsString(
                            match.getMatchedSkills()
                    )
            );

            result.setMissingRequiredSkills(
                    objectMapper.writeValueAsString(
                            match.getMissingRequiredSkills()
                    )
            );

            result.setPreferredSkillsMatched(
                    objectMapper.writeValueAsString(
                            match.getPreferredSkillsMatched()
                    )
            );

            result.setExperienceFit(
                    match.isExperienceFit()
            );

            result.setEducationFit(
                    match.isEducationFit()
            );

            result.setSummary(
                    match.getSummary()
            );

            ScreeningResult saved =
                    screeningResultRepository.save(result);

            return ResponseEntity.ok(
                    Map.of(
                            "screeningId",
                            saved.getId(),
                            "resumeId",
                            resumeId,
                            "jobId",
                            jobId,
                            "result",
                            match
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .body(
                            Map.of(
                                    "error",
                                    "Candidate screening failed"
                            )
                    );
        }
    }
}