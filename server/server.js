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
const { PORT = 3001 } = process.env;

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, function () {
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
});
