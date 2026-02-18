import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home"); // views/home.ejs render karega
});

app.get("/demo", (req, res) => {
    res.render("demo"); 
});

app.use(authRoutes);
app.use(chatRoutes);

app.listen(process.env.PORT, () =>
    console.log("Server running on " + process.env.PORT)
);
