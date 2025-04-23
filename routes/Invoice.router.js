// import express from 'express';
// import { generateInvoice , getInvoices} from '../controllers/Invoice.controllers.js';
// import { verifyToken  } from '../middlewares/auth.middleware.js';

// const router = express.Router();

// // Apply middleware before the controller
// router.post('/generate-invoice', verifyToken, generateInvoice);
// router.get('/get-invoice', verifyToken, getInvoices);

// export default router;

import express from 'express';
import { generateInvoice, getInvoices } from '../controllers/Invoice.controllers.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import {requestCounter} from '../middlewares/requestcount.middleware.js'

const router = express.Router();

/**
 * @swagger
 * /api/invoice/generate-invoice:
 *   post:
 *     summary: Generate a new invoice
 *     description: Create an invoice from one account to another
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderAccountId
 *               - receiverAccountId
 *               - amount
 *             properties:
 *               senderAccountId:
 *                 type: string
 *                 description: ID of the sending account
 *               receiverAccountId:
 *                 type: string
 *                 description: ID of the receiving account
 *               amount:
 *                 type: number
 *                 description: Invoice amount (must be positive)
 *     responses:
 *       201:
 *         description: Invoice generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 invoiceId:
 *                   type: string
 *                 senderAccountId:
 *                   type: string
 *                 receiverAccountId:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid input (e.g., invalid amount)
 *       403:
 *         description: Unauthorized (user doesn't own sender account)
 *       404:
 *         description: Account not found
 *       500:
 *         description: Server error
 */
router.post('/generate-invoice', verifyToken, requestCounter ,generateInvoice);

/**
 * @swagger
 * /api/invoice/get-invoice:
 *   get:
 *     summary: Get invoices for a user
 *     description: Retrieve invoices within a date range where the user is either sender or receiver
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date of the range (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date of the range (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of invoices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Missing or invalid date parameters
 *       404:
 *         description: No invoices found in date range
 *       500:
 *         description: Server error
 */
router.get('/get-invoice', verifyToken, requestCounter , getInvoices);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the invoice
 *         senderAccountId:
 *           $ref: '#/components/schemas/Account'
 *         receiverAccountId:
 *           $ref: '#/components/schemas/Account'
 *         amount:
 *           type: number
 *           description: The invoice amount
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - senderAccountId
 *         - receiverAccountId
 *         - amount
 * 
 *     Account:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           $ref: '#/components/schemas/User'
 * 
 *     User:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */