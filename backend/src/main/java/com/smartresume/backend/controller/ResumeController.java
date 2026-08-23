package com.smartresume.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartresume.backend.dto.CandidateProfile;
import com.smartresume.backend.entity.Resume;
import com.smartresume.backend.repository.ResumeRepository;
import com.smartresume.backend.service.LLMService;
import com.smartresume.backend.service.ProfileAssembler;
import com.smartresume.backend.service.ResumeParserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.smartresume.backend.dto.JobProfile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeParserService resumeParserService;
    private final ResumeRepository resumeRepository;
    private final LLMService llmService;
    private final ProfileAssembler profileAssembler;


    public ResumeController(
            ResumeParserService resumeParserService,
            ResumeRepository resumeRepository,
            LLMService llmService,
            ProfileAssembler profileAssembler) {

        this.resumeParserService = resumeParserService;
        this.resumeRepository = resumeRepository;
        this.llmService = llmService;
        this.profileAssembler = profileAssembler;
    }

    @GetMapping
    public ResponseEntity<?> listResumes() {

        List<Map<String, Object>> resumes =
                new ArrayList<>();

        for (Resume resume :
                resumeRepository.findAllByOrderByCreatedAtDesc()) {

            Map<String, Object> summary =
                    new LinkedHashMap<>();

            summary.put("id", resume.getId());
            summary.put("fileName", resume.getFileName());
            summary.put(
                    "analyzed",
                    profileAssembler.isAnalyzed(resume)
            );
            summary.put(
                    "totalExperienceYears",
                    resume.getTotalExperienceYears()
            );
            summary.put("createdAt", resume.getCreatedAt());

            resumes.add(summary);
        }

        return ResponseEntity.ok(resumes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getResume(@PathVariable Long id) {

        return resumeRepository.findById(id)
                .<ResponseEntity<?>>map(resume -> {

                    Map<String, Object> body =
                            new LinkedHashMap<>();

                    body.put("id", resume.getId());
                    body.put("fileName", resume.getFileName());
                    body.put(
                            "textLength",
                            resume.getRawText() == null
                                    ? 0
                                    : resume.getRawText().length()
                    );
                    body.put(
                            "analyzed",
                            profileAssembler.isAnalyzed(resume)
                    );
                    body.put("createdAt", resume.getCreatedAt());
                    body.put(
                            "profile",
                            profileAssembler.toCandidateProfile(resume)
                    );

                    return ResponseEntity.ok(body);
                })
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
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
            @RequestPart(value = "file", required = false)
            MultipartFile file) {

        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Resume file is empty"));
            }

            String name = file.getOriginalFilename();

            if (name == null ||
                    !name.toLowerCase().endsWith(".pdf")) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Only PDF resumes are supported"
                        ));
            }

            String text = resumeParserService.extractText(file);

            if (text.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Could not extract text from resume"
                        ));
            }

            Resume resume = new Resume(name, text);

            Resume savedResume =
                    resumeRepository.save(resume);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Resume uploaded and stored successfully",
                            "resumeId",
                            savedResume.getId(),
                            "fileName",
                            savedResume.getFileName(),
                            "textLength",
                            savedResume.getRawText().length()
                    )
            );

        } catch (IOException e) {

            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "error",
                            "Failed to read PDF"
                    ));
        }
    }

    @PostMapping("/{id}/analyze")
    public ResponseEntity<?> analyzeResume(
            @PathVariable Long id) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {

            return resumeRepository.findById(id)
                    .map(resume -> {

                        CandidateProfile profile =
                                llmService.analyzeResume(
                                        resume.getRawText()
                                );

                        try {

                            resume.setSkills(
                                    objectMapper.writeValueAsString(
                                            profile.getSkills()
                                    )
                            );

                            resume.setExperience(
                                    objectMapper.writeValueAsString(
                                            profile.getExperience()
                                    )
                            );

                            resume.setEducation(
                                    objectMapper.writeValueAsString(
                                            profile.getEducation()
                                    )
                            );

                            resume.setProjects(
                                    objectMapper.writeValueAsString(
                                            profile.getProjects()
                                    )
                            );

                            resume.setTotalExperienceYears(
                                    profile.getTotalExperienceYears()
                            );

                            Resume saved =
                                    resumeRepository.save(resume);

                            return ResponseEntity.ok(
                                    Map.of(
                                            "message",
                                            "Resume analyzed successfully",
                                            "resumeId",
                                            saved.getId(),
                                            "profile",
                                            profile
                                    )
                            );

                        } catch (Exception e) {

                            throw new RuntimeException(
                                    "Failed to serialize candidate profile",
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
                                    "Resume analysis failed"
                            )
                    );
        }
    }

    @PostMapping("/text")
    public ResponseEntity<?> submitResumeText(
            @RequestBody Map<String, String> request) {

        String text = request.get("text");

        if (text == null || text.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            "Resume text cannot be empty"
                    ));
        }

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Resume text received",
                        "length",
                        text.length()
                )
        );
    }
    @PostMapping("/test-match")
    public ResponseEntity<?> testMatch(
            @RequestBody Map<String, Object> request) {
        ObjectMapper objectMapper = new ObjectMapper();
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
            String screeningPrompt =
                    (String) request.get("screeningPrompt");

            return ResponseEntity.ok(
                    llmService.matchCandidate(
                            candidate,
                            job,
                            screeningPrompt
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