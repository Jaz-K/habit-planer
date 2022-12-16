require("dotenv").config();
const express = require("express");
const app = express();
const compression = require("compression");
// ------- socket
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

const path = require("path");
const { PORT = 3001, SESSION_SECRET } = process.env;
const cookieSession = require("cookie-session");

const {
    createUser,
    createScoreBoard,
    login,
    getUserById,
    getHabitsBdyId,
    getScoreById,
    getAllScores,
    updateScoreById,
    getHabitById,
} = require("../db");

// MIDDLEWARE

// --- SOCKET IO COOKIE SESSION
const cookieSessionMiddleware = cookieSession({
    secret: SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 90,
    sameSite: true,
});
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
/////

/// CHECK IF USER HAS COOKIE AND SEND TO START PAGE OR DASHBOARD IF NOT
app.get("/api/user/me", async (req, res) => {
    if (!req.session.user_id) {
        res.json(null);
        return;
    }
    const loggedUser = await getUserById(req.session.user_id);
    // console.log(loggedUser);
    const { id, first_name, last_name, nick_name, img_url, bio } = loggedUser;

    res.json({ id, first_name, last_name, nick_name, img_url, bio });
});

////REGISTER

app.post("/api/users", async (req, res) => {
    console.log("req.body", req.body);
    try {
        const newUser = await createUser(req.body);
        req.session.user_id = newUser.id;
        await createScoreBoard(newUser.id);
        res.json({ success: true });
    } catch (error) {
        console.log("POST /users", error);
        res.status(500).json({ error: "Something is really wrong" });
    }
});

//// LOGIN
app.post("/api/login", async (req, res) => {
    try {
        const user = await login(req.body);
        if (!user) {
            res.status(401).json({
                error: "Invalid login datas",
            });
            return;
        }
        req.session.user_id = user.id;
        res.json({ success: true });
    } catch (error) {
        console.log("POST login", error);
        res.status(500).json({ error: "Something went really wrong" });
    }
});

//// GET HABITS

app.get("/api/user/habits", async (req, res) => {
    const id = req.session.user_id;
    const response = await getHabitsBdyId(id);
    res.json(response);
});

//// GET SPECIFIC HABIT
app.get("/api/user/habit/:id", async (req, res) => {
    const { user_id } = req.session;
    const { id } = req.params;
    // console.log("id und habit id", user_id, id);
    const response = await getHabitById(user_id, id);
    // console.log("habit", response);
    res.json(response);
});
//// LOGOUT
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

/////
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});

///// SOCKET

const loggedUsers = {};

io.on("connection", async (socket) => {
    console.log("[social:socket] incoming socked connection", socket.id);
    console.log("session", socket.request.session);
    const { user_id } = socket.request.session;
    if (!user_id) {
        return socket.disconnect(true);
    }

    ///// ONLINE USERS IN SOCKET
    loggedUsers[socket.id] = user_id;
    console.log("loggedUser", loggedUsers);

    ////
    const allScores = await getAllScores();
    console.log("all scores", allScores);
    io.emit("scoreboard", allScores);
    socket.on("countScore", async function (score) {
        const days = 1;
        console.log("listen to countScore", score, days, user_id);
        const updateScore = await updateScoreById(user_id, days, score);
        console.log("listen to countScore", updateScore);
        // io.emit;
        // emitting new scores to every user

        // const allScores = await getAllScores();
        // console.log("all scores", allScores);
        // io.emit("scoreboard", allScores);
    });

    //// DISCONNECTING USER
    socket.on("disconnect", () => {
        console.log("see you next time", user_id);
        delete loggedUsers[socket.id];
    });
});
