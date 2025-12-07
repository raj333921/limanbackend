-- Admin table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Easy questions
CREATE TABLE IF NOT EXISTS easy_questions (
    id SERIAL PRIMARY KEY,
    question JSONB NOT NULL,
    options JSONB NOT NULL,
    correct_option INT NOT NULL,
    type TEXT NOT NULL,
    explanation JSONB NOT NULL,
    image_path TEXT
);

-- Hard questions
CREATE TABLE IF NOT EXISTS hard_questions (
    id SERIAL PRIMARY KEY,
    question JSONB NOT NULL,
    options JSONB NOT NULL,
    correct_option INT NOT NULL,
    type TEXT NOT NULL,
    explanation JSONB NOT NULL,
    image_path TEXT
);

-- Activation codes
CREATE TABLE IF NOT EXISTS activation_codes (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT false,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a sample admin
-- Password hash for 'password123'
INSERT INTO admins(email, password) VALUES (
  'admin@liman.com',
  'password123'
);

GRANT ALL PRIVILEGES ON TABLE activation_codes TO sachvkfl_liman;
GRANT ALL PRIVILEGES ON TABLE easy_questions TO sachvkfl_liman;
GRANT USAGE, SELECT ON SEQUENCE easy_questions_id_seq TO sachvkfl_liman;
GRANT ALL PRIVILEGES ON TABLE hard_questions TO sachvkfl_liman;
GRANT USAGE, SELECT ON SEQUENCE hard_questions_id_seq TO sachvkfl_liman;


-- Insert a sample activation code
INSERT INTO activation_codes(code, email)
VALUES ('TESTCODE123', 'raj333921@gmail.com');

INSERT INTO activation_codes(code, expires_at)
VALUES ('TESTCODE124', NOW() + INTERVAL '1 days');

INSERT INTO activation_codes(code, expires_at)
VALUES ('TESTCODE120', NOW() + INTERVAL '10 days');



