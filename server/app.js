const { isObject } = require("util");

const app = require("express")();
const http = require("http").Server(app);
const socketIO = require("socket.io")(http);

let users = []
let messages = []
let index = 0

socketIO.on("connection", socket => {
    socket.emit("loggedIn", {
        users: users.map(s => s.username),
        messages: messages,
    });

    socket.on("newUser", username => {
        console.log(`${username} has entered the party`)
        socket.username = username
        users.push(socket)

        socketIO.emit("userOnline", socket.username);
    });

    socket.on("msg", msg => {
        let message = {
            index: index,
            username: socket.username,
            msg: msg
        }

        messages.push(message)
        index++

        socketIO.emit("msg", message)
    })



    // Disconnect
    socket.on("disconnect", () => {
        console.log(`${socket.username} has left the party`)
        socketIO.emit("userLeft", socket.username)
        users.splice(users.indexOf(socket), 1)
    });
});

http.listen(3000, () => {
    console.log("Listening on Port 3000")
});