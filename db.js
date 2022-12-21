const spicedPg = require("spiced-pg");

const { hash, genSalt, compare } = require("bcryptjs");

const { DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;
const DATABASE_NAME = "habit-planer";

const db = spicedPg(
    `postgres:${DATABASE_USERNAME}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
);

async function hashPassword(password) {
    const salt = await genSalt();
    return hash(password, salt);
}

async function checkNick(val) {
    const result = await db.query(
        `
        SELECT nick_name
        FROM users
        WHERE nick_name
        NOT ILIKE $1
        `,
        [val + "%"]
    );
    return result.rows;
}
// REGISTER USER and SET scoreboard
async function createUser({
    first_name,
    last_name,
    nick_name,
    email,
    password,
}) {
    const hashedPassword = await hashPassword(password);
    const result = await db.query(
        `
    INSERT INTO users (first_name, last_name, nick_name, email, password_hash)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
        [first_name, last_name, nick_name, email, hashedPassword]
    );
    return result.rows[0];
}

async function createScoreBoard(user_id) {
    const result = await db.query(
        `
    INSERT INTO scores(user_id)
    VALUES($1)
    `,
        [user_id]
    );
    return result.rows[0];
}

// GET USER BY EMAIL

async function getUserByEmail(email) {
    const result = await db.query(`SELECT * FROM users WHERE email = $1`, [
        email,
    ]);
    return result.rows[0];
}

// LOGIN
async function login({ email, password }) {
    const foundUser = await getUserByEmail(email);
    // console.log("user", foundUser);
    if (!foundUser) {
        return null;
    }
    const match = await compare(password, foundUser.password_hash);
    // console.log("match", match);
    if (!match) {
        return null;
    }
    return foundUser;
}

// CHECK USER
async function getUserById(id) {
    const result = await db.query(
        `
    SELECT * FROM users WHERE id = $1
    `,
        [id]
    );
    return result.rows[0];
}

// AVATAR LINK

async function getAvatar() {
    const result = await db.query(
        `
SELECT * FROM avatare
    `
    );
    return result.rows;
}
async function updateAvatar(img_url, id) {
    const result = await db.query(
        `
    UPDATE users 
    SET img_url =$1
    WHERE id = $2
    RETURNING *
    `,
        [img_url, id]
    );
    return result.rows[0];
}
// UPDATE NICK NAME
async function updateNickById(id, nick_name) {
    // console.log("db", id, nick_name);
    const result = await db.query(
        `
    UPDATE users 
    SET nick_name = $2
    WHERE id = $1
    RETURNING nick_name
    `,
        [id, nick_name]
    );
    return result.rows[0];
}
// UPDATE USER DATA
async function updateUserById(id, first_name, last_name) {
    console.log("db", id, first_name, last_name);
    const result = await db.query(
        `
    UPDATE users 
    SET first_name = $2, last_name = $3 
    WHERE id = $1
    RETURNING first_name, last_name
    `,
        [id, first_name, last_name]
    );
    return result.rows[0];
}

// UPDATE EMAIL
async function updateEmailById(id, email) {
    // console.log("db", id, first_name, last_name);
    const result = await db.query(
        `
    UPDATE users 
    SET email = $2
    WHERE id = $1
    RETURNING email
    `,
        [id, email]
    );
    return result.rows[0];
}
// UPDATE PASSWORD
async function updatePassword(id, password) {
    // console.log("db", id, first_name, last_name);
    const hashedPassword = await hashPassword(password);
    const result = await db.query(
        `
    UPDATE users 
    SET hashedPassword = $2
    WHERE id = $1
    `,
        [id, hashedPassword]
    );
    return result.rows[0];
}
// UPDATE GOALS

async function updateBio({ bio, id }) {
    const result = await db.query(
        `
    UPDATE users
    SET bio = $1
    WHERE id = $2
    RETURNING bio
    `,
        [bio, id]
    );
    return result.rows[0];
}
// GET HABITS BY ID
async function getHabitsBdyId(id) {
    const result = await db.query(
        `
SELECT * FROM habits WHERE user_id = $1
    `,
        [id]
    );
    return result.rows;
}

