package com.smartresume.backend.dto;

import java.util.List;

public class BiasAuditResult {

    private List<String> usedAttributes;
    private List<String> excludedAttributes;
    private String explanation;

    public List<String> getUsedAttributes() {
        return usedAttributes;
    }

    public void setUsedAttributes(
            List<String> usedAttributes) {
        this.usedAttributes = usedAttributes;
    }

    public List<String> getExcludedAttributes() {
        return excludedAttributes;
    }

    public void setExcludedAttributes(
            List<String> excludedAttributes) {
        this.excludedAttributes =
                excludedAttributes;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(
            String explanation) {
        this.explanation = explanation;
    }
}