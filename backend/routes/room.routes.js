const express = require("express");
const {
  createRoom,
  joinRoom,
  leaveRoom,
  getActiveMembersInRoom,
} = require("../controller/roomHandler");
const { auth } = require("../middleware/auth.middleware");

const roomRoute = express.Router();

roomRoute.post("/create", auth, createRoom);

roomRoute.get("/join/:roomid", auth, joinRoom);

roomRoute.get("/leave/:roomid", auth, leaveRoom);

roomRoute.get("/activemembers/:roomid", auth, getActiveMembersInRoom);

module.exports = { roomRoute };
