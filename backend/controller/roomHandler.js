const { RoomModel } = require("../models/room.model");
async function loadNanoid() {
  const { nanoid } = await import("nanoid");
  return nanoid;
}
// create a room
const createRoom = async (req, res) => {
  const hostId = req.user.userid;
  const hostUsername = req.user.username;
  const nanoid = await loadNanoid();
  const { roomname } = req.body;
  const roomid = nanoid(10);

  const getActiveRoomOfUser = await RoomModel.find({
    host: hostId,
    'roomClosed.closed': false
  });
  
  if (getActiveRoomOfUser.length > 0) {
    return res.status(403).json({
      success: false,
      message: "You already have an active room, so you can't create a new one before closing it.",
      data: null,
      error: "You already have an active room, so you can't create a new one before closing it."
    });
  }
  

  if (!roomname || typeof roomname !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid room name",
      data: null,
      error: "Room name is required and must be a non-empty string",
    });
  }

  try {
    const room = new RoomModel({
      roomid: roomid,
      host: hostId,
      roomname: roomname,
      roomLink: `${process.env.BASE_URL}/room/${roomid}`,
      members: [
        {
          userid: hostId,
          username: hostUsername,
          role: "host",
          joinedAt: Date.now(),
          timesJoined: 1,
        },
      ],
    });
    console.log(room);
    await room.save();
    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room.roomid,
      error: null,
    });
  } catch (error) {
    console.error("Error creating room:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
      error: error.message,
    });
  }
};

// join a room
const joinRoom = async (req, res) => {
  try {
    const { roomid } = req.params;
    const userid = req.user.userid;
    const username = req.user.username;

    const room = await RoomModel.findOne({ roomid: roomid });
    console.log(roomid);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
        data: null,
        error: "Room not found",
      });
    }

    if (room.roomClosed.closed) {
      return res.status(403).json({
        success: false,
        message: "Room is closed",
        data: null,
        error: "The room has been closed and is no longer accessible",
      });
    }

    const existingMember = room.members.find(
      (member) => member.userid.toString() === userid
    );

    if (existingMember) {
      if (!existingMember.leftAt) {
        return res.status(200).json({
          success: true,
          message: "You are already in the meeting room",
          data: null,
          error: null,
        });
      }

      existingMember.joinedAt = Date.now();
      existingMember.leftAt = null;
      existingMember.timesJoined++;
    } else {
      room.members.push({ userid, username, joinedAt: Date.now() });
    }

    await room.save();

    res.status(200).json({
      success: true,
      message: "Joined the meeting room successfully",
      data: room.roomid,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
      error: "Internal server error",
    });
  }
};

// leave a room
const leaveRoom = async (req, res) => {
  try {
    const { roomid } = req.params;
    const userid = req.user.userid;
    const username = req.user.username;

    const room = await RoomModel.findOne({ roomid: roomid });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
        data: null,
        error: "Room not found",
      });
    }

    if (room.roomClosed.closed) {
      return res.status(403).json({
        success: false,
        message: "Room is already closed",
        data: null,
        error: "The room has been already closed and is no longer accessible",
      });
    }

    if (room.host.toString() === userid) {
      const closeTimestamp = Date.now();
      room.members.forEach((member) => {
        if (member.leftAt == null) {
          member.leftAt=closeTimestamp;
        }
      });
      room.roomClosed.closed = true;
      room.roomClosed.closedAt = closeTimestamp;

      await room.save();

      return res.status(200).json({
        success: true,
        message: "Room closed and all members marked as left",
        data: room.roomid,
        error: null,
      });
    } else {
      const existingMember = room.members.find(
        (member) => member.userid.toString() === userid
      );
      if (!existingMember) {
        return res.status(404).json({
          success: false,
          message: "You are not a member of this room",
          data: null,
          error: "Member not found",
        });
      } else {
        if (existingMember.leftAt) {
          return res.status(409).json({
            success: false,
            message: `You have already left the meeting room at timestamp: ${existingMember.leftAt}`,
            data: null,
            error: `Member has already left the meeting room at timestamp: ${existingMember.leftAt}`,
          });
        }

        existingMember.leftAt = Date.now();
        await room.save();

        return res.status(200).json({
          success: true,
          message: "You have left the room",
          data: room.roomid,
          error: null,
        });
      }
    }
  } catch (error) {
    console.error("Error leaving room:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
      error: error.message,
    });
  }
};

// remove a member from the room
const removeUserFromRoom = async (req, res) => {
  try {
    const { roomid, userIdToRemove } = req.params;

    const room = await RoomModel.findOne({ roomid });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
        data: null,
        error: "Room not found",
      });
    }

    if (room.roomClosed.closed) {
      return res.status(403).json({
        success: false,
        message: "Room is already closed",
        data: null,
        error: "The room has been already closed and is no longer accessible",
      });
    }

    const memberToRemove = room.members.find(
      (member) => member.userid.toString() === userIdToRemove && member.leftAt === null
    );
    if (!memberToRemove) {
      return res.status(404).json({
        success: false,
        message: "Member not found in the room",
        data: null,
        error: "Member not found",
      });
    }

    if (memberToRemove.role === "host") {
      return res.status(404).json({
        success: false,
        message: "Host can not be removed from the room",
        data: null,
        error: "Host can not be removed from the room",
      });
    }

    memberToRemove.leftAt = Date.now();
    await room.save();

    return res.status(200).json({
      success: true,
      message: "User removed from the room successfully",
      data: room.roomid,
      error: null,
    });
  } catch (error) {
    console.error("Error removing user out of room:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
      error: error.message,
    });
  }
};


// get active members in the room
const getActiveMembersInRoom = async (req, res) => {
  try {
    const { roomid } = req.params;
    const userid = req.user.userid;

    const room = await RoomModel.findOne({ roomid });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
        data: null,
        error: "Room not found",
      });
    }

    const activeMember = room.members.find(
      (member) => member.userid.toString() === userid && member.leftAt === null
    );

    if (!activeMember) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
        data: null,
        error:
          "Access denied. You don't have access to view list of members in the room.",
      });
    }

    const activeMembers = room.members.filter(
      (member) => member.leftAt === null
    );

    return res.status(200).json({
      success: true,
      message: "Member list retrieved successfully",
      data: activeMembers,
      error: null,
    });
  } catch (error) {
    console.error("Error retrieving active member list in the room", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
      error: error.message,
    });
  }
};

module.exports = {
  createRoom,
  joinRoom,
  leaveRoom,
  removeUserFromRoom,
  getActiveMembersInRoom,
};
