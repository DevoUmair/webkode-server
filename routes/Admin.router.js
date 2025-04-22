// // adminRoutes.js
// import express from "express";
// import {
//   getAllUsers,
//   getAllAccounts,
//   login,
//   getAllUserDetails,
//   createAdmin
// } from "../controllers/Admin.controllers.js";
// import { verifyToken } from '../middlewares/auth.middleware.js';
// import { verifyAdminRole } from '../middlewares/role.middleware.js';

// const router = express.Router();

// router.get("/users-data", verifyToken, verifyAdminRole, getAllUserDetails);
// router.get("/users", verifyToken, verifyAdminRole, getAllUsers);
// router.get("/accounts", verifyToken, verifyAdminRole, getAllAccounts);
// router.post("/create-admin", verifyToken, verifyAdminRole, createAdmin);
// router.post('/login' , login)

// export default router;
// adminRoutes.js
import express from "express";
import {
  getAllUsers,
  getAllAccounts,
  login,
  getAllUserDetails,
  createAdmin
} from "../controllers/Admin.controllers.js";
import { verifyToken } from '../middlewares/auth.middleware.js';
import { verifyAdminRole } from '../middlewares/role.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /admin/users-data:
 *   get:
 *     summary: Get all developer user details with account and subscription info
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of developer users with account and subscription details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   fullName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   balance:
 *                     type: number
 *                   subscriptionStatus:
 *                     type: string
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.get("/users-data", verifyToken, verifyAdminRole, getAllUserDetails);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: No users found
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.get("/users", verifyToken, verifyAdminRole, getAllUsers);

/**
 * @swagger
 * /admin/accounts:
 *   get:
 *     summary: Get all accounts with user info
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of all accounts with populated user info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 *       404:
 *         description: No accounts found
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.get("/accounts", verifyToken, verifyAdminRole, getAllAccounts);

/**
 * @swagger
 * /admin/create-admin:
 *   post:
 *     summary: Create a new admin user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin user created successfully
 *       400:
 *         description: Email already in use
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.post("/create-admin", verifyToken, verifyAdminRole, createAdmin);

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: Refresh token in HTTP-only cookie
 *       400:
 *         description: Invalid email or password
 *       403:
 *         description: Access denied - Admins only
 *       500:
 *         description: Server error
 */
router.post('/login', login);

export default router;