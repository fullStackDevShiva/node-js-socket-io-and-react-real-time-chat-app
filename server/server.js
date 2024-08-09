require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const leaveRoom = require("./utilities/leave-room");

// To set the port number for the server
const PORT = 5000;
// To add cors middleware
app.use(cors());

// To create http server instance
const server = http.createServer(app);

// To create an io server and set CORS options
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const CHAT_ADMIN = "Admin"; // As hard-coded admin user
let chatRoom = ""; // To store selected chat room by the cient
let allUsers = []; // To store all the users joined
let __createdtime__ = Date.now(); // Current timestamp as message created at timestamp

// To listen for the client connections via socket.io-client
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  // To add a user to a room
  socket.on("join_room", (data) => {
    const { username, room } = data; // Data sent from client when join_room event emitted
    socket.join(room); // To join the user to a socket room

    // let __createdtime__ = Date.now(); // Current timestamp as message created timestamp

    // After a new user joins a room
    // To let the admin send a message to all the users in the room except the new user
    socket.to(room).emit("get_message", {
      message: `${username} has joined the chat room`,
      username: CHAT_ADMIN,
      __createdtime__,
    });

    // To let the admin send a welcome message to the user that just joined the chat
    socket.emit("get_message", {
      message: `Welcome ${username} to the ${room} room`,
      username: CHAT_ADMIN,
      __createdtime__,
    });

    // To add the new user to the users array who entered the same room
    chatRoom = room;
    // To add all the users joined in allUsers array
    allUsers.push({ id: socket.id, username, room });
    // To filter the users by room
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    // To send the list of users in the room
    socket.to(room).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);
  });

  // To send message to all the users in the room including the sender
  socket.on("send_message", (data) => {
    const { message, username, room, __createdtime__ } = data; // Message received from the sender
    io.in(room).emit("get_message", data);
  });

  // To leave the room
  socket.on("leave_room", (data) => {
    const { username, room } = data;
    socket.leave(room);
    const __createdtime__ = Date.now();
    // To remove the user from the memory
    allUsers = leaveRoom(socket.id, allUsers); // leaveRoom function is declared in utilities module
    socket.to(room).emit("chatroom_users", allUsers);
    socket.to(room).emit("get_message", {
      username: CHAT_ADMIN,
      message: `${username} has left the chat`,
      __createdtime__,
    });
    console.log(`${username} has left the chat`);
  });
  // To handle the connection termination
  socket.on("disconnect", () => {
    console.log("User disconnected from the chat");
    const user = allUsers.find((user) => user.id == socket.id);
    if (user?.username) {
      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(chatRoom).emit("chatroom_users", allUsers);
      socket.to(chatRoom).emit("get_message", {
        message: `${user.username} has disconnected from the chat.`,
      });
    }
  });
});

// To test if REST API is working
app.get("/test/rest_api", (req, res) => {
  res.json({ message: "Server is up and running!" });
});

// To let the server listen to the port specified at the top
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
