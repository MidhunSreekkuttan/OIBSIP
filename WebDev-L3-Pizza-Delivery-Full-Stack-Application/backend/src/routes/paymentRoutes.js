import express from 'express';
import {
  getPaymentConfig,
  createOrderPayment,
  verifyPayment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/config', getPaymentConfig);
router.post('/create-order', protect, createOrderPayment);
router.post('/verify', protect, verifyPayment);

export default router;

