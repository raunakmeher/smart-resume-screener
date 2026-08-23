package com.smartresume.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "screening_results",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"resume_id", "job_id"}
                )
        }
)
public class ScreeningResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "resume_id", nullable = false)
    private Long resumeId;

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    private Double matchScore;

    @Column(columnDefinition = "TEXT")
    private String matchedSkills;

    @Column(columnDefinition = "TEXT")
    private String missingRequiredSkills;

    @Column(columnDefinition = "TEXT")
    private String preferredSkillsMatched;

    private Boolean experienceFit;

    private Boolean educationFit;

    @Column(columnDefinition = "TEXT")
    private String summary;

    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public Long getResumeId() {
        return resumeId;
    }

    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public Double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Double matchScore) {
        this.matchScore = matchScore;
    }

    public String getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(String matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public String getMissingRequiredSkills() {
        return missingRequiredSkills;
    }

    public void setMissingRequiredSkills(String missingRequiredSkills) {
        this.missingRequiredSkills = missingRequiredSkills;
    }

    public String getPreferredSkillsMatched() {
        return preferredSkillsMatched;
    }

    public void setPreferredSkillsMatched(String preferredSkillsMatched) {
        this.preferredSkillsMatched = preferredSkillsMatched;
    }

    public Boolean getExperienceFit() {
        return experienceFit;
    }

    public void setExperienceFit(Boolean experienceFit) {
        this.experienceFit = experienceFit;
    }

    public Boolean getEducationFit() {
        return educationFit;
    }

    public void setEducationFit(Boolean educationFit) {
        this.educationFit = educationFit;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}