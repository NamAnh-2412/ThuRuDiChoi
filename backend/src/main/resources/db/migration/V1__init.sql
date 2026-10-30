CREATE TABLE admin (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE invitation (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  admin_id    BIGINT       NOT NULL,
  code        VARCHAR(40)  NOT NULL UNIQUE,
  title       VARCHAR(150),
  receiver    VARCHAR(100),
  secret_pin  VARCHAR(100),
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_invitation_admin FOREIGN KEY (admin_id) REFERENCES admin (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE step (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(20)  NOT NULL UNIQUE,
  name        VARCHAR(100) NOT NULL,
  question    VARCHAR(255),
  step_order  INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE choice (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  step_id     BIGINT       NOT NULL,
  label       VARCHAR(150) NOT NULL,
  image_url   VARCHAR(255),
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  CONSTRAINT fk_choice_step FOREIGN KEY (step_id) REFERENCES step (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE invitation_response (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  invitation_id  BIGINT NOT NULL UNIQUE,
  refuse_count   INT NOT NULL DEFAULT 0,
  note           VARCHAR(500),
  submitted_at   DATETIME,
  CONSTRAINT fk_response_invitation FOREIGN KEY (invitation_id) REFERENCES invitation (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE response_detail (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  response_id  BIGINT NOT NULL,
  step_id      BIGINT NOT NULL,
  choice_id    BIGINT NOT NULL,
  CONSTRAINT uk_response_step UNIQUE (response_id, step_id),
  CONSTRAINT fk_detail_response FOREIGN KEY (response_id) REFERENCES invitation_response (id),
  CONSTRAINT fk_detail_step FOREIGN KEY (step_id) REFERENCES step (id),
  CONSTRAINT fk_detail_choice FOREIGN KEY (choice_id) REFERENCES choice (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO step (code, name, question, step_order) VALUES
  ('place',  'Đi đâu',  'Bạn muốn đi đâu nè?',                 1),
  ('food',   'Ăn gì',   'Bụng đói rồi, mình ăn món gì nhỉ?',   2),
  ('outfit', 'Mặc gì',  'Hôm đó tụi mình diện đồ phong cách gì?', 3),
  ('time',   'Mấy giờ', 'Hẹn nhau lúc mấy giờ thì chuẩn nè?',  4);
