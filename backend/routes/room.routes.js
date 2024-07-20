const express = require("express");
const {
  createRoom,
  joinRoom,
  leaveRoom,
  removeUserFromRoom,
  getActiveMembersInRoom,
} = require("../controller/roomHandler");
const { access } = require("../middleware/access.middleware");
const { auth } = require("../middleware/auth.middleware");


const roomRoute = express.Router();

roomRoute.post("/create", auth, createRoom);

roomRoute.get("/join/:roomId", auth, joinRoom);

roomRoute.get("/leave/:roomId", auth, leaveRoom);

roomRoute.post(
  "/remove/:roomId/:userIdToRemove",
  auth,
  access(["host"]),
  removeUserFromRoom
);


roomRoute.get("/room/activeMembers/:roomId", auth, getActiveMembersInRoom);

module.exports = {roomRoute};
