import express from 'express';
import { checkBalance , depositMoney  , createAccount, transferMoney} from '../controllers/Account.cotroller.js';
import { verifyToken  } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply middleware before the controller
router.post('/check-balance', verifyToken, checkBalance);
router.post('/deposit', verifyToken, depositMoney);
router.post('/create-account', verifyToken, createAccount);
router.post('/transfer-money', verifyToken, transferMoney);

export default router;
