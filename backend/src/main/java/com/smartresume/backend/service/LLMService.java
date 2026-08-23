package com.smartresume.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartresume.backend.dto.CandidateProfile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

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
}