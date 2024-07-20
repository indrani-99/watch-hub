const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel } = require("../models/user.model");

const userRouter = express.Router();


// User registration 
userRouter.post("/register", async (req, res) => {
    const saltRounds = 10;
    const { username, email, password } = req.body;
    const isUserExists=await UserModel.findOne({email});
    try {
        if(!isUserExists)
        {
            const hashPassword = await bcrypt.hash(password, saltRounds);
            const newUser = new UserModel({ username, email, password: hashPassword });
            await newUser.save();
            res.status(201).json({ message: "User registered successfully" });
        }
        else
            res.status(500).json({message:"You are already registered! Please login"})
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// User login 
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const privateKey = process.env.SECRET_KEY || "masai"; // Use environment variable for the JWT secret
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ userid: user._id ,username:user.username}, privateKey, { expiresIn: '1h' });
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


module.exports={
    userRouter
}