package com.smartresume.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartresume.backend.dto.CandidateProfile;
import com.smartresume.backend.dto.EducationItem;
import com.smartresume.backend.dto.ExperienceItem;
import com.smartresume.backend.dto.JobProfile;
import com.smartresume.backend.entity.Job;
import com.smartresume.backend.entity.Resume;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ProfileAssembler {

    private final ObjectMapper objectMapper;

    public ProfileAssembler() {
        this.objectMapper = new ObjectMapper();
    }

    public boolean isAnalyzed(Resume resume) {
        return resume.getSkills() != null;
    }

    public boolean isAnalyzed(Job job) {
        return job.getRequiredSkills() != null;
    }

    public CandidateProfile toCandidateProfile(Resume resume) {

        if (!isAnalyzed(resume)) {
            return null;
        }

        CandidateProfile profile = new CandidateProfile();

        profile.setSkills(
                readList(resume.getSkills(), String.class)
        );

        profile.setExperience(
                readList(resume.getExperience(), ExperienceItem.class)
        );

        profile.setEducation(
                readList(resume.getEducation(), EducationItem.class)
        );

        profile.setProjects(
                readList(resume.getProjects(), String.class)
        );

        profile.setTotalExperienceYears(
                resume.getTotalExperienceYears() == null
                        ? 0
                        : resume.getTotalExperienceYears()
        );

        return profile;
    }

    public JobProfile toJobProfile(Job job) {

        if (!isAnalyzed(job)) {
            return null;
        }

        JobProfile profile = new JobProfile();

        profile.setRequiredSkills(
                readList(job.getRequiredSkills(), String.class)
        );

        profile.setPreferredSkills(
                readList(job.getPreferredSkills(), String.class)
        );

        profile.setMinimumExperienceYears(
                job.getMinimumExperienceYears() == null
                        ? 0
                        : job.getMinimumExperienceYears()
        );

        profile.setEducation(job.getEducation());

        profile.setResponsibilities(
                readList(job.getResponsibilities(), String.class)
        );

        return profile;
    }

    private <T> List<T> readList(String json, Class<T> type) {

        if (json == null || json.isBlank()) {
            return Collections.emptyList();
        }

        try {
            return objectMapper.readValue(
                    json,
                    objectMapper.getTypeFactory()
                            .constructCollectionType(List.class, type)
            );

        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
