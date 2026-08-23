package com.smartresume.backend.service;

import com.smartresume.backend.dto.CandidateProfile;
import org.springframework.stereotype.Service;

@Service
public class BiasFilterService {

    public CandidateProfile filter(
            CandidateProfile candidate) {

        CandidateProfile filtered =
                new CandidateProfile();

        filtered.setSkills(
                candidate.getSkills()
        );

        filtered.setExperience(
                candidate.getExperience()
        );

        filtered.setEducation(
                candidate.getEducation()
        );

        filtered.setProjects(
                candidate.getProjects()
        );

        filtered.setTotalExperienceYears(
                candidate.getTotalExperienceYears()
        );

        return filtered;
    }
}