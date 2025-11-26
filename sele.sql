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
    image_path TEXT
);

-- Hard questions
CREATE TABLE IF NOT EXISTS hard_questions (
    id SERIAL PRIMARY KEY,
    question JSONB NOT NULL,
    options JSONB NOT NULL,
    correct_option INT NOT NULL,
    type TEXT NOT NULL,
    image_path TEXT
);

-- Activation codes
CREATE TABLE IF NOT EXISTS activation_codes (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT false
);

-- Insert a sample admin
-- Password hash for 'password123'
INSERT INTO admins(email, password) VALUES (
  'admin@example.com',
  '$2a$10$Zp6rJZfHtKn/uFJr1bqV9eZxF.6eOaN4Rzqhj6xM/0Zgdrf4JbXYC'
);

-- Insert a sample activation code
INSERT INTO activation_codes(code) VALUES ('TESTCODE123');
