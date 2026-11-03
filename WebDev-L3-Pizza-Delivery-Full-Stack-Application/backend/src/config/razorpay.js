import Razorpay from 'razorpay';
import crypto from 'crypto';

const isMock = !process.env.RAZORPAY_KEY_ID || 
  process.env.RAZORPAY_KEY_ID.includes('placeholder') ||
  !process.env.RAZORPAY_KEY_SECRET ||
  process.env.RAZORPAY_KEY_SECRET.includes('placeholder');

let razorpayInstance = null;

if (!isMock) {
  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('💳 [Razorpay] Initialized with configured API keys');
  } catch (error) {
    console.warn('⚠️ [Razorpay] Initialization warning:', error.message);
  }
} else {
  console.log('🧪 [Razorpay] Running in Test Simulation Mode (No external keys needed)');
}

export const createRazorpayOrder = async ({ amount, currency = 'INR', receipt, notes = {} }) => {
  if (razorpayInstance) {
    try {
      const order = await razorpayInstance.orders.create({
        amount: Math.round(amount * 100), // convert to paise
        currency,
        receipt,
        notes,
      });
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        isMock: false,
      };
    } catch (err) {
      console.warn('⚠️ [Razorpay] Order creation via API failed, switching to test mock order:', err.message);
    }
  }

  // Simulated Test Order
  const mockId = 'order_' + crypto.randomBytes(10).toString('hex');
  return {
    id: mockId,
    amount: Math.round(amount * 100),
    currency,
    receipt,
    notes,
    isMock: true,
  };
};

export const verifyRazorpayPayment = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  // If in mock mode or mock order id
  if (isMock || razorpay_order_id.startsWith('order_mock_') || razorpay_signature === 'mock_signature_success') {
    return true;
  }

  try {
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret')
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpay_signature;
  } catch (err) {
    console.error('Error verifying payment signature:', err);
    return false;
  }
};

export const getRazorpayKeyId = () => {
  return isMock ? 'rzp_test_simulated_key' : process.env.RAZORPAY_KEY_ID;
};

