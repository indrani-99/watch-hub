const { RoomModel } = require("../models/room.model.js");

const access = (roles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userid;
      const { roomid } = req.params;

      const room = await RoomModel.findOne({ roomId: roomid });

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found",
          data: null,
          error: "Room not found",
        });
      }

      const member = room.members.find(
        (member) => member.userId.toString() === userId
      );

      if (!member || !roles.includes(member.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
          data: null,
          error:
            "You do not have the necessary permissions to perform this action",
        });
      }

      next();
    } catch (error) {
      console.error("Error checking role:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server error",
        data: null,
        error: error.message,
      });
    }
  };
};

module.exports = { access };
