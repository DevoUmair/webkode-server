import express from 'express';
import { checkBalance , depositMoney  , createAccount, transferMoney , getAllTransaction} from '../controllers/Account.cotroller.js';
import { verifyToken  } from '../middlewares/auth.middleware.js';
import { verifyActiveSubscription  } from '../middlewares/subscription.middleware.js';

const router = express.Router();

// Apply middleware before the controller
router.post('/check-balance', verifyToken,  verifyActiveSubscription ,  checkBalance);
router.post('/deposit', verifyToken, verifyActiveSubscription , depositMoney);
router.post('/create-account', verifyToken, verifyActiveSubscription ,  createAccount);
router.post('/transfer-money', verifyToken, verifyActiveSubscription ,  transferMoney);
router.get('/transaction', verifyToken, verifyActiveSubscription , getAllTransaction);

export default router;
