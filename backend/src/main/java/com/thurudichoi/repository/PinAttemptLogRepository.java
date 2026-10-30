package com.thurudichoi.repository;

import com.thurudichoi.entity.PinAttemptLog;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PinAttemptLogRepository extends JpaRepository<PinAttemptLog, Long> {

    long countByIpAddressAndCreatedAtAfter(String ipAddress, LocalDateTime createdAt);

    @Query("select min(log.createdAt) from PinAttemptLog log where log.ipAddress = :ip and log.createdAt > :after")
    Optional<LocalDateTime> oldestCreatedAt(@Param("ip") String ipAddress, @Param("after") LocalDateTime after);
}
