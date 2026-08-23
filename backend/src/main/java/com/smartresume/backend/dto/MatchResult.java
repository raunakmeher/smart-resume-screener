package com.smartresume.backend.dto;

import java.util.List;

public class MatchResult {

    private double matchScore;
    private List<String> matchedSkills;
    private List<String> missingRequiredSkills;
    private List<String> preferredSkillsMatched;
    private boolean experienceFit;
    private boolean educationFit;
    private String summary;

    public double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(double matchScore) {
        this.matchScore = matchScore;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingRequiredSkills() {
        return missingRequiredSkills;
    }

    public void setMissingRequiredSkills(List<String> missingRequiredSkills) {
        this.missingRequiredSkills = missingRequiredSkills;
    }

    public List<String> getPreferredSkillsMatched() {
        return preferredSkillsMatched;
    }

    public void setPreferredSkillsMatched(List<String> preferredSkillsMatched) {
        this.preferredSkillsMatched = preferredSkillsMatched;
    }

    public boolean isExperienceFit() {
        return experienceFit;
    }

    public void setExperienceFit(boolean experienceFit) {
        this.experienceFit = experienceFit;
    }

    public boolean isEducationFit() {
        return educationFit;
    }

    public void setEducationFit(boolean educationFit) {
        this.educationFit = educationFit;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}