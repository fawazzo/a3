// backend/routes/orderRoutes.js
import express from 'express';
const router = express.Router();
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  addOrderItems,
  getMyOrders,
  getRestaurantOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';

// Customer: Place a new order
router.route('/').post(protect, authorize('customer'), addOrderItems);

// Customer: View their orders
router.route('/customer').get(protect, authorize('customer'), getMyOrders);

// Restaurant: View orders received by their restaurant
router.route('/restaurant').get(protect, authorize('restaurant'), getRestaurantOrders);

// Restaurant: Update status of an order
router.route('/:id/status').put(protect, authorize('restaurant'), updateOrderStatus);

export default router;