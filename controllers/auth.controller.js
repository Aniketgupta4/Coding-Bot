import User from "../models/User.js";
import bcrypt from "bcrypt";

export const loginPage = (req, res) => res.render("login");
export const signupPage = (req, res) => res.render("signup");

export const signup = async (req, res) => {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, password: hash });
    res.redirect("/login");
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.redirect("/login");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.redirect("/login");

    req.session.userId = user._id;
    res.redirect("/chat");
};

export const logout = (req, res) => {
    req.session.destroy(() => res.redirect("/login"));
};
