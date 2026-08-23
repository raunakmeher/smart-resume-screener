package com.smartresume.backend.service;

import com.smartresume.backend.dto.CandidateProfile;
import com.smartresume.backend.dto.JobProfile;
import com.smartresume.backend.dto.MatchResult;
import com.smartresume.backend.dto.ScoringResult;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ScoringService {

    public ScoringResult calculate(
            CandidateProfile candidate,
            JobProfile job,
            MatchResult match) {

        double required =
                requiredSkillScore(
                        candidate.getSkills(),
                        job.getRequiredSkills()
                );

        double preferred =
                requiredSkillScore(
                        candidate.getSkills(),
                        job.getPreferredSkills()
                );

        double experience =
                experienceScore(
                        candidate.getTotalExperienceYears(),
                        job.getMinimumExperienceYears()
                );

        double semantic =
                match.getMatchScore();

        double finalScore =
                required * 0.40
                        + semantic * 0.30
                        + experience * 0.20
                        + preferred * 0.10;

        ScoringResult result = new ScoringResult();

        result.setRequiredSkillScore(required);
        result.setSemanticScore(semantic);
        result.setExperienceScore(experience);
        result.setPreferredSkillScore(preferred);
        result.setFinalScore(
                Math.round(finalScore * 100.0) / 100.0
        );

        return result;
    }

    private double requiredSkillScore(
            List<String> candidateSkills,
            List<String> jobSkills) {

        if (jobSkills == null || jobSkills.isEmpty()) {
            return 100;
        }

        if (candidateSkills == null || candidateSkills.isEmpty()) {
            return 0;
        }

        Set<String> candidate =
                normalize(candidateSkills);

        Set<String> required =
                normalize(jobSkills);

        long matched =
                required.stream()
                        .filter(candidate::contains)
                        .count();

        return matched * 100.0 / required.size();
    }

    private double experienceScore(
            double candidateYears,
            double requiredYears) {

        if (requiredYears <= 0) {
            return 100;
        }

        if (candidateYears >= requiredYears) {
            return 100;
        }

        return Math.max(
                0,
                candidateYears / requiredYears * 100
        );
    }

    private Set<String> normalize(
            List<String> skills) {

        Set<String> result = new HashSet<>();

        for (String skill : skills) {
            result.add(
                    skill.trim().toLowerCase()
            );
        }

        return result;
    }
}