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
