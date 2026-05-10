CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name VARCHAR NOT NULL,
  age INTEGER NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  preferred_language VARCHAR DEFAULT 'en',
  pregnancy_start_date DATE NOT NULL,
  emergency_contact VARCHAR DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE health_logs (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  weight FLOAT NOT NULL,
  blood_pressure VARCHAR NOT NULL,
  sugar_level FLOAT NOT NULL,
  symptoms TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reminders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR NOT NULL,
  reminder_time DATETIME NOT NULL,
  type VARCHAR,
  is_completed BOOLEAN DEFAULT FALSE
);

CREATE TABLE mood_logs (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  mood VARCHAR NOT NULL,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
