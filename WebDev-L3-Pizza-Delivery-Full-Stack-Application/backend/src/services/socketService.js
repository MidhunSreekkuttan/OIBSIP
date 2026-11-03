import { Server } from 'socket.io';

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => callback(null, true),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`⚡ [Socket.io] Client connected: ${socket.id}`);

    // Join order room for live tracking
    socket.on('join_order_room', (orderId) => {
      if (orderId) {
        socket.join(`order_${orderId}`);
        console.log(`⚡ [Socket.io] Socket ${socket.id} joined room: order_${orderId}`);
      }
    });

    // Leave order room
    socket.on('leave_order_room', (orderId) => {
      if (orderId) {
        socket.leave(`order_${orderId}`);
        console.log(`⚡ [Socket.io] Socket ${socket.id} left room: order_${orderId}`);
      }
    });

    // Admin joins admin channel
    socket.on('join_admin_channel', () => {
      socket.join('admin_channel');
      console.log(`⚡ [Socket.io] Socket ${socket.id} joined admin_channel`);
    });

    socket.on('disconnect', () => {
      console.log(`⚡ [Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    console.warn('⚠️ [Socket.io] Socket.io not initialized yet.');
  }
  return io;
};

// Real-time broadcast helpers
export const emitOrderStatusUpdate = (order) => {
  if (!io) return;
  const orderId = order._id.toString();
  // Broadcast to specific order room
  io.to(`order_${orderId}`).emit('order_status_updated', order);
  // Also broadcast to admin room so admin dashboard stays synced
  io.to('admin_channel').emit('order_updated', order);
  // Global broadcast for user dashboard if listening to all their orders
  io.emit(`order_update_${orderId}`, order);
  console.log(`📡 [Socket.io] Broadcasted status "${order.status}" for order #${order.orderNumber}`);
};

export const emitNewOrder = (order) => {
  if (!io) return;
  io.to('admin_channel').emit('new_order_received', order);
  io.emit('global_new_order', { orderNumber: order.orderNumber, status: order.status });
  console.log(`📡 [Socket.io] Broadcasted new order #${order.orderNumber}`);
};

export const emitInventoryUpdate = (inventoryItem) => {
  if (!io) return;
  io.to('admin_channel').emit('inventory_item_updated', inventoryItem);
  io.emit('public_inventory_updated', {
    id: inventoryItem._id,
    name: inventoryItem.name,
    category: inventoryItem.category,
    isAvailable: inventoryItem.stockQuantity > 0,
    stockQuantity: inventoryItem.stockQuantity,
  });
  console.log(`📡 [Socket.io] Broadcasted inventory change for "${inventoryItem.name}" (stock: ${inventoryItem.stockQuantity})`);
};

