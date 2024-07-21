// const jwt = require("jsonwebtoken");
// const { UserModel } = require("../models/user.model");

// const auth = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (token) {
//       jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
//         if (err) {
//           return res.status(401).json({ message: "Invalid token" });
//         } else {
//           req.user = {
//             username: decoded.username,
//             userid: decoded.userid,
//           };
//           console.log(req.user);
//           next();
//         }
//       });
//     } else {
//       return res
//         .status(401)
//         .json({ message: "No token found, please login first" });
//     }
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(500)
//       .json({ message: "Something went wrong", error: err.message });
//   }
// };

// module.exports = { auth };

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
        username: decoded.username,
        userid: decoded.userid,
      };
      next();
    }
  });
};


module.exports = { auth };
