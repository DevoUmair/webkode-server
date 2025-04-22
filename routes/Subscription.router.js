// import express from "express";
// import {
//   cancelSubscription,
//   createCheckoutSession,
//   getSubscription,
// } from "../controllers/Subscription.controllers.js";
// import { verifyToken } from "../middlewares/auth.middleware.js";
// import { verifyAdminRole } from "../middlewares/role.middleware.js";

// const router = express.Router();

// // Route to create a checkout session
// router.post("/create-checkout-session", verifyToken, createCheckoutSession);

// router.post(
//   "/cancel-subscription",
//   verifyToken,
//   verifyAdminRole,
//   cancelSubscription
// );

// router.get("/subscription", verifyToken, getSubscription);
// export default router;

import express from "express";
import {
  cancelSubscription,
  createCheckoutSession,
  getSubscription,
} from "../controllers/Subscription.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyAdminRole } from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /subscription/create-checkout-session:
 *   post:
 *     summary: Create a Stripe checkout session for subscription
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               priceId:
 *                 type: string
 *                 description: Stripe price ID for the subscription plan
 *               userEmail:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Stripe checkout session URL
 *       500:
 *         description: Internal server error
 */
router.post("/create-checkout-session", verifyToken, createCheckoutSession);

/**
 * @swagger
 * /subscription/cancel-subscription:
 *   post:
 *     summary: Cancel a user's subscription (Admin only)
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user whose subscription should be canceled
 *     responses:
 *       200:
 *         description: Subscription canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 subscription:
 *                   $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: No active subscription found
 *       500:
 *         description: Failed to cancel subscription
 */
router.post(
  "/cancel-subscription",
  verifyToken,
  verifyAdminRole,
  cancelSubscription
);

/**
 * @swagger
 * /subscription/subscription:
 *   get:
 *     summary: Get current user's subscription details
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Subscription not found
 *       500:
 *         description: Internal server error
 */
router.get("/subscription", verifyToken, getSubscription);

/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The user ID associated with the subscription
 *         stripeCustomerId:
 *           type: string
 *           description: Stripe customer ID
 *         stripeSubscriptionId:
 *           type: string
 *           description: Stripe subscription ID
 *         plan:
 *           type: string
 *           description: Subscription plan ID
 *         status:
 *           type: string
 *           enum: [active, past_due, canceled]
 *           description: Subscription status
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: When the subscription started
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: When the subscription ends (if canceled)
 *         nextBillingDate:
 *           type: string
 *           format: date-time
 *           description: Next billing date
 *         amount:
 *           type: number
 *           description: Subscription amount in smallest currency unit
 *         currency:
 *           type: string
 *           description: Currency code (e.g., usd)
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
export default router;
