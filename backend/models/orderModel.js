// backend/models/orderModel.js
import mongoose from 'mongoose';

const orderItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  priceAtTimeOfOrder: { type: Number, required: true },
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'MenuItem',
  },
});

const orderSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Restaurant',
    },
    items: [orderItemSchema], // Array of the embedded orderItemSchema
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    customerAddress: {
      type: String, // Snapshot of where the food is going
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Pending',
      enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;