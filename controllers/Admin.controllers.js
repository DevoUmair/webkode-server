// adminController.js
import User from "../models/User.model.js";
import Account from "../models/Account.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    res.status(200).json(users); // Return all users
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error. Unable to fetch users." });
  }
};

export const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().populate("userId"); // Fetch all accounts with user info

    if (!accounts || accounts.length === 0) {
      return res.status(404).json({ message: "No accounts found." });
    }

    res.status(200).json(accounts); // Return all accounts
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error. Unable to fetch accounts." });
  }
};


export const login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
  
      if (!user || !(await user.comparePassword(password))) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
 
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
  
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
  
      user.refreshToken = refreshToken;
      await user.save();
  
      res
        .cookie("refreshToken", refreshToken, cookieOptions)
        .status(200)
        .json({
          message: "Admin login successful",
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