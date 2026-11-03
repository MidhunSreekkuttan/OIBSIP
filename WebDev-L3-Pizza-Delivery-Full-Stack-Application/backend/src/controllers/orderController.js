import Order from '../models/Order.js';
import Inventory from '../models/Inventory.js';
import { emitOrderStatusUpdate, emitNewOrder, emitInventoryUpdate } from '../services/socketService.js';
import { checkLowStockAndAlert } from '../services/cronService.js';

// Helper to decrement stock for an order's items
export const decrementStockForOrder = async (orderItems) => {
  const stockChanges = {};

  for (const item of orderItems) {
    const qty = item.quantity || 1;

    if (item.customization) {
      const { base, sauce, cheese, vegetables } = item.customization;

      if (base) stockChanges[base] = (stockChanges[base] || 0) + qty;
      if (sauce) stockChanges[sauce] = (stockChanges[sauce] || 0) + qty;
      if (cheese) stockChanges[cheese] = (stockChanges[cheese] || 0) + qty;
      if (vegetables && Array.isArray(vegetables)) {
        for (const veg of vegetables) {
          stockChanges[veg] = (stockChanges[veg] || 0) + qty;
        }
      }
    }
  }

  console.log('📉 [Inventory] Decrementing stock for order items:', stockChanges);

  for (const [itemName, deduction] of Object.entries(stockChanges)) {
    const inventoryItem = await Inventory.findOne({
      name: { $regex: new RegExp(`^${itemName}$`, 'i') },
    });

    if (inventoryItem) {
      const newStock = Math.max(0, inventoryItem.stockQuantity - deduction);
      inventoryItem.stockQuantity = newStock;
      if (newStock === 0) {
        inventoryItem.isAvailable = false;
      }
      await inventoryItem.save();
      emitInventoryUpdate(inventoryItem);
    }
  }

  // Trigger low-stock check in background
  checkLowStockAndAlert(false).catch((err) =>
    console.error('Background low-stock check error after order decrement:', err)
  );
};

// Check availability before ordering
export const checkStockAvailability = async (orderItems) => {
  const requiredCounts = {};

  for (const item of orderItems) {
    const qty = item.quantity || 1;
    if (item.customization) {
      const { base, sauce, cheese, vegetables } = item.customization;
      if (base) requiredCounts[base] = (requiredCounts[base] || 0) + qty;
      if (sauce) requiredCounts[sauce] = (requiredCounts[sauce] || 0) + qty;
      if (cheese) requiredCounts[cheese] = (requiredCounts[cheese] || 0) + qty;
      if (vegetables && Array.isArray(vegetables)) {
        for (const veg of vegetables) {
          requiredCounts[veg] = (requiredCounts[veg] || 0) + qty;
        }
      }
    }
  }

  for (const [itemName, needed] of Object.entries(requiredCounts)) {
    const inv = await Inventory.findOne({
      name: { $regex: new RegExp(`^${itemName}$`, 'i') },
    });
    if (!inv || inv.stockQuantity < needed) {
      return {
        available: false,
        message: `Sorry, "${itemName}" is out of stock or does not have enough quantity (needed: ${needed}, available: ${inv ? inv.stockQuantity : 0}).`,
      };
    }
  }

  return { available: true };
};

// Create a new order (called after payment verification or direct test mode)
export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, payment, subtotal, tax, deliveryFee, discount, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required.' });
    }

    if (!deliveryAddress || !deliveryAddress.fullName || !deliveryAddress.address || !deliveryAddress.phone) {
      return res.status(400).json({ success: false, message: 'Complete delivery details are required.' });
    }

    // Verify stock availability
    const stockCheck = await checkStockAvailability(items);
    if (!stockCheck.available) {
      return res.status(400).json({ success: false, message: stockCheck.message });
    }

    // Generate readable order number: PZ-XXXXX
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `PZ-${randomSuffix}`;

    // Calculate delivery time (approx 35-45 minutes from now)
    const estimatedDeliveryTime = new Date(Date.now() + 35 * 60 * 1000);

    const newOrder = await Order.create({
      orderNumber,
      user: req.user._id,
      items,
      subtotal: Number(subtotal),
      tax: Number(tax || 0),
      deliveryFee: Number(deliveryFee || 40),
      discount: Number(discount || 0),
      totalAmount: Number(totalAmount),
      deliveryAddress,
      payment: {
        method: payment?.method || 'Razorpay',
        status: payment?.status || 'Completed',
        razorpayOrderId: payment?.razorpayOrderId || '',
        razorpayPaymentId: payment?.razorpayPaymentId || '',
        razorpaySignature: payment?.razorpaySignature || '',
        paidAt: new Date(),
      },
      status: 'Order Received',
      statusHistory: [
        {
          status: 'Order Received',
          timestamp: new Date(),
          note: 'Your order has been received by the kitchen team.',
        },
      ],
      estimatedDeliveryTime,
    });

    // Automatically decrement stock for all ordered pizza ingredients
    await decrementStockForOrder(items);

    // Broadcast new order to Admin panel
    emitNewOrder(newOrder);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order.',
    });
  }
};

// Get current user's orders (with live tracking)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single order by ID (with authorization check)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Security check: only order owner or admin can view
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this order.' });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all orders across platform
export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update order status (Order Received -> In Kitchen -> Sent to Delivery -> Delivered)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['Order Received', 'In Kitchen', 'Sent to Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid values: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(id).populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order updated to ${status} by kitchen supervisor.`,
    });

    await order.save();

    // Real-time broadcast to user and admin
    emitOrderStatusUpdate(order);

    res.status(200).json({
      success: true,
      message: `Order status updated to "${status}"`,
      order,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

