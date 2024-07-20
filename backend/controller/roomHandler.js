const { RoomModel } = require("../models/room.model");
async function loadNanoid() {
  const { nanoid } = await import("nanoid");
  return nanoid;
}
// create a room
const createRoom = async (req, res) => {
  const hostId = req.user.userId;
  const hostUsername = req.user.userName;
  const nanoid = await loadNanoid();
  const { roomName } = req.body;
  const roomId = nanoid(10);

  if (!roomName || typeof roomName !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid room name",
      data: null,
      error: "Room name is required and must be a non-empty string",
    });
  }

  try {
    const room = new RoomModel({
      roomId: roomId,
      host: hostId,
      roomName: roomName,
      roomLink: `${process.env.BASE_URL}/room/${roomId}`,
      members: [
        {
          userId: hostId,
          userName: hostUsername,
          role: "host",
          joinedAt: Date.now(),
          timesJoined: 1,
        },
      ],
    });
    await room.save();
    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room.roomId,
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
    const { roomId } = req.params;
    const userId = req.user.userId;
    const userName = req.user.userName;

    const room = await RoomModel.findOne({ roomId: roomId });
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
      (member) => member.userId.toString() === userId
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
      room.members.push({ userId, userName, joinedAt: Date.now() });
    }

    await room.save();

    res.status(200).json({
      success: true,
      message: "Joined the meeting room successfully",
      data: room.roomId,
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
    const { roomId } = req.params;
    const userId = req.user.userId;
    const userName = req.user.userName;

    const room = await RoomModel.findOne({ roomId: roomId });
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

    if (room.host.toString() === userId) {
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
        data: room.roomId,
        error: null,
      });
    } else {
      const existingMember = room.members.find(
        (member) => member.userId.toString() === userId
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
          data: room.roomId,
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
    const { roomId, userIdToRemove } = req.params;

    const room = await RoomModel.findOne({ roomId });
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
      (member) => member.userId.toString() === userIdToRemove && member.leftAt === null
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
      data: room.roomId,
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
    const { roomId } = req.params;
    const userId = req.user.userId;

    const room = await RoomModel.findOne({ roomId });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
        data: null,
        error: "Room not found",
      });
    }

    const activeMember = room.members.find(
      (member) => member.userId.toString() === userId && member.leftAt === null
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
