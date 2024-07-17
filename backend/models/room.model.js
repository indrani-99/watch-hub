const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  participants: [{ type: String }],
});

module.exports = mongoose.model("Room", RoomSchema);
