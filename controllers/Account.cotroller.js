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
  

export const createAccount = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(req.body);

    const decodedId = req.user.id;

    if (userId !== decodedId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const user = await User.findById(userId);
    console.log(user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingAccount = await Account.findOne({ userId });
    if (existingAccount) {
      return res.status(400).json({ message: 'Account already exists for this user' });
    }

    const account = new Account({
      userId,
      balance: 0,
      cnic: req.body.cnic || null,
    });

    await account.save();

    res.status(201).json({
      message: 'Account created successfully',
      accountId: account._id,
      balance: account.balance,
      cnic: account.cnic,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const transferMoney = async (req, res) => {
  try {
    const { senderId, receiverId, amount } = req.body;
    const decodedId = req.user.id;

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({ message: 'Invalid transfer amount' });
    }

    if (decodedId !== senderId) {
      return res.status(403).json({ message: 'Unauthorized. Sender ID mismatch' });
    }

    const senderObjectId = new mongoose.Types.ObjectId(senderId);
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

    const senderAccount = await Account.findOne({ userId: senderObjectId });
    const receiverAccount = await Account.findOne({ userId: receiverObjectId });

    if (!senderAccount) {
      return res.status(404).json({ message: 'Sender account not found' });
    }

    if (!receiverAccount) {
      return res.status(404).json({ message: 'Receiver account not found' });
    }

    if (senderAccount.balance < numericAmount) {
      return res.status(400).json({ message: 'Insufficient balance in sender account' });
    }

    senderAccount.balance -= numericAmount;
    receiverAccount.balance += numericAmount;

    await senderAccount.save();
    await receiverAccount.save();

    res.status(200).json({
      message: 'Transfer successful',
      senderBalance: senderAccount.balance,
      receiverBalance: receiverAccount.balance,
      senderId: senderAccount.userId,
      receiverId: receiverAccount.userId,
      amountTransferred: numericAmount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

