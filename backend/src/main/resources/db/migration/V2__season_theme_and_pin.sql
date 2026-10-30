ALTER TABLE invitation
  ADD COLUMN theme_season VARCHAR(20) NULL AFTER receiver;

ALTER TABLE invitation
  CHANGE COLUMN secret_pin pin_hash VARCHAR(100) NULL;

ALTER TABLE invitation
  ADD COLUMN pin_updated_at DATETIME NULL AFTER pin_hash,
  ADD COLUMN pin_failed_count INT NOT NULL DEFAULT 0 AFTER pin_updated_at,
  ADD COLUMN pin_locked_until DATETIME NULL AFTER pin_failed_count;

ALTER TABLE choice
  ADD COLUMN scope VARCHAR(20) NOT NULL DEFAULT 'BOTH' AFTER is_active;

ALTER TABLE invitation_response
  ADD COLUMN mode VARCHAR(20) NOT NULL DEFAULT 'STANDARD' AFTER submitted_at;

CREATE TABLE pin_attempt_log (
  id BIGINT NOT NULL AUTO_INCREMENT,
  invitation_id BIGINT NULL,
  ip_address VARCHAR(64) NULL,
  is_match TINYINT(1) NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY idx_pin_attempt_ip_time (ip_address, created_at),
  CONSTRAINT fk_pin_attempt_invitation FOREIGN KEY (invitation_id) REFERENCES invitation (id)
);
