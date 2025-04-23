import express from "express";
import {
  checkBalance,
  depositMoney,
  createAccount,
  transferMoney,
  getAllTransaction,
} from "../controllers/Account.cotroller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyActiveSubscription } from "../middlewares/subscription.middleware.js";
import { requestCounter } from "../middlewares/requestcount.middleware.js";

const router = express.Router();

// // Apply middleware before the controller
// router.post('/check-balance', verifyToken,  verifyActiveSubscription ,  checkBalance);
// router.post('/deposit', verifyToken, verifyActiveSubscription , depositMoney);
// router.post('/create-account', verifyToken, verifyActiveSubscription ,  createAccount);
// router.post('/transfer-money', verifyToken, verifyActiveSubscription ,  transferMoney);
// router.get('/transaction', verifyToken, verifyActiveSubscription , getAllTransaction);


/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: User account management
*/

/**
 * @swagger
 * /api/account/check-balance:
 *   post:
 *     summary: Check account balance
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to check balance for
 *     responses:
 *       200:
 *         description: Account balance information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 balance:
 *                   type: number
 *                 username:
 *                   type: string
 *                 lastUpdate:
 *                   type: string
 *                   format: date-time
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Account or user not found
 *       500:
 *         description: Server error
*/
router.post('/check-balance', verifyToken, verifyActiveSubscription,requestCounter,checkBalance);

/**
 * @swagger
 * /api/account/deposit:
 *   post:
 *     summary: Deposit money into account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - amount
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to deposit to
 *               amount:
 *                 type: number
 *                 description: Amount to deposit (must be positive)
 *     responses:
 *       200:
 *         description: Deposit successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 newBalance:
 *                   type: number
 *       400:
 *         description: Invalid deposit amount
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Account not found
 *       500:
 *         description: Server error
*/
router.post('/deposit', verifyToken, verifyActiveSubscription, requestCounter , depositMoney);

/**
 * @swagger
 * /api/account/create-account:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to create account for
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accountId:
 *                   type: string
 *                 balance:
 *                   type: number
 *                 cnic:
 *                   type: string
 *       400:
 *         description: Account already exists
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
*/
router.post('/create-account', verifyToken, verifyActiveSubscription, createAccount);

/**
 * @swagger
 * /api/account/transfer-money:
 *   post:
 *     summary: Transfer money between accounts
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderId
 *               - receiverId
 *               - amount
 *             properties:
 *               senderId:
 *                 type: string
 *                 description: ID of the sending user
 *               receiverId:
 *                 type: string
 *                 description: ID of the receiving user
 *               amount:
 *                 type: number
 *                 description: Amount to transfer (must be positive)
 *     responses:
 *       200:
 *         description: Transfer successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 senderBalance:
 *                   type: number
 *                 receiverBalance:
 *                   type: number
 *                 senderId:
 *                   type: string
 *                 receiverId:
 *                   type: string
 *                 amountTransferred:
 *                   type: number
 *       400:
 *         description: Invalid amount or insufficient balance
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Sender or receiver account not found
 *       500:
 *         description: Server error
*/
router.post('/transfer-money', verifyToken, verifyActiveSubscription, transferMoney);

/**
 * @swagger
 * /api/account/transaction:
 *   get:
 *     summary: Get all transactions for a user
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: No invoices found
 *       500:
 *         description: Server error
*/
router.get('/transaction', verifyToken, verifyActiveSubscription,requestCounter,getAllTransaction);
export default router;