const express = require("express");
const socket = require("socket.io");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const server = app.listen("5000", () => {
  console.log("Server Running on Port 5000...");
});

io = socket(server);
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("join_room", ({room, userName}) => {
    socket.join(room);
    joinToRoom(room, userName);
    console.log("User Joined Room: " + userName + room);
    console.log(connectedUsers);
    updateUsersList(room);
  });

  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("receive_message", data.content);
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });

  //Methods
  function joinToRoom(room, userName) {
    // create users array, if key not exists
    if (!connectedUsers.has(room)) {
        connectedUsers.set(room, []);
    }
    // add user to room array
    connectedUsers.get(room).push(userName);
    // call update function
  } 

  function updateUsersList(room){
    io.to(room).emit("getAllUsers",
        connectedUsers.get(room)
    );
  }
});
