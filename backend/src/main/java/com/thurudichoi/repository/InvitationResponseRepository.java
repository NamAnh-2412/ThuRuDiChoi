package com.thurudichoi.repository;

import com.thurudichoi.entity.InvitationResponse;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface InvitationResponseRepository extends JpaRepository<InvitationResponse, Long> {

    Optional<InvitationResponse> findByInvitationId(Long invitationId);

    @Query("""
            select distinct r from InvitationResponse r
            join fetch r.invitation
            left join fetch r.details d
            left join fetch d.step
            left join fetch d.choice
            """)
    List<InvitationResponse> findAllDetailed();
}
