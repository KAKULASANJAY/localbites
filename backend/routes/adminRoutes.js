const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllRestaurants,
  approveRestaurant,
  updateCommission,
  getAllUsers,
  toggleUserActive,
  getAllOrders
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/stats', getDashboardStats);

// Restaurants management
router.get('/restaurants', getAllRestaurants);
router.put('/restaurants/:id/approve', approveRestaurant);
router.put('/restaurants/:id/commission', updateCommission);

// Users management
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-active', toggleUserActive);

// Orders management
router.get('/orders', getAllOrders);

module.exports = router;
