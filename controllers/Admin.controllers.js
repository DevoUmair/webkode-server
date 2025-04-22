// adminController.js
import User from "../models/User.model.js";
import Account from "../models/Account.model.js";
import Invoice from "../models/Invoice.model.js";

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



export const getAllInvoices = async (req, res) => {
    try {
      // Populate sender and receiver account details along with user information
      const invoices = await Invoice.find()
        .populate({
          path: "senderAccountId",  // Populate sender account
          populate: {
            path: "userId",  // Populate user data for sender account
            select: "fullName email role",  // Only select required fields (modify as needed)
          },
        })
        .populate({
          path: "receiverAccountId",  // Populate receiver account
          populate: {
            path: "userId",  // Populate user data for receiver account
            select: "fullName email role",  // Only select required fields (modify as needed)
          },
        });
  
      if (!invoices || invoices.length === 0) {
        return res.status(404).json({ message: "No invoices found." });
      }
  
      res.status(200).json(invoices);  // Return all invoices along with user data
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error. Unable to fetch invoices." });
    }
};
