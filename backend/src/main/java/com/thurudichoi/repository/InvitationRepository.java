package com.thurudichoi.repository;

import com.thurudichoi.entity.Invitation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface InvitationRepository extends JpaRepository<Invitation, Long> {

    Optional<Invitation> findByCode(String code);

    boolean existsByCode(String code);

    @Query("select i from Invitation i left join fetch i.response order by i.id desc")
    List<Invitation> findAllWithResponse();
}
