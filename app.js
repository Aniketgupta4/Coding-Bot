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

// Feature routes
app.use(authRoutes);
app.use(chatRoutes);

// ✅ Fallback route (Express 5 compatible)
app.use((req, res) => {
    res.redirect("/");
});

// ✅ Safe PORT handling (important for Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
    console.log("Server running on " + PORT)
);