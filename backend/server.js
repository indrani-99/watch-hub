require('dotenv').config();
const express = require("express");
const connectDatabase = require('./configs/db');
const userRouter = require('./routers/userRouter');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(userRouter);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/rooms", require("./routes/rooms"));

// Create Server
const server = http.createServer(app);
const io = socketIo(server);

// Socket.io Connection
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinRoom", ({ roomId, participant }) => {
    socket.join(roomId);
    io.to(roomId).emit("participantJoined", participant);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start Server
server.listen(port, async () => {
  try {
    await connectDatabase(process.env.MONGODB_URL);
    console.log(`Server running on port ${port}`);
  } catch (err) {
    console.log(err);
  }
});
