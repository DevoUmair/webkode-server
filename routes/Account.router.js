import express from 'express';
import { checkBalance , depositMoney } from '../controllers/Account.cotroller.js';
import { verifyToken  } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply middleware before the controller
router.post('/check-balance', verifyToken, checkBalance);
router.post('/deposit', verifyToken, depositMoney);

export default router;
