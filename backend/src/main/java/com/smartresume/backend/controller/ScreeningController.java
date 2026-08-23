package com.smartresume.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartresume.backend.dto.CandidateProfile;
import com.smartresume.backend.dto.EducationItem;
import com.smartresume.backend.dto.ExperienceItem;
import com.smartresume.backend.dto.JobProfile;
import com.smartresume.backend.dto.MatchResult;
import com.smartresume.backend.dto.ScoringResult;
import com.smartresume.backend.entity.Job;
import com.smartresume.backend.entity.Resume;
import com.smartresume.backend.repository.JobRepository;
import com.smartresume.backend.repository.ResumeRepository;
import com.smartresume.backend.repository.ScreeningResultRepository;
import com.smartresume.backend.service.BiasFilterService;
import com.smartresume.backend.service.LLMService;
import com.smartresume.backend.service.ScoringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/screening")
public class ScreeningController {

    private final BiasFilterService biasFilterService;
    private final ResumeRepository resumeRepository;
    private final JobRepository jobRepository;
    private final ScreeningResultRepository screeningResultRepository;
    private final LLMService llmService;
    private final ObjectMapper objectMapper;
    private final ScoringService scoringService;

    public ScreeningController(
            ResumeRepository resumeRepository,
            JobRepository jobRepository,
            ScreeningResultRepository screeningResultRepository,
            LLMService llmService,
            ScoringService scoringService,
            BiasFilterService biasFilterService) {

        this.resumeRepository = resumeRepository;
        this.jobRepository = jobRepository;
        this.screeningResultRepository =
                screeningResultRepository;
        this.llmService = llmService;
        this.scoringService = scoringService;
        this.biasFilterService = biasFilterService;
        this.objectMapper = new ObjectMapper();
    }

    @PostMapping("/resume/{resumeId}/job/{jobId}")
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
                                            ExperienceItem.class
                                    )
                    )
            );

            candidate.setEducation(
                    objectMapper.readValue(
                            resume.getEducation(),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(
                                            List.class,
                                            EducationItem.class
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

            System.out.println(

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


            MatchResult match =
                    llmService.matchCandidate(
                            filteredCandidate,
                            jobProfile,
                            job.getScreeningPrompt()
                    );


            ScoringResult scoring =
                    scoringService.calculate(
                            filteredCandidate,
                            jobProfile,
                            match
                    );


            return ResponseEntity.ok(
                    Map.of(
                            "resumeId",
                            resumeId,
                            "jobId",
                            jobId,
                            "match",
                            match,
                            "scoring",
                            scoring
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            Map.of(
                                    "error",
                                    "Candidate screening failed",
                                    "details",
                                    e.toString()
                            )
                    );
        }
    }

    @PostMapping("/test-skill-gap")
    public ResponseEntity<?> testSkillGap(
            @RequestBody Map<String, Object> request) {

        try {

            CandidateProfile candidate =
                    objectMapper.convertValue(
                            request.get("candidate"),
                            CandidateProfile.class
                    );

            JobProfile job =
                    objectMapper.convertValue(
                            request.get("job"),
                            JobProfile.class
                    );

            return ResponseEntity.ok(
                    llmService.analyzeSkillGap(
                            candidate,
                            job
                    )
            );

        } catch (Exception e) {



            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    "Invalid candidate or job profile"
                            )
                    );
        }
    }
}