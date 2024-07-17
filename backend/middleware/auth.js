// middleware/auth.js

const jwt = require('jsonwebtoken');
const userModel = require('../models/userSchema'); // Adjust the path as needed

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: "Invalid token" });
                } else {
                    const user = await userModel.findById(decoded.userId);
                    if (!user) {
                        return res.status(404).json({ message: "User not found" });
                    }
                    req.user = user;
                    next();
                }
            });
        } else {
            return res.status(401).json({ message: "No token found, please login first" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};

module.exports = auth;
