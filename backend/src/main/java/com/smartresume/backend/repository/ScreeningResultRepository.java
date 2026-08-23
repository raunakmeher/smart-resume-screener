package com.smartresume.backend.repository;

import com.smartresume.backend.entity.ScreeningResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ScreeningResultRepository
        extends JpaRepository<ScreeningResult, Long> {

    Optional<ScreeningResult> findByResumeIdAndJobId(
            Long resumeId,
            Long jobId
    );

    List<ScreeningResult> findByJobIdOrderByFinalScoreDesc(
            Long jobId
    );
}