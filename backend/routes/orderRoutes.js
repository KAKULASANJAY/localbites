const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrder,
  getRestaurantOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// Customer routes
router.post('/', protect, authorize('customer'), placeOrder);
router.get('/my-orders', protect, authorize('customer'), getMyOrders);
router.put('/:id/cancel', protect, authorize('customer'), cancelOrder);

// Restaurant routes
router.get('/restaurant', protect, authorize('restaurant'), getRestaurantOrders);
router.put('/:id/status', protect, authorize('restaurant', 'admin'), updateOrderStatus);

// Common
router.get('/:id', protect, getOrder);

module.exports = router;
