





const jwt = require("jsonwebtoken");



const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
      data: null,
      error: "No token provided",
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token.",
        data: null,
        error: "Invalid token",
      });
    } else {
      req.user = {
        username: decoded.userName,
        userid: decoded.userId,
      };
      next();
    }
  });
};


module.exports = { auth };