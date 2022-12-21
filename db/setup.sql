-- db for user
-- db for scorring
-- db for habbit planners connected by id
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS habits CASCADE;
DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS daystatus;
DROP TABLE IF EXISTS avatare;

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
    -- day_status TEXT [],
    week_streak INT DEFAULT 0,
    month_streak INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_DATE
);

CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    tracked_day INT DEFAULT 0,
    finished_habits INT DEFAULT 0,
    score INT DEFAULT 0
);

CREATE TABLE daystatus (
id SERIAL PRIMARY KEY,
habit_id INT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
checked BOOLEAN
);

CREATE TABLE avatare (
    id SERIAL PRIMARY KEY,
    img_url TEXT
);


INSERT INTO avatare (id,img_url) VALUES (1, '/avatar_1.png');
INSERT INTO avatare (id,img_url) VALUES (2, '/avatar_2.png');
INSERT INTO avatare (id,img_url) VALUES (3, '/avatar_3.png');
INSERT INTO avatare (id,img_url) VALUES (4, '/avatar_4.png');
INSERT INTO avatare (id,img_url) VALUES (5, '/avatar_5.png');
INSERT INTO avatare (id,img_url) VALUES (6, '/avatar_6.png');
INSERT INTO avatare (id,img_url) VALUES (7, '/avatar_7.png');
INSERT INTO avatare (id,img_url) VALUES (8, '/avatar_8.png');
INSERT INTO avatare (id,img_url) VALUES (9, '/avatar_9.png');
INSERT INTO avatare (id,img_url) VALUES (10, '/avatar_10.png');
INSERT INTO avatare (id,img_url) VALUES (11, '/avatar_11.png');
INSERT INTO avatare (id,img_url) VALUES (12, '/avatar_12.png');
INSERT INTO avatare (id,img_url) VALUES (13, '/avatar_13.png');
INSERT INTO avatare (id,img_url) VALUES (14, '/avatar_14.png');
INSERT INTO avatare (id,img_url) VALUES (15, '/avatar_15.png');
INSERT INTO avatare (id,img_url) VALUES (16, '/avatar_16.png');