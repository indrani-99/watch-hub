const { RoomModel, UserRoomMapModel } = require("../models/room.model");
const mongoose = require("mongoose");

async function loadNanoid() {
  const { nanoid } = await import("nanoid");
  return nanoid;
}
// create a room
const createRoom = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const hostId = req.user.userid;
    const hostUsername = req.user.username;
    const nanoid = await loadNanoid();
    const roomid = nanoid(10);
    const { roomname } = req.body;

  
    if (!roomname || typeof roomname !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid room name",
        data: null,
        error: "Room name is required and must be a non-empty string",
      });
    }

    const userRoomMapDetails = await UserRoomMapModel.findOne({
      userid: hostId,
    }).session(session);

    if (userRoomMapDetails) {
      const oldRoomDetails = userRoomMapDetails.roomdetails;

      let leaveRoomRes = await leaveRoomUtility(
        session,
        oldRoomDetails.roomid,
        hostId
      );

      console.log("Leave Result: ", leaveRoomRes);

      if (leaveRoomRes.success) {
        await UserRoomMapModel.deleteOne({ userid: hostId }).session(session);
      } else {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Failed to leave the existing room having roomid ${oldRoomDetails.roomid}`,
          data: null,
          error: `Failed to leave the existing room having roomid ${oldRoomDetails.roomid}`,
        });
      }
    }

    const room = new RoomModel({
      roomid: roomid,
      host: hostId,
      roomname: roomname,
      roomLink: `${process.env.BASE_URL}/room/join/${roomid}`,
      members: [],
    });
    console.log(room);
    await room.save({ session });

    const userRoomMap = new UserRoomMapModel({
      userid: hostId,
      roomdetails: {
        roomid: roomid,
        role: "host",
      },
    });

    await userRoomMap.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room.roomid,
      error: null,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { roomid } = req.params;
    const userid = req.user.userid;
    const username = req.user.username;

    const room = await RoomModel.findOne({ roomid: roomid }).session(session);
    console.log(roomid);
    if (!room) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Room not found",
        data: null,
        error: "Room not found",
      });
    }

    if (room.roomClosed.closed) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: "Room is closed",
        data: null,
        error: "The room has been closed and is no longer accessible",
      });
    }

    const userRoomMapDetails = await UserRoomMapModel.findOne({
      userid: userid,
    }).session(session);

    if (
      userRoomMapDetails &&
      userRoomMapDetails.roomdetails.roomid !== roomid
    ) {
      const oldRoomDetails = userRoomMapDetails.roomdetails;

      req.params.roomid = oldRoomDetails.roomid;
      let leaveRoomRes = await leaveRoomUtility(session, roomid, userid);

      if (!leaveRoomRes.success) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Failed to leave the existing room having roomid ${oldRoomDetails.roomid}`,
          data: null,
          error: `Failed to leave the existing room having roomid ${oldRoomDetails.roomid}`,
        });
      }
    }

    const existingMember = room.members.find(
      (member) => member.userid.toString() === userid
    );

    if (existingMember) {
      if (!existingMember.leftAt) {
        await session.abortTransaction();
        session.endSession();
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

      await room.save({ session });

      const userRoomMap = new UserRoomMapModel({
        userid: userid,
        roomdetails: {
          roomid: roomid,
          role: "member",
        },
      });

      await userRoomMap.save({ session });
    } else {
      if (room.host === userid) {
        room.members.push({
          userid: userid,
          username: username,
          role: "host",
          joinedAt: Date.now(),
        });
        await room.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
          success: true,
          message: "Joined the meeting room successfully",
          data: room.roomid,
          error: null,
        });
      } else {
        room.members.push({ userid, username, joinedAt: Date.now() });

        await room.save({ session });

        const userRoomMap = new UserRoomMapModel({
          userid: userid,
          roomdetails: {
            roomid: roomid,
            role: "member",
          },
        });

        await userRoomMap.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Joined the meeting room successfully",
      data: room.roomid,
      error: false,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { roomid } = req.params;
    const userid = req.user.userid;
    const username = req.user.username;

    const room = await RoomModel.findOne({ roomid: roomid }).session(session);
    if (!room) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Room not found",
        data: null,
        error: "Room not found",
      });
    }

    if (room.roomClosed.closed) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: "Room is already closed",
        data: null,
        error: "The room has been already closed and is no longer accessible",
      });
    }

    if (room.host.toString() === userid) {
      const closeTimestamp = Date.now();
      const activeMembersIds = [];
      room.members.forEach((member) => {
        if (member.leftAt == null) {
          member.leftAt = closeTimestamp;
          activeMembersIds.push(member.userid);
        }
      });
      room.roomClosed.closed = true;
      room.roomClosed.closedAt = closeTimestamp;

      await room.save({ session });
      await UserRoomMapModel.deleteMany({
        userid: { $in: activeMembersIds },
      }).session(session);

      await session.commitTransaction();
      session.endSession();

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
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "You are not a member of this room",
          data: null,
          error: "Member not found",
        });
      } else {
        if (existingMember.leftAt) {
          await session.abortTransaction();
          session.endSession();
          return res.status(409).json({
            success: false,
            message: `You have already left the meeting room at timestamp: ${existingMember.leftAt}`,
            data: null,
            error: `Member has already left the meeting room at timestamp: ${existingMember.leftAt}`,
          });
        }

        existingMember.leftAt = Date.now();
        await room.save({ session });

        await UserRoomMapModel.deleteOne({
          userid: existingMember.userid,
        }).session(session);

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
          success: true,
          message: "You have left the room",
          data: room.roomid,
          error: null,
        });
      }
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error leaving room:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
      error: error.message,
    });
  }
};

