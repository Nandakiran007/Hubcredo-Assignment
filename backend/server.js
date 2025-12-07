require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;
app.use(
    cors({
        origin: "https://hubcredo-assignment-k91i.vercel.app",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

async function start() {
    try {
        await mongoose.connect(
            process.env.MONGO_URI || "mongodb://localhost:27017/credousers"
        );
        console.log("Connected to MongoDB");
        app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    } catch (err) {
        console.error("Failed to start server", err);
    }
}

start();
