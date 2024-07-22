const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomid: {
      type: String,
      required: true,
      unique: true,
    },
    host: {
      type: String,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    roomname: {
      type: String,
      required: true,
    },
    roomLink: {
      type: String,
      unique: true,
    },
    members: [
      {
        userid: {
          type: String,
          ref: "User",
        },
        username: String,
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        role: {
          type: String,
          enum: ["host", "member"],
          default: "member",
        },
        leftAt: {
          type: Date,
          default: null,
        },
        timesJoined: {
          type: Number,
          default: 1,
        },
      },
    ],
    roomClosed: {
      closed: {
        type: Boolean,
        default: false,
      },
      closedAt: {
        type: Date,
        default: null,
      },
    },
  },
  { versionKey: false }
);

const userRoomMapSchema = {
  userid: {
    type: String,
    required: true,
    unique: true,
  },
  roomdetails: {
    roomid: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["host", "member"],
      default: "member",
    },
  },
};

const RoomModel = mongoose.model("Room", roomSchema);
const UserRoomMapModel = mongoose.model("UserRoomMap", userRoomMapSchema);

module.exports = { RoomModel, UserRoomMapModel };