// GET HABIT BY ID
async function getHabitById(user_id, id) {
    const result = await db.query(
        `
        SELECT * FROM habits WHERE user_id = $1 AND id = $2

        `,
        [user_id, id]
    );
    return result.rows[0];
}

// CREATE NEW HABIT
async function createNewHabit(user_id, habit_name, days_per_week) {
    const result = await db.query(
        `
    INSERT INTO habits (user_id, habit_name, days_per_week)
    VALUES ($1,$2,$3) 
    RETURNING*
    `,
        [user_id, habit_name, days_per_week]
    );
    return result.rows[0];
}
// GET ALL SCORE
async function getAllScores() {
    const result = await db.query(
        `
    SELECT scores.user_id, scores.score, 
    users.id AS user_id,
    users.nick_name, users.img_url
    FROM scores JOIN users
    ON (users.id = scores.user_id)
    ORDER BY scores.score DESC
    `
    );
    return result.rows;
}
// GET SCORE BY ID
async function getScoreById(user_id) {
    const result = await db.query(
        `
    SELECT * FROM scores WHERE user_id = $1
    `,
        [user_id]
    );
    return result.rows[0];
}

// UPDATE SCORE
async function updateScoreById(user_id, tracked_day, score) {
    const result = await db.query(
        `
    UPDATE scores 
    SET score = score + $3, tracked_day = tracked_day + $2 
    WHERE user_id = $1
    RETURNING score
    `,
        [user_id, tracked_day, score]
    );
    return result.rows[0];
}

// RESET HABIT

async function resetHabitById(id) {
    const result = await db.query(
        `
    UPDATE habits
    SET created_at = CURRENT_DATE , week_streak = 0, month_streak = 0
    WHERE id = $1
    RETURNING *
    `,
        [id]
    );
    return result.rows[0];
}
async function deleteHabitStatusById(habit_id) {
    const result = await db.query(
        `
   DELETE FROM daystatus WHERE habit_id = $1
    `,
        [habit_id]
    );
    return result.rows;
}

// DELETE HABIT BY ID
async function deleteHabitById(habit_id) {
    const result = await db.query(
        `
   DELETE FROM habits WHERE id = $1
   RETURNING*
    `,
        [habit_id]
    );
    return result.rows;
}

// GET HABIT STATUS

async function getHabitStatusById(habit_id) {
    console.log(habit_id);
    const result = await db.query(
        `
    SELECT checked FROM daystatus WHERE habit_id = $1
    `,
        [habit_id]
    );
    return result.rows;
}

// SET HABIT STATUS
async function setHabitStatus(habit_id, checked) {
    const result = await db.query(
        `
    INSERT INTO daystatus (habit_id,checked)
    VALUES ($1,$2) 
    RETURNING checked
    `,
        [habit_id, checked]
    );
    return result.rows[0];
}

// UPDATE HABIT COUNT

async function updateHabitScoreById(week_streak, month_streak, id) {
    const result = await db.query(
        `
    UPDATE habits
    SET week_streak = $1, month_streak = $2
    WHERE id = $3
    RETURNING *
    `,
        [week_streak, month_streak, id]
    );
    return result.rows[0];
}

// DETELE USER

async function deleteUser(id) {
    const result = await db.query(
        `DELETE FROM users WHERE id = $1 RETURNING*`,
        [id]
    );
    return result.rows[0];
}

module.exports = {
    createUser,
    createScoreBoard,
    updateNickById,
    updateUserById,
    updateEmailById,
    updatePassword,
    updateBio,
    login,
    getUserById,
    getHabitsBdyId,
    getScoreById,
    getAllScores,
    updateScoreById,
    getHabitById,
    createNewHabit,
    resetHabitById,
    setHabitStatus,
    getHabitStatusById,
    deleteHabitStatusById,
    deleteHabitById,
    updateHabitScoreById,
    checkNick,
    deleteUser,
    getAvatar,
    updateAvatar,
};
