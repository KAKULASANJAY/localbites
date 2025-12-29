const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide food item name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
    min: [1, 'Price must be at least ₹1']
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
    enum: ['Starters', 'Main Course', 'Breads', 'Rice', 'Biryani', 'Chinese', 'Pizza', 'Burger', 'Sandwich', 'Rolls', 'Snacks', 'Desserts', 'Beverages', 'Thali', 'Combo', 'Sides', 'Pasta', 'Momos', 'Other']
  },
  image: {
    type: String,
    default: 'default-food.jpg'
  },
  isVeg: {
    type: Boolean,
    required: true,
    default: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  preparationTime: {
    type: String,
    default: '15-20 mins'
  },
  spiceLevel: {
    type: String,
    enum: ['Mild', 'Medium', 'Spicy', 'Extra Spicy'],
    default: 'Medium'
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
foodItemSchema.index({ restaurant: 1, category: 1 });
foodItemSchema.index({ restaurant: 1, isAvailable: 1 });

module.exports = mongoose.model('FoodItem', foodItemSchema);
