import "./config.js";
import express from "express";
import cors from "cors";
import { connectDB } from "./db/connectDb.js";
import userRoutes from "./routes/User.router.js";
import cookieParser from "cookie-parser";
import stripeRoutes from "./routes/Stripe.router.js";

connectDB();
const app = express();
app.use(cookieParser());
const allowedOrigins = ["http://localhost:5173"];
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      console.log("Incoming request from origin:", origin);

      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// Routes
app.use("/api/user", userRoutes);
app.use("/api/stripe", stripeRoutes);

// Routers
app.get("/", (req, res) => {
  res.send("Hello, Webkode API is working!");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server listen", port);
});
