const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// Create Room
router.post("/", async (req, res) => {
  const { name } = req.body;
  const newRoom = new Room({ name });
  await newRoom.save();
  res.status(201).send(newRoom);
});

// Join Room
router.post("/:id/join", async (req, res) => {
  const { id } = req.params;
  const { participant } = req.body;
  const room = await Room.findById(id);
  if (room) {
    room.participants.push(participant);
    await room.save();
    res.send(room);
  } else {
    res.status(404).send("Room not found");
  }
});

// Get Rooms
router.get("/", async (req, res) => {
  const rooms = await Room.find();
  res.send(rooms);
});

module.exports = router;
