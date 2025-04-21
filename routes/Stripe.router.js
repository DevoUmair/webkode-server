import express from "express";
import { createCheckoutSession } from "../controllers/Stripe.controllers.js";
import { handleStripeWebhook } from "../controllers/Stripe.controllers.js";

const router = express.Router();

// Route to create a checkout session
router.post("/create-checkout-session", createCheckoutSession);

// Webhook route to handle Stripe events
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

export default router;
