//https://socket.io/docs/v4/tutorial/step-4

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { connectToMongo } = require("./database");
require("dotenv").config();
const User = require("./user");

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    //origin: "http://localhost:3000",
    origin: "*",
  },
});

// Connect to MongoDB
connectToMongo();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// Express Routes
app.get("/users", async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { username, email } = req.body;
    const newUser = await User.createUser(username, email);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);
  // socket.join("temp");

  socket.on("joinRoom", (room) => {
    socket.join(room);
    // socket.join("temp");
  });

  socket.on("clear", (room) => {
    // io.to("temp").emit('clear');
    io.to(room).emit("clear");
    // io.emit('clear');
  });
  socket.on("startStroke", (line) => {
    console.log(line.room);
    io.to(line.room).emit("startStroke", line.line);
    // io.emit('startStroke', line);
  });
  socket.on("endStroke", (line) => {
    io.to(line.room).emit("endStroke", line.line);
    // io.emit('endStroke', line);
  });
  socket.on("stroke", (line) => {
    io.to(line.room).emit("stroke", line.line);
    // io.emit('stroke', line);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Define the port
const port = process.env.PORT || 3001;

server.listen(3001, () => {
  console.log("server running at http://localhost:${port}");
});