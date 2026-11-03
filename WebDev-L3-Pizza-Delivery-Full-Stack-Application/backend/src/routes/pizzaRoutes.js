import express from 'express';
import {
  getAllPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
} from '../controllers/pizzaController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllPizzas);
router.get('/:id', getPizzaById);

// Admin-only endpoints
router.post('/', protect, requireAdmin, createPizza);
router.put('/:id', protect, requireAdmin, updatePizza);
router.delete('/:id', protect, requireAdmin, deletePizza);

export default router;

