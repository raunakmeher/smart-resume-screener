package com.smartresume.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class LLMService {

    private final RestClient client;
    private final String apiKey;

    public LLMService(
            @Value("${gemini.api.key}") String apiKey) {

        this.apiKey = apiKey;

        this.client = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    public String analyzeResume(String resumeText) {

        String prompt = """
                You are a resume information extraction system.

                Extract job-relevant information from the provided resume.

                Return ONLY valid JSON in this exact structure:

                {
                  "skills": [],
                  "experience": [],
                  "education": [],
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

        return client.post()
                .uri("/v1beta/models/gemini-3.6-flash:generateContent?key=" + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(String.class);
    }
}