import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// View engine
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/demo", (req, res) => {
    res.render("demo");
});

// API / feature routes
app.use(authRoutes);
app.use(chatRoutes);

// ✅ Fallback route (IMPORTANT for refresh / unknown URLs)
app.get("*", (req, res) => {
    res.redirect("/");
});

// ✅ Safe PORT handling
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
    console.log("Server running on " + PORT)
);