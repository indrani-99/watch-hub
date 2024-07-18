// roomController 
const { RoomModel } = require("../model/room.model");

// Create a room
const createRoom = async (req, res) => {
  try {
    const { username, userid , roomname} = req.body;
    const newRoom = new RoomModel({
      hostid: userid,
      roomname,
      hostname:username,
      members: []
    });
    await newRoom.save();
    res
      .status(201)
      .json({ message: "Room created successfully", room: newRoom });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
module.exports={createRoom}

// Join a room
exports.joinRoom = async (req, res) => {
  try {
    const { roomid } = req.params;
    const { username, userid } = req.body;

    const room = await RoomModel.findOne({_id:roomid});
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    

    res.status(200).json({ message: "Joined room successfully", room });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

