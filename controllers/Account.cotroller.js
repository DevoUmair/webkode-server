import Account from '../models/Account.model.js'; 
import User from '../models/User.model.js'; 
import mongoose from 'mongoose';

export const checkBalance = async (req, res) => {
  try {
    const { userId: requestedUserId } = req.body;  
    const decodedId = req.user.id; // From middleware

    if (decodedId !== requestedUserId) {
      return res.status(403).json({ message: 'Unauthorized access. User IDs do not match' });
    }

    const userId = new mongoose.Types.ObjectId(decodedId);

    const account = await Account.findOne({ userId });

    if (!account) {
      return res.status(404).json({ message: 'Account not found for this user' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Account found',
      balance: account.balance,
      username: user.fullName, 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const depositMoney = async (req, res) => {
    try {
      const { userId: requestedUserId, amount } = req.body;
      const decodedId = req.user.id;
  
      const numericAmount = Number(amount);
  
      if (!numericAmount || numericAmount <= 0) {
        return res.status(400).json({ message: 'Invalid deposit amount' });
      }
  
      if (decodedId !== requestedUserId) {
        return res.status(403).json({ message: 'Unauthorized access. User IDs do not match' });
      }
  
      const userId = new mongoose.Types.ObjectId(decodedId);
  
      const account = await Account.findOne({ userId });
  
      if (!account) {
        return res.status(404).json({ message: 'Account not found for this user' });
      }
  
      account.balance += numericAmount;
      await account.save();
  
      res.status(200).json({
        message: 'Deposit successful',
        newBalance: account.balance,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  