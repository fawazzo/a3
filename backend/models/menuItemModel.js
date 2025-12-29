// backend/models/menuItemModel.js
import mongoose from 'mongoose';

const menuItemSchema = mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Restaurant',
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      // Example categories
      enum: ['Main Dish', 'Appetizer', 'Dessert', 'Drink', 'Side'],
    },
    imageUrl: {
      type: String,
      required: false, // Optional for simplicity, but requested
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;