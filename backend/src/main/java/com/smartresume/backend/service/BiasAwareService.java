package com.smartresume.backend.service;

import com.smartresume.backend.dto.BiasAuditResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BiasAwareService {

    private static final List<String> USED =
            List.of(
                    "Skills",
                    "Experience",
                    "Education",
                    "Projects",
                    "Job Requirements",
                    "Recruiter Screening Instructions"
            );

    private static final List<String> EXCLUDED =
            List.of(
                    "Name",
                    "Age",
                    "Gender",
                    "Photo",
                    "Address",
                    "Phone",
                    "Email",
                    "Nationality"
            );

    public BiasAuditResult audit() {

        BiasAuditResult result =
                new BiasAuditResult();

        result.setUsedAttributes(USED);
        result.setExcludedAttributes(EXCLUDED);

        result.setExplanation(
                "Candidate evaluation is restricted to "
                        + "job-relevant qualifications. Personal "
                        + "identifiers are excluded from the "
                        + "matching criteria."
        );

        return result;
    }
}