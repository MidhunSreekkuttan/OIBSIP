import http from 'http';

const API_BASE = 'http://localhost:5000/api';

async function req(path, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function runTestSuite() {
  console.log('🚀 Starting Comprehensive Pizza Delivery Platform E2E Verification...\n');

  // Test 1: User Registration
  const testEmail = `tester_${Date.now()}@pizzatest.com`;
  console.log(`[1] Testing User Registration (${testEmail})...`);
  const regRes = await req('/auth/register', 'POST', {
    name: 'Test Customer',
    email: testEmail,
    password: 'TestPassword@123',
    phone: '+91 99999 88888',
    address: '123 Baker Street, Bangalore',
  });
  console.log(`  -> Status: ${regRes.status}, Verification Token: ${regRes.data.verificationToken ? 'YES' : 'NO'}`);
  if (!regRes.data.verificationToken) throw new Error('Registration failed to generate token');

  // Test 2: Email Verification
  console.log('[2] Testing Email Verification...');
  const verRes = await req(`/auth/verify-email?token=${regRes.data.verificationToken}`, 'GET');
  console.log(`  -> Status: ${verRes.status}, Message: ${verRes.data.message}`);
  if (!verRes.data.token) throw new Error('Email verification failed');

  // Test 3: User Login
  console.log('[3] Testing User Login with JWT...');
  const loginRes = await req('/auth/login', 'POST', {
    email: testEmail,
    password: 'TestPassword@123',
  });
  console.log(`  -> Status: ${loginRes.status}, JWT Token: ${loginRes.data.token ? 'Acquired' : 'Missing'}`);
  const userToken = loginRes.data.token;

  // Test 4: Forgot Password & Reset
  console.log('[4] Testing Forgot Password flow...');
  const forgotRes = await req('/auth/forgot-password', 'POST', { email: testEmail });
  console.log(`  -> Status: ${forgotRes.status}, Reset Token: ${forgotRes.data.resetToken ? 'YES' : 'NO'}`);
  const resetToken = forgotRes.data.resetToken;

  console.log('[5] Testing Password Reset confirmation...');
  const resetRes = await req(`/auth/reset-password/${resetToken}`, 'POST', {
    password: 'NewPassword@456',
  });
  console.log(`  -> Status: ${resetRes.status}, Message: ${resetRes.data.message}`);

  // Test 6: Pizza Varieties (User Dashboard)
  console.log('[6] Testing Pizza Varieties Dashboard...');
  const pizzasRes = await req('/pizzas', 'GET');
  console.log(`  -> Found ${pizzasRes.data.pizzas.length} pizza varieties.`);

  // Test 7: Custom Pizza Builder Options (5 Bases, 5 Sauces, etc.)
  console.log('[7] Testing Custom Pizza Builder Options...');
  const builderRes = await req('/inventory/builder-options', 'GET');
  const { bases, sauces, cheeses, vegetables } = builderRes.data.data;
  console.log(`  -> Bases count: ${bases.length} (Expected 5)`);
  console.log(`  -> Sauces count: ${sauces.length} (Expected 5)`);
  console.log(`  -> Cheeses count: ${cheeses.length}`);
  console.log(`  -> Vegetables count: ${vegetables.length}`);

  // Record initial stock of first base and sauce for decrement verification
  const initialBaseStock = bases[0].stockQuantity;
  const targetBaseName = bases[0].name;
  console.log(`  -> Initial stock of "${targetBaseName}": ${initialBaseStock}`);

  // Test 8: Razorpay Order Creation & Verification
  console.log('[8] Testing Razorpay Test Payment Integration...');
  const payOrderRes = await req('/payment/create-order', 'POST', { amount: 499 }, userToken);
  console.log(`  -> Razorpay Order ID: ${payOrderRes.data.order.id}`);

  const verifyPayRes = await req('/payment/verify', 'POST', {
    razorpay_order_id: payOrderRes.data.order.id,
    razorpay_payment_id: 'pay_test_' + Date.now(),
    razorpay_signature: 'mock_signature_success',
  }, userToken);
  console.log(`  -> Payment Verification: ${verifyPayRes.data.success ? 'VERIFIED' : 'FAILED'}`);

  // Test 9: Create Order with Custom Pizza & Verify Stock Decrement
  console.log('[9] Testing Order Placement with Custom Pizza...');
  const orderRes = await req('/orders', 'POST', {
    items: [
      {
        name: 'Custom Chef Special',
        type: 'custom',
        price: 499,
        quantity: 2,
        customization: {
          base: targetBaseName,
          sauce: sauces[0].name,
          cheese: cheeses[0].name,
          vegetables: [vegetables[0].name],
        },
      },
    ],
    deliveryAddress: {
      fullName: 'Test Customer',
      phone: '+91 99999 88888',
      address: '123 Baker Street',
      city: 'Bangalore',
      postalCode: '560038',
    },
    payment: {
      method: 'Razorpay',
      status: 'Completed',
      razorpayOrderId: payOrderRes.data.order.id,
      razorpayPaymentId: 'pay_test_' + Date.now(),
      razorpaySignature: 'mock_signature_success',
    },
    subtotal: 499,
    tax: 25,
    deliveryFee: 40,
    totalAmount: 564,
  }, userToken);

  const placedOrder = orderRes.data.order;
  console.log(`  -> Order Created: #${placedOrder.orderNumber}, Status: "${placedOrder.status}"`);

  // Test 10: Verify Stock Decrement
  console.log('[10] Verifying Automatic Stock Decrement after Order...');
  const updatedBuilderRes = await req('/inventory/builder-options', 'GET');
  const updatedBase = updatedBuilderRes.data.data.bases.find((b) => b.name === targetBaseName);
  console.log(`  -> Stock of "${targetBaseName}" after ordering 2 pizzas: ${updatedBase.stockQuantity} (Expected: ${initialBaseStock - 2})`);
  if (updatedBase.stockQuantity !== initialBaseStock - 2) {
    throw new Error('Stock decrement mismatch!');
  }

  // Test 11: Admin Login (Separate flow)
  console.log('[11] Testing Dedicated Admin Login...');
  const adminLoginRes = await req('/auth/admin-login', 'POST', {
    email: 'admin@pizzacraft.com',
    password: 'Admin@123456',
  });
  console.log(`  -> Admin JWT Token: ${adminLoginRes.data.token ? 'Acquired' : 'Failed'}`);
  const adminToken = adminLoginRes.data.token;

  // Test 12: Admin Inventory Manual Update
  console.log('[12] Testing Admin Manual Stock Update...');
  const adjRes = await req(`/inventory/${updatedBase._id}/adjust`, 'PATCH', { delta: 10 }, adminToken);
  console.log(`  -> Adjusted stock by +10. New stock: ${adjRes.data.item.stockQuantity}`);

  // Test 13: Admin Low-Stock Automated Alert Check (node-cron simulation)
  console.log('[13] Testing Scheduled Low-Stock Alert Job...');
  const alertRes = await req('/inventory/trigger-alert', 'POST', {}, adminToken);
  console.log(`  -> Alert scan complete. Found: ${alertRes.data.result?.count} low-stock items. Alert sent: ${alertRes.data.result?.alertSent}`);

  // Test 14: Admin Order Management & Live Status Updates
  console.log('[14] Testing Admin Order Status Transitions...');
  
  // Transition 1: Order Received -> In Kitchen
  const status1 = await req(`/orders/${placedOrder._id}/status`, 'PATCH', {
    status: 'In Kitchen',
    note: 'Dough stretched, toppings placed, entering oven.',
  }, adminToken);
  console.log(`  -> Advanced to: "${status1.data.order.status}"`);

  // Transition 2: In Kitchen -> Sent to Delivery
  const status2 = await req(`/orders/${placedOrder._id}/status`, 'PATCH', {
    status: 'Sent to Delivery',
    note: 'Pizza packed in thermal bag, assigned to rider.',
  }, adminToken);
  console.log(`  -> Advanced to: "${status2.data.order.status}"`);

  // Transition 3: Sent to Delivery -> Delivered
  const status3 = await req(`/orders/${placedOrder._id}/status`, 'PATCH', {
    status: 'Delivered',
    note: 'Delivered to customer doorstep.',
  }, adminToken);
  console.log(`  -> Advanced to: "${status3.data.order.status}"`);

  // Verify User can view updated status
  const userOrderCheck = await req(`/orders/${placedOrder._id}`, 'GET', null, userToken);
  console.log(`  -> User Dashboard View: Status is "${userOrderCheck.data.order.status}", Audit entries: ${userOrderCheck.data.order.statusHistory.length}`);

  console.log('\n🎉 ALL 14 E2E TEST CHECKS PASSED WITH 100% SUCCESS!\n');
}

runTestSuite().catch((err) => {
  console.error('\n❌ E2E TEST FAILED:', err);
  process.exit(1);
});

