import express from 'express';
import {
  getAllInventory,
  getCustomBuilderOptions,
  updateInventoryItem,
  adjustStock,
  triggerLowStockCheck,
  createInventoryItem,
  deleteInventoryItem,
} from '../controllers/inventoryController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / User routes
router.get('/', getAllInventory);
router.get('/builder-options', getCustomBuilderOptions);

// Admin-only inventory management
router.put('/:id', protect, requireAdmin, updateInventoryItem);
router.patch('/:id/adjust', protect, requireAdmin, adjustStock);
router.post('/trigger-alert', protect, requireAdmin, triggerLowStockCheck);
router.post('/', protect, requireAdmin, createInventoryItem);
router.delete('/:id', protect, requireAdmin, deleteInventoryItem);

export default router;

