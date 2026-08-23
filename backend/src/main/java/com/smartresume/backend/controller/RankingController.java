package com.smartresume.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartresume.backend.entity.ScreeningResult;
import com.smartresume.backend.repository.ScreeningResultRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ranking")
public class RankingController {

    private final ScreeningResultRepository repository;
    private final ObjectMapper objectMapper;

    public RankingController(
            ScreeningResultRepository repository) {

        this.repository = repository;
        this.objectMapper = new ObjectMapper();
    }



    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> rankCandidates(
            @PathVariable Long jobId,
            @RequestParam(
                    defaultValue = "70"
            ) double threshold) {

        try {

            List<ScreeningResult> results =
                    repository.findByJobIdOrderByFinalScoreDesc(
                            jobId
                    );

            List<Map<String, Object>> ranked =
                    new ArrayList<>();

            int rank = 1;

            for (ScreeningResult result : results) {

                Map<String, Object> candidate =
                        new LinkedHashMap<>();

                candidate.put("rank", rank++);
                candidate.put(
                        "resumeId",
                        result.getResumeId()
                );
                candidate.put(
                        "finalScore",
                        result.getFinalScore()
                );
                candidate.put(
                        "shortlisted",
                        result.getFinalScore() >= threshold
                );
                candidate.put(
                        "semanticScore",
                        result.getSemanticScore()
                );
                candidate.put(
                        "requiredSkillScore",
                        result.getRequiredSkillScore()
                );
                candidate.put(
                        "experienceScore",
                        result.getExperienceScore()
                );
                candidate.put(
                        "preferredSkillScore",
                        result.getPreferredSkillScore()
                );
                candidate.put(
                        "matchedSkills",
                        objectMapper.readTree(
                                result.getMatchedSkills()
                        )
                );
                candidate.put(
                        "missingRequiredSkills",
                        objectMapper.readTree(
                                result.getMissingRequiredSkills()
                        )
                );
                candidate.put(
                        "summary",
                        result.getSummary()
                );

                ranked.add(candidate);
            }

            return ResponseEntity.ok(
                    Map.of(
                            "jobId",
                            jobId,
                            "candidateCount",
                            ranked.size(),
                            "candidates",
                            ranked
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .body(
                            Map.of(
                                    "error",
                                    "Failed to rank candidates"
                            )
                    );
        }
    }
}