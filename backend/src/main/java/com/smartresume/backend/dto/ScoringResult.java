package com.smartresume.backend.dto;

public class ScoringResult {

    private double requiredSkillScore;
    private double semanticScore;
    private double experienceScore;
    private double preferredSkillScore;
    private double finalScore;

    public double getRequiredSkillScore() {
        return requiredSkillScore;
    }

    public void setRequiredSkillScore(double requiredSkillScore) {
        this.requiredSkillScore = requiredSkillScore;
    }

    public double getSemanticScore() {
        return semanticScore;
    }

    public void setSemanticScore(double semanticScore) {
        this.semanticScore = semanticScore;
    }

    public double getExperienceScore() {
        return experienceScore;
    }

    public void setExperienceScore(double experienceScore) {
        this.experienceScore = experienceScore;
    }

    public double getPreferredSkillScore() {
        return preferredSkillScore;
    }

    public void setPreferredSkillScore(double preferredSkillScore) {
        this.preferredSkillScore = preferredSkillScore;
    }

    public double getFinalScore() {
        return finalScore;
    }

    public void setFinalScore(double finalScore) {
        this.finalScore = finalScore;
    }
}