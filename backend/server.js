require("dotenv").config();
const express = require("express");
const http = require("http");
const port = process.env.PORT;
const { Server } = require("socket.io");
const socketIo = require("socket.io");
const cors = require("cors");
const { roomRoute } = require("./routes/room.routes");
const { userRouter } = require("./routes/user.routes");
const { connectionWithDB } = require("./configs/db");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const users = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('new-user-joined', (name) => {
    console.log('New user:', name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', (message) => {
    console.log('Message sent:', message);
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', users[socket.id]);
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});


app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/room", roomRoute);
app.get("/", (req, res) => {
  res.send("Home Page");
});



server.listen(port, async () => {
  try {
    await connectionWithDB();
    console.log(`server is running at port ${port}`);
  } catch (err) {
    console.log(err);
  }
});
