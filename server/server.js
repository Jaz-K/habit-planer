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
    // checkNick,
    createUser,
    updateNickById,
    updateUserById,
    updateEmailById,
    updatePassword,
    createScoreBoard,
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
    updateBio,
    deleteUser,
    getAvatar,
    updateAvatar,
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
        console.log("POST /users", error.constraint);
        if (error.constraint == "users_email_key") {
            console.log("email already exists");
            res.status(500).json({ error: "Email already exists" });
        } else if (error.constraint == "users_nick_name_key") {
            console.log("email already exists");
            res.status(500).json({ error: "Nickname already exists" });
        } else {
            res.status(500).json({ error: "Something is really wrong" });
        }
    }
});

//// CHECK available NICK

// app.get("/api/check-nickname", async (req, res) => {
//     try {
//         const { q } = req.query;
//         console.log("query", req.query);
//         const nick = await checkNick(q);
//         console.log("nick", nick);
//         if (!q) {
//             res.json({ error: "nick already exists" });
//             console.log(res.json());
//             return;
//         }
//         res.json({ nick: "Nick available" });
//     } catch (error) {
//         console.log("ERROR api/users-search", error);
//         res.json({ success: "false" });
//     }
// });

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
// GET AVATARE
app.get("/api/avatare", async (req, res) => {
    const response = await getAvatar();
    // console.log("resonse avatare", response);
    res.json(response);
});
app.post("/api/new_avatare", async (req, res) => {
    const id = req.session.user_id;
    const { img_url } = req.body;
    const response = await updateAvatar(img_url, id);
    console.log("resonse avatare", response);
    res.json(response);
});

//// EDIT NICKNAME
app.post("/api/edit-nickname", async (req, res) => {
    try {
        const id = req.session.user_id;
        const { nick_name } = req.body;
        const response = await updateNickById(id, nick_name);
        res.json(response);
    } catch (error) {
        res.json({ error: "Nick already exists" });
    }
});

//// EDIT USER DATA
app.post("/api/edit-user", async (req, res) => {
    const id = req.session.user_id;
    const { first_name, last_name } = req.body;
    const response = await updateUserById(id, first_name, last_name);

    res.json(response);
});

//// EDIT EMAIL
app.post("/api/edit-email", async (req, res) => {
    console.log(req.body);
    const id = req.session.user_id;
    const { email, emailRepeat } = req.body;
    if (email !== emailRepeat) {
        res.json({ emailError: "Emails are not identical" });
    } else {
        const response = await updateEmailById(id, email);

        res.json(response);
    }
});

//// EDIT PASSWORD
app.post("/api/edit-password", async (req, res) => {
    const id = req.session.user_id;
    const { password, passwordRepeat } = req.body;
    if (password !== passwordRepeat) {
        res.json({ error: "Passwords are not identical" });
    } else {
        const response = await updatePassword(id, password);
        console.log("email db response", response);
        res.json(response);
    }
});
//// EDIT BIO

app.post("/api/users/bio", async (req, res) => {
    try {
        const id = req.session.user_id;
        const bio = req.body.bio;
        const newBio = await updateBio({ bio, id });
        res.json(newBio);
    } catch (error) {
        // res.json(error); // need testing it
        console.log("Something went wrong", error);
    }
});
//// GET HABITS

app.get("/api/user/habits", async (req, res) => {
    const id = req.session.user_id;
    const response = await getHabitsBdyId(id);
    res.json(response);
});

//// GET HABIT BY ID
app.get("/api/user/habit/:id", async (req, res) => {
    const { user_id } = req.session;
    const { id } = req.params;
    const response = await getHabitById(user_id, id);
    if (!user_id || !response) {
        res.json(null);
        return;
    } else {
        res.json(response);
    }
});

//// NEW HABIT
app.post("/api/create-habit", async (req, res) => {
    const { habit_name, days_per_week } = req.body;
    const { user_id } = req.session;
    const response = await createNewHabit(user_id, habit_name, days_per_week);
    res.json(response);
});

//// RESET HABIT
app.post("/api/reset-habit/:id", async (req, res) => {
    const { id } = req.params;
    const response = await resetHabitById(id);
    await deleteHabitStatusById(id);
    res.json(response);
});
//// GET HABIT STATUS
app.get("/api/gethabitstatus/:id", async (req, res) => {
    const { id } = req.params;
    const response = await getHabitStatusById(id);
    console.log("response", response, id);
    res.json(response);
});
//// SET HABIT STATUS
app.post("/api/sethabitstatus/:id", async (req, res) => {
    const { checked } = req.body;
    const { id } = req.params;
    const response = await setHabitStatus(id, checked);
    console.log("db response set day", response);
    res.json(response);
});

//// SET HABIT COUNTER
app.post("/api/setHabitCount/:id", async (req, res) => {
    const { week_streak, month_streak } = req.body;
    const { id } = req.params;
    console.log("set counter POST", id, req.body);
    const response = await updateHabitScoreById(week_streak, month_streak, id);
    res.json(response);
});

//// DELETE HABIT
app.post("/api/delete-habit/:id", async (req, res) => {
    console.log("delete habit", req.params);
    const { id } = req.params;
    const response = await deleteHabitById(id);

    res.json(response);
});

// OTHERT USERS

app.get("/api/users/:otherId", async (req, res) => {
    console.log(req.params, req.session);
    const { otherId } = req.params;
    const { user_id } = req.session;
    const otherUser = await getUserById(otherId);

    if (otherId == user_id || !otherUser) {
        res.json(null);
        return;
    } else {
        res.json(otherUser);
    }
});

// OTHER USER SCORE

app.get("/api/users_score/:otherId", async (req, res) => {
    console.log(req.params, req.session);
    const { otherId } = req.params;
    const otherUser = await getScoreById(otherId);
    console.log(otherUser);

    res.json(otherUser);
});
//// DELETE USER
app.post("/api/remove-profile", async (req, res) => {
    const user_id = req.session.user_id;
    // const userImg = await getUserById(user_id);
    // const { img_url } = userImg;
    // if (img_url) {
    //     await s3delete(img_url.slice(36));
    // }
    const response = await deleteUser(user_id);

    req.session = null;
    res.json(response);
    // res.redirect("/login");
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
    console.log("params", socket.request.headers.referer);
    const { user_id } = socket.request.session;
    if (!user_id) {
        return socket.disconnect(true);
    }

    ///// ONLINE USERS IN SOCKET
    loggedUsers[socket.id] = user_id;
    console.log("loggedUser", loggedUsers);

    ////
    const allScores = await getAllScores();
    io.emit("scoreboard", allScores);

    const userScore = await getScoreById(user_id);
    socket.emit("currentScore", userScore);

    socket.on("countScore", async function (score) {
        const days = 1;
        // console.log("listen to countScore", score, days, user_id);
        const updateScore = await updateScoreById(user_id, days, score);
        socket.emit("newScore", updateScore);

        // emitting new scores to every user
        const allScores = await getAllScores();
        io.emit("scoreboard", allScores);
    });

    //// DISCONNECTING USER
    socket.on("disconnect", () => {
        console.log("see you next time", user_id);
        delete loggedUsers[socket.id];
    });
});
