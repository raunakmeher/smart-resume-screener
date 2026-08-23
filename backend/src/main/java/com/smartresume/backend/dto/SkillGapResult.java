package com.smartresume.backend.dto;

import java.util.List;

public class SkillGapResult {

    private List<String> missingRequiredSkills;
    private List<String> missingPreferredSkills;
    private List<String> matchedSkills;
    private String experienceGap;
    private List<String> recommendations;

    public List<String> getMissingRequiredSkills() {
        return missingRequiredSkills;
    }

    public void setMissingRequiredSkills(
            List<String> missingRequiredSkills) {
        this.missingRequiredSkills = missingRequiredSkills;
    }

    public List<String> getMissingPreferredSkills() {
        return missingPreferredSkills;
    }

    public void setMissingPreferredSkills(
            List<String> missingPreferredSkills) {
        this.missingPreferredSkills =
                missingPreferredSkills;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(
            List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public String getExperienceGap() {
        return experienceGap;
    }

    public void setExperienceGap(
            String experienceGap) {
        this.experienceGap = experienceGap;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(
            List<String> recommendations) {
        this.recommendations = recommendations;
    }
}