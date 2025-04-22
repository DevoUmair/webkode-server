// adminRoutes.js
import express from "express";
import {
  getAllUsers,
  getAllAccounts,
  getAllInvoices
} from "../controllers/Admin.controllers.js";
import { verifyToken } from '../middlewares/auth.middleware.js';
import { verifyAdminRole } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get("/users", verifyToken, verifyAdminRole, getAllUsers);
router.get("/accounts", verifyToken, verifyAdminRole, getAllAccounts);
router.get("/invoices", verifyToken, verifyAdminRole, getAllInvoices);

export default router;
