const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let users = {};

io.on("connection", (socket) => {
  users[socket.id] = {};

  socket.on("disconnect", () => {
    io.emit("chat message", `${users[socket.id]?.name} disconnected`);
    delete users[socket.id];
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", `${users[socket.id]?.name}: ${msg}`);
  });

  socket.on("name", (name) => {
    users[socket.id] = { ...users[socket.id], name };
    socket.emit("chat message", "Welcome " + name);
    socket.broadcast.emit("chat message", `${users[socket.id]?.name} connected`);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
