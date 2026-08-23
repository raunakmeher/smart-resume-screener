package com.smartresume.backend.repository;

import com.smartresume.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findAllByOrderByCreatedAtDesc();
}
