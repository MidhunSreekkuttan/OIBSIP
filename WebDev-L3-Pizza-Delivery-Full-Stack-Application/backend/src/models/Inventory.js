import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['base', 'sauce', 'cheese', 'vegetable'],
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 50,
      min: [0, 'Stock cannot be negative'],
    },
    threshold: {
      type: Number,
      default: 20,
      min: [1, 'Threshold must be at least 1'],
    },
    unitPrice: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    unit: {
      type: String,
      default: 'units', // 'units', 'portions', 'servings'
    },
    description: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    lastAlertSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual to determine if item is currently low stock
inventorySchema.virtual('isLowStock').get(function () {
  return this.stockQuantity <= this.threshold;
});

inventorySchema.set('toJSON', { virtuals: true });
inventorySchema.set('toObject', { virtuals: true });

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;

