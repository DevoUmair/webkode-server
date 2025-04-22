import express from 'express';
import { generateInvoice} from '../controllers/Invoice.controllers.js';
import { verifyToken  } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply middleware before the controller
router.post('/generate-invoice', verifyToken, generateInvoice);

export default router;
