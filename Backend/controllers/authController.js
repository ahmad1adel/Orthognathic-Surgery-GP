import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const sanitize = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === "doctor" ? "doctor" : "patient",
    });

    return res.status(201).json({
      user: sanitize(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)[0]?.message || "Invalid data";
      return res.status(400).json({ message });
    }
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // password has select:false, so explicitly select it
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      user: sanitize(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get the currently logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  return res.status(200).json({ user: sanitize(req.user) });
};
