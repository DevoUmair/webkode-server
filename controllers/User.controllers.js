import User from "../models/User.model.js";
import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import cookieOptions from "../utils/cookieOptions.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const newUser = await User.create({ fullName, email, password, role });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(201)
      .json({
        message: "User registered successfully",
        accessToken,
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
        },
      });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({
        message: "Login successful",
        accessToken,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token)
    return res.status(401).json({ message: "No refresh token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token)
      return res
        .status(403)
        .json({ message: "Refresh token mismatch or expired" });

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json({ accessToken: newAccessToken });
  } catch (err) {
    res
      .status(403)
      .json({ message: "Invalid refresh token", error: err.message });
  }
};

export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204); // No content

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      user.refreshToken = "";
      await user.save();
    }

    res.clearCookie("refreshToken", { ...cookieOptions, maxAge: 0 });
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.clearCookie("refreshToken", { ...cookieOptions, maxAge: 0 });
    res.status(403).json({ message: "Invalid token on logout" });
  }
};
