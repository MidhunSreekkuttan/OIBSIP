import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pizza name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    image: {
      type: String,
      required: true,
    },
    isVegetarian: {
      type: Boolean,
      default: true,
    },
    badge: {
      type: String,
      enum: ['Bestseller', "Chef's Pick", 'New', 'Trending', 'Hot', 'Classic', ''],
      default: '',
    },
    base: {
      type: String,
      required: true,
    },
    sauce: {
      type: String,
      required: true,
    },
    cheese: {
      type: String,
      required: true,
    },
    vegetables: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Pizza = mongoose.model('Pizza', pizzaSchema);
export default Pizza;

