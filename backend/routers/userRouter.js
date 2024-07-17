// routers/userRouter.js

const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require("../models/userSchema");
const auth = require('../middleware/auth'); // Import the auth middleware

const userRouter = express.Router();

// Ensure the required middleware and handlers are defined

// User registration endpoint
userRouter.post("/registration", async (req, res) => {
    const saltRounds = 10;
    const { name, email, password } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new userModel({ name, email, password: hashPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// User login endpoint
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const privateKey = process.env.JWT_SECRET || "masai"; // Use environment variable for the JWT secret
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ userId: user._id }, privateKey, { expiresIn: '1h' });
                res.status(200).json({ message: "Login success", token });
            } else {
                res.status(400).json({ message: "Invalid password" });
            }
        } else {
            res.status(400).json({ message: "User not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


// Admin-only route (requires auth middleware)
userRouter.get("/adminOnlyRoute", auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: Admin access required" });
        }
        res.status(200).json({ message: "Admin-only route accessed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = userRouter;
