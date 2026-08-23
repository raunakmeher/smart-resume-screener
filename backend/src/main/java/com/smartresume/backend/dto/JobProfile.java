package com.smartresume.backend.dto;

import java.util.List;

public class JobProfile {

    private List<String> requiredSkills;
    private List<String> preferredSkills;
    private double minimumExperienceYears;
    private String education;
    private List<String> responsibilities;

    public List<String> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<String> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public List<String> getPreferredSkills() {
        return preferredSkills;
    }

    public void setPreferredSkills(List<String> preferredSkills) {
        this.preferredSkills = preferredSkills;
    }

    public double getMinimumExperienceYears() {
        return minimumExperienceYears;
    }

    public void setMinimumExperienceYears(double minimumExperienceYears) {
        this.minimumExperienceYears = minimumExperienceYears;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public List<String> getResponsibilities() {
        return responsibilities;
    }

    public void setResponsibilities(List<String> responsibilities) {
        this.responsibilities = responsibilities;
    }
}