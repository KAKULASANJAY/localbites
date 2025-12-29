const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  getMyRestaurant,
  updateRestaurant,
  toggleStatus
} = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getRestaurants);
router.get('/:id', getRestaurant);

// Restaurant owner routes
router.post('/', protect, authorize('restaurant'), createRestaurant);
router.get('/owner/my-restaurant', protect, authorize('restaurant'), getMyRestaurant);
router.put('/:id', protect, authorize('restaurant', 'admin'), updateRestaurant);
router.put('/:id/toggle-status', protect, authorize('restaurant'), toggleStatus);

module.exports = router;
