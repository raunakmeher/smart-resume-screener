package com.smartresume.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String rawText;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String experience;

    @Column(columnDefinition = "TEXT")
    private String education;

    @Column(columnDefinition = "TEXT")
    private String projects;

    private Double totalExperienceYears;

    private LocalDateTime createdAt;

    public Resume() {
    }

    public Resume(String fileName, String rawText) {
        this.fileName = fileName;
        this.rawText = rawText;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getFileName() {
        return fileName;
    }

    public String getRawText() {
        return rawText;
    }

    public String getSkills() {
        return skills;
    }

    public String getExperience() {
        return experience;
    }

    public String getEducation() {
        return education;
    }

    public String getProjects() {
        return projects;
    }

    public Double getTotalExperienceYears() {
        return totalExperienceYears;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void setRawText(String rawText) {
        this.rawText = rawText;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public void setProjects(String projects) {
        this.projects = projects;
    }

    public void setTotalExperienceYears(
            Double totalExperienceYears) {

        this.totalExperienceYears = totalExperienceYears;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}