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
// REGISTER USER
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

async function getHabitsBdyId(id) {
    const result = await db.query(
        `
    SELECT * FROM habits WHERE user_id = $1
    `,
        [id]
    );
    return result.rows;
}

module.exports = {
    createUser,
    login,
    getUserById,
    getHabitsBdyId,
};
