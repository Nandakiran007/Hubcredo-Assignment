const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// POST /signup
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ message: "Missing fields" });

        const existing = await User.findOne({ email });
        if (existing)
            return res
                .status(400)
                .json({ message: "Email already registered" });

        const hash = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hash });
        await user.save();

        try {
            await axios.post(
                "https://n8n-workflow-7d3h.run/api/v1/webhook/new_user_signup",
                {
                    name: username,
                    email,
                    message: `Welcome ${username}! You have successfully signed up.`,
                    time: new Date().toISOString(),
                }
            );
            console.log("Webhook triggered successfully");
        } catch (webhookErr) {
            console.error("Webhook Failed:", webhookErr.message); 
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET||"dummy_secret",
            { expiresIn: "7d" }
        );
        res.json({
            token,
            user: { username: user.username, email: user.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST /login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Missing fields" });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET||"dummy_secret",
            { expiresIn: "7d" }
        );
        res.json({
            token,
            user: { username: user.username, email: user.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
