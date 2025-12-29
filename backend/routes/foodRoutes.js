const express = require('express');
const router = express.Router();
const {
  getRestaurantMenu,
  getFoodItem,
  addFoodItem,
  updateFoodItem,
  deleteFoodItem,
  toggleAvailability
} = require('../controllers/foodController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/restaurant/:restaurantId', getRestaurantMenu);
router.get('/:id', getFoodItem);

// Restaurant owner routes
router.post('/', protect, authorize('restaurant'), addFoodItem);
router.put('/:id', protect, authorize('restaurant', 'admin'), updateFoodItem);
router.delete('/:id', protect, authorize('restaurant', 'admin'), deleteFoodItem);
router.put('/:id/toggle-availability', protect, authorize('restaurant'), toggleAvailability);

module.exports = router;
