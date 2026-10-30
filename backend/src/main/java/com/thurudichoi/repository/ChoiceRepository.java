package com.thurudichoi.repository;

import com.thurudichoi.entity.Choice;
import com.thurudichoi.entity.ChoiceScope;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChoiceRepository extends JpaRepository<Choice, Long> {

    List<Choice> findByStepIdOrderByIdAsc(Long stepId);

    List<Choice> findByStepIdAndActiveTrueOrderByIdAsc(Long stepId);

    List<Choice> findByStepIdAndActiveTrueAndScopeInOrderByIdAsc(Long stepId, Collection<ChoiceScope> scopes);
}
