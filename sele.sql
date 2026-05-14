-- Admin table
    CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        company TEXT NOT NULL,
        vat TEXT,
        address1 TEXT,
        address2 TEXT,
        firstName TEXT,
        lastName TEXT,
        displayName TEXT,
        drivingSchoolNumber TEXT,
        city TEXT,
        country TEXT,
        pincode TEXT
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
  code TEXT NOT NULL,
  is_used BOOLEAN DEFAULT false,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a sample admin
-- Password hash for 'password123'
INSERT INTO admins(email, password, company, vat, address1, city, pincode, firstName, lastName, displayName, drivingSchoolNumber) VALUES (
  'admin@limangroup.com',
  'password123',
  'liman',
  'BE0674.778.817',
  'Turnhoutsebaan 89',
  'Antwerp',
  '2140',
  'Yasin',
  'liman',
  'liman platform',
  '2857'
);



INSERT INTO admins(email, password, company, vat, address1, city, pincode, firstName, lastName, displayName, drivingSchoolNumber) VALUES (
                                                                                                                                             'admin@sachadigi.com',
                                                                                                                                             'password123',
                                                                                                                                             'sachadigi',
                                                                                                                                             'BE1021.522.341',
                                                                                                                                             'Edegemstraat 31',
                                                                                                                                             'Kortenberg',
                                                                                                                                             'Belgium',
                                                                                                                                             'Rajesh',
                                                                                                                                             'Varikuntla',
                                                                                                                                             'Sachadigi platform',
                                                                                                                                             '1234X'
                                                                                                                                         );


GRANT ALL PRIVILEGES ON TABLE activation_codes TO sachvkfl_liman;
GRANT ALL PRIVILEGES ON TABLE easy_questions TO sachvkfl_liman;
GRANT USAGE, SELECT ON SEQUENCE easy_questions_id_seq TO sachvkfl_liman;
GRANT ALL PRIVILEGES ON TABLE hard_questions TO sachvkfl_liman;
GRANT USAGE, SELECT ON SEQUENCE hard_questions_id_seq TO sachvkfl_liman;


-- Insert a sample activation code
INSERT INTO activation_codes(code, email, company)
VALUES ('TESTCODE123', 'raj333921@gmail.com', 'liman');

INSERT INTO activation_codes(code, expires_at)
VALUES ('TESTCODE124', NOW() + INTERVAL '1 days');

INSERT INTO activation_codes(code, expires_at)
VALUES ('TESTCODE120', NOW() + INTERVAL '10 days');

-- AuditTrails
CREATE TABLE IF NOT EXISTS audit_trails (
  id SERIAL PRIMARY KEY,
  history TEXT NOT NULL,
  os TEXT NOT NULL,
  lang TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- signal_signs
CREATE TABLE IF NOT EXISTS signal_signs (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  explanation JSONB NOT NULL,
  image_path TEXT
);

-- signal_signs
CREATE TABLE IF NOT EXISTS score_card (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  score TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_score_email ON score_card(email);

