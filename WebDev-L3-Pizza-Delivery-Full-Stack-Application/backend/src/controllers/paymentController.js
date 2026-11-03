import { createRazorpayOrder, verifyRazorpayPayment, getRazorpayKeyId } from '../config/razorpay.js';
import crypto from 'crypto';

// Get Razorpay Key for Frontend Checkout
export const getPaymentConfig = (req, res) => {
  res.status(200).json({
    success: true,
    keyId: getRazorpayKeyId(),
  });
};

// Create Razorpay Order
export const createOrderPayment = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = `rec_${Date.now()}` } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment amount.' });
    }

    const orderData = await createRazorpayOrder({
      amount,
      currency,
      receipt,
      notes: {
        userId: req.user._id.toString(),
        userEmail: req.user.email,
      },
    });

    res.status(200).json({
      success: true,
      order: orderData,
      keyId: getRazorpayKeyId(),
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment gateway.',
      error: error.message,
    });
  }
};

// Verify Razorpay Payment Signature
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and Payment ID are required.',
      });
    }

    const isValid = verifyRazorpayPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid transaction signature.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully.',
      paymentDetails: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        verifiedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment signature.',
      error: error.message,
    });
  }
};

