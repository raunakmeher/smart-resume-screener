package com.smartresume.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartresume.backend.dto.CandidateProfile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.smartresume.backend.dto.JobProfile;
import java.util.Map;
import com.smartresume.backend.dto.MatchResult;
import com.smartresume.backend.dto.SkillGapResult;

@Service
public class LLMService {

    private final RestClient client;
    private final String apiKey;
    private final ObjectMapper objectMapper;

    public LLMService(
            @Value("${gemini.api.key}") String apiKey) {

        this.apiKey = apiKey;
        this.objectMapper = new ObjectMapper();

        this.client = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    public CandidateProfile analyzeResume(String resumeText) {

        String prompt = """
                You are a resume information extraction system.

                Extract job-relevant information from the provided resume.

                Return ONLY valid JSON in this exact structure:

                {
                  "skills": [],
                  "experience": [
                    {
                      "title": "",
                      "company": "",
                      "summary": ""
                    }
                  ],
                  "education": [
                    {
                      "degree": "",
                      "fieldOfStudy": "",
                      "institution": ""
                    }
                  ],
                  "projects": [],
                  "totalExperienceYears": 0
                }

                Rules:
                - Extract only information explicitly supported by the resume.
                - Do not invent skills or experience.
                - Do not consider name, age, gender, photo, address,
                  phone number or email for candidate evaluation.
                - Return empty arrays when information is unavailable.
                - Return totalExperienceYears as a number.

                Resume:
                """ + resumeText;

        Map<String, Object> body = Map.of(
                "contents", new Object[]{
                        Map.of(
                                "parts", new Object[]{
                                        Map.of("text", prompt)
                                }
                        )
                }
        );

        String response = client.post()
                .uri("/v1beta/models/gemini-3.6-flash:generateContent?key=" + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(String.class);

        try {
            JsonNode root = objectMapper.readTree(response);

            JsonNode parts = root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts");

            String text = parts
                    .get(0)
                    .path("text")
                    .asText();

            text = cleanJson(text);

            return objectMapper.readValue(text, CandidateProfile.class);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to parse Gemini response", e
            );
        }
    }
    public JobProfile analyzeJob(String jobDescription) {

        String prompt = """
            You are a job description analysis system.

            Extract the hiring requirements from the provided job description.

            Return ONLY valid JSON in this exact structure:

            {
              "requiredSkills": [],
              "preferredSkills": [],
              "minimumExperienceYears": 0,
              "education": "",
              "responsibilities": []
            }

            Rules:
            - requiredSkills must contain skills explicitly required
              for the role.
            - preferredSkills must contain skills described as preferred,
              nice-to-have or optional.
            - Do not invent requirements.
            - minimumExperienceYears must be a number.
            - If experience is not specified, return 0.
            - If education is not specified, return an empty string.
            - Extract concise responsibilities.
            - Return ONLY JSON.

            Job Description:
            """ + jobDescription;

        Map<String, Object> body = Map.of(
                "contents", new Object[]{
                        Map.of(
                                "parts", new Object[]{
                                        Map.of("text", prompt)
                                }
                        )
                }
        );

        String response = client.post()
                .uri("/v1beta/models/gemini-3.6-flash:generateContent?key=" + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(String.class);

        try {
            JsonNode root = objectMapper.readTree(response);

            String text = root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            text = cleanJson(text);

            return objectMapper.readValue(text, JobProfile.class);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to parse Gemini job response", e
            );
        }
    }
    private String cleanJson(String text) {

        text = text.trim();

        if (text.startsWith("```json")) {
            text = text.substring(7);
        } else if (text.startsWith("```")) {
            text = text.substring(3);
        }

        if (text.endsWith("```")) {
            text = text.substring(0, text.length() - 3);
        }

        return text.trim();
    }
    public MatchResult matchCandidate(
            CandidateProfile candidate,
            JobProfile job,
            String screeningPrompt) {

        String prompt = """
        You are an AI recruitment matching system.

        Your task is to evaluate a candidate against a job
        using ONLY evidence contained in the candidate profile,
        job profile, and recruiter instructions.

        Return ONLY valid JSON in this exact structure:

        {
          "matchScore": 0,
          "matchedSkills": [],
          "missingRequiredSkills": [],
          "preferredSkillsMatched": [],
          "experienceFit": false,
          "educationFit": false,
          "summary": ""
        }

        GENERAL SCORING RULES:
        - matchScore must be between 0 and 100.
        - Required skills are more important than preferred skills.
        - Consider reasonable semantic equivalents of skills.
        - Never invent candidate skills, experience or education.
        - Experience fit is true only when the candidate meets
          or exceeds the required experience.
        - Education fit must be based only on stated education.
        - Do not use name, age, gender, photo, address, phone,
          email, nationality or other personal characteristics.
        - The explanation must be supported by candidate evidence.

        RECRUITER SCREENING INSTRUCTIONS:
        """ + (screeningPrompt == null || screeningPrompt.isBlank()
                ? "No additional recruiter instructions were provided."
                : screeningPrompt) + """

        CANDIDATE PROFILE:
        """ + toJson(candidate) + """

        JOB PROFILE:
        """ + toJson(job);

        Map<String, Object> body = Map.of(
                "contents", new Object[]{
                        Map.of(
                                "parts", new Object[]{
                                        Map.of("text", prompt)
                                }
                        )
                }
        );

        String response = client.post()
                .uri("/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(String.class);

        try {
            JsonNode root = objectMapper.readTree(response);

            String text = root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            text = cleanJson(text);

            return objectMapper.readValue(text, MatchResult.class);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to parse Gemini match response", e
            );
        }
    }
    private String toJson(Object object) {

        try {
            return objectMapper.writeValueAsString(object);
        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to convert object to JSON", e
            );
        }
    }
    public SkillGapResult analyzeSkillGap(
            CandidateProfile candidate,
            JobProfile job) {

        String prompt = """
            You are a career skill-gap analysis system.

            Compare the candidate profile with the job profile.

            Identify:
            1. Missing required skills.
            2. Missing preferred skills.
            3. Skills the candidate already has.
            4. Any experience gap.
            5. Practical recommendations for closing the gaps.

            Return ONLY valid JSON:

            {
              "missingRequiredSkills": [],
              "missingPreferredSkills": [],
              "matchedSkills": [],
              "experienceGap": "",
              "recommendations": []
            }

            Rules:
            - Do not invent candidate skills.
            - Consider reasonable semantic equivalents.
            - Required skills have higher priority than preferred skills.
            - Recommendations must be based on actual missing skills.
            - Keep recommendations concise.

            Candidate Profile:
            """ + toJson(candidate) + """

            Job Profile:
            """ + toJson(job);

        Map<String, Object> body = Map.of(
                "contents", new Object[]{
                        Map.of(
                                "parts", new Object[]{
                                        Map.of("text", prompt)
                                }
                        )
                }
        );

        String response = client.post()
                .uri("/v1beta/models/gemini-3.6-flash:generateContent?key=" + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(String.class);

        try {
            JsonNode root = objectMapper.readTree(response);

            String text = root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            text = cleanJson(text);

            return objectMapper.readValue(
                    text,
                    SkillGapResult.class
            );

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to parse skill gap response",
                    e
            );
        }
    }
}