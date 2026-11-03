import Inventory from '../models/Inventory.js';
import { emitInventoryUpdate } from '../services/socketService.js';
import { checkLowStockAndAlert } from '../services/cronService.js';

// Get all inventory items (grouped or flat)
export const getAllInventory = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ category: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory items',
      error: error.message,
    });
  }
};

// Get inventory grouped by category for the Custom Pizza Builder
export const getCustomBuilderOptions = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ name: 1 });

    const grouped = {
      bases: items.filter((i) => i.category === 'base'),
      sauces: items.filter((i) => i.category === 'sauce'),
      cheeses: items.filter((i) => i.category === 'cheese'),
      vegetables: items.filter((i) => i.category === 'vegetable'),
    };

    res.status(200).json({
      success: true,
      data: grouped,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch builder options',
      error: error.message,
    });
  }
};

// Admin: Manual update of inventory stock and threshold
export const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockQuantity, threshold, unitPrice, isAvailable, name, description } = req.body;

    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    if (stockQuantity !== undefined) item.stockQuantity = Number(stockQuantity);
    if (threshold !== undefined) item.threshold = Number(threshold);
    if (unitPrice !== undefined) item.unitPrice = Number(unitPrice);
    if (isAvailable !== undefined) item.isAvailable = Boolean(isAvailable);
    if (name) item.name = name;
    if (description !== undefined) item.description = description;

    await item.save();

    // Broadcast change via WebSocket
    emitInventoryUpdate(item);

    // If stock became low, trigger alert check
    if (item.stockQuantity <= item.threshold) {
      checkLowStockAndAlert(false).catch((err) =>
        console.error('Background alert error on stock update:', err)
      );
    }

    res.status(200).json({
      success: true,
      message: `Stock for ${item.name} updated to ${item.stockQuantity}`,
      item,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Quick adjust stock (e.g. +10, -5)
export const adjustStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { delta } = req.body; // e.g., +10 or -5

    if (delta === undefined || isNaN(delta)) {
      return res.status(400).json({ success: false, message: 'Valid numerical delta is required' });
    }

    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const newStock = Math.max(0, item.stockQuantity + Number(delta));
    item.stockQuantity = newStock;
    item.isAvailable = newStock > 0;
    await item.save();

    emitInventoryUpdate(item);

    if (item.stockQuantity <= item.threshold) {
      checkLowStockAndAlert(false).catch((err) =>
        console.error('Background alert error on adjust:', err)
      );
    }

    res.status(200).json({
      success: true,
      message: `Stock adjusted by ${delta > 0 ? '+' + delta : delta}. Current stock: ${newStock}`,
      item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Manual trigger to check low stock and send alert email immediately
export const triggerLowStockCheck = async (req, res) => {
  try {
    const result = await checkLowStockAndAlert(true); // force send alert
    res.status(200).json({
      success: true,
      message: 'Low-stock check completed.',
      result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Create new inventory item
export const createInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.create(req.body);
    emitInventoryUpdate(item);
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Admin: Delete inventory item
export const deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