const leaveRoomUtility = async (session, roomid, userid) => {
  try {
    const room = await RoomModel.findOne({ roomid: roomid }).session(session);
    if (!room) {
      return {
        success: false,
        message: "Room not found",
        data: null,
        error: "Room not found",
      };
    }

    if (room.roomClosed.closed) {
      return {
        success: false,
        message: "Room is already closed",
        data: null,
        error: "The room has been already closed and is no longer accessible",
      };
    }

    if (room.host.toString() === userid) {
      const closeTimestamp = Date.now();
      const activeMembersIds = [];
      room.members.forEach((member) => {
        if (member.leftAt == null) {
          member.leftAt = closeTimestamp;
          activeMembersIds.push(member.userid);
        }
      });
      room.roomClosed.closed = true;
      room.roomClosed.closedAt = closeTimestamp;

      await room.save({ session });
      await UserRoomMapModel.deleteMany({
        userid: { $in: activeMembersIds },
      }).session(session);

      return {
        success: true,
        message: "Room closed and all members marked as left",
        data: room.roomid,
        error: null,
      };
    } else {
      const existingMember = room.members.find(
        (member) => member.userid.toString() === userid
      );
      if (!existingMember) {
        return {
          success: false,
          message: "You are not a member of this room",
          data: null,
          error: "Member not found",
        };
      } else {
        if (existingMember.leftAt) {
          return {
            success: false,
            message: `You have already left the meeting room at timestamp: ${existingMember.leftAt}`,
            data: null,
            error: `Member has already left the meeting room at timestamp: ${existingMember.leftAt}`,
          };
        }

        existingMember.leftAt = Date.now();
        await room.save({ session });

        await UserRoomMapModel.deleteOne({
          userid: userid,
        }).session(session);

        return {
          success: true,
          message: "You have left the room",
          data: room.roomid,
          error: null,
        };
      }
    }
  } catch (error) {
    console.error("Error leaving room:", error.message);
    return {
      success: false,
      message: "Internal Server Error",
      data: null,
      error: error.message,
    };
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
  getActiveMembersInRoom,
};
