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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void setRawText(String rawText) {
        this.rawText = rawText;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}