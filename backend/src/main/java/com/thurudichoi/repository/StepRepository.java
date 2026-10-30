package com.thurudichoi.repository;

import com.thurudichoi.entity.Step;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StepRepository extends JpaRepository<Step, Long> {

    List<Step> findAllByOrderByStepOrderAsc();

    Optional<Step> findByCode(String code);
}
