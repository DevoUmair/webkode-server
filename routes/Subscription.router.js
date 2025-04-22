import express from "express";
import {
  createCheckoutSession,
  getSubscription,
} from "../controllers/Subscription.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();
// Route to create a checkout session
router.get("/subscription", getSubscription);
router.post("/create-checkout-session", verifyToken, createCheckoutSession);

// Webhook route to handle Stripe events
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   handleStripeWebhook
// );

export default router;
