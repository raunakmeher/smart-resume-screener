package com.smartresume.backend.dto;

import java.util.List;

public class CandidateProfile {

    private List<String> skills;
    private List<String> experience;
    private List<String> education;
    private List<String> projects;
    private double totalExperienceYears;

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public List<String> getExperience() {
        return experience;
    }

    public void setExperience(List<String> experience) {
        this.experience = experience;
    }

    public List<String> getEducation() {
        return education;
    }

    public void setEducation(List<String> education) {
        this.education = education;
    }

    public List<String> getProjects() {
        return projects;
    }

    public void setProjects(List<String> projects) {
        this.projects = projects;
    }

    public double getTotalExperienceYears() {
        return totalExperienceYears;
    }

    public void setTotalExperienceYears(double totalExperienceYears) {
        this.totalExperienceYears = totalExperienceYears;
    }
}