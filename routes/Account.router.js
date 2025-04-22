import express from 'express';
import { checkBalance , depositMoney  , createAccount} from '../controllers/Account.cotroller.js';
import { verifyToken  } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply middleware before the controller
router.post('/check-balance', verifyToken, checkBalance);
router.post('/deposit', verifyToken, depositMoney);
router.post('/create-account', verifyToken, createAccount);

export default router;
