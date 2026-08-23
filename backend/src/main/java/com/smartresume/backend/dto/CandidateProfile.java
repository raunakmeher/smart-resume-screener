package com.smartresume.backend.dto;

import java.util.List;

public class CandidateProfile {

    private List<String> skills;
    private List<ExperienceItem> experience;
    private List<EducationItem> education;
    private List<String> projects;
    private double totalExperienceYears;

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public List<ExperienceItem> getExperience() {
        return experience;
    }

    public void setExperience(List<ExperienceItem> experience) {
        this.experience = experience;
    }

    public List<EducationItem> getEducation() {
        return education;
    }

    public void setEducation(List<EducationItem> education) {
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