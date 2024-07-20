//19th July

const mongoose = require("mongoose");
const shortid = require("shortid");

const shortid = require("shortid");


const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      default: shortid.generate,
      unique: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    roomName: {
      type: String,
      required: true,
    },
    roomLink: {
      type: String,
      unique: true,
    },
    messages: [
      {
        user: String,
        message: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        userName: String,
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

const RoomModel = mongoose.model("Room", roomSchema);

module.exports = { RoomModel };
