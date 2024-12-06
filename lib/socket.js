const { Server } = require("socket.io"); // Import Server from socket.io
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app); // Create the HTTP server

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

// Store online users
const userSocketMap = {}; // { userId: socketId }

// Function to get a receiver's socket ID
function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Emit the list of online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Export the required modules using CommonJS syntax
module.exports = { io, app, server, getReceiverSocketId };
