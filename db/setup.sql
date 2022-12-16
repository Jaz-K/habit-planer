-- db for user
-- db for scorring
-- db for habbit planners connected by id
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS habits;
DROP TABLE IF EXISTS scores;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    nick_name VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    img_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE habits (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    habit_name VARCHAR (50) NOT NULL,
    days_per_week INT DEFAULT 7,
    created_at TIMESTAMP DEFAULT CURRENT_DATE
);

CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    tracked_day INT DEFAULT 0,
    score INT DEFAULT 0,
);