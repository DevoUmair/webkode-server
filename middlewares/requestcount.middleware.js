import Subscription from "../models/Subscription.model.js";

// Request Count Stopper (Stops If user has exceeded limit)
export const requestcount = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    const subscription = await Subscription.findOne({
      userId,
      status: "active",
    });
    console.log(userId);

    if (!subscription) {
      return res
        .status(403)
        .json({ message: "Access denied. No active subscription found." });
    }
    req.plan = subscription.plan;

    next();
  } catch (error) {
    console.error("Subscription check error:", error);
    res
      .status(500)
      .json({ message: "Server error while checking subscription status." });
  }
};
