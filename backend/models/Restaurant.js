const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide restaurant name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  cuisine: [{
    type: String,
    enum: ['North Indian', 'South Indian', 'Chinese', 'Fast Food', 'Street Food', 'Biryani', 'Pizza', 'Desserts', 'Beverages', 'Thali', 'Mughlai', 'Italian', 'Continental', 'Other']
  }],
  address: {
    street: {
      type: String,
      required: [true, 'Please provide street address']
    },
    area: {
      type: String,
      required: [true, 'Please provide area']
    },
    city: {
      type: String,
      default: 'Annavaram'
    },
    pincode: String,
    landmark: String
  },
  phone: {
    type: String,
    required: [true, 'Please provide restaurant phone number']
  },
  image: {
    type: String,
    default: 'default-restaurant.jpg'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  openingTime: {
    type: String,
    default: '09:00'
  },
  closingTime: {
    type: String,
    default: '22:00'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  deliveryTime: {
    type: String,
    default: '30-45 mins'
  },
  minOrder: {
    type: Number,
    default: 100
  },
  deliveryCharge: {
    type: Number,
    default: 20
  },
  isVegOnly: {
    type: Boolean,
    default: false
  },
  commissionPercentage: {
    type: Number,
    default: 10,
    min: 0,
    max: 30
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for menu items
restaurantSchema.virtual('menu', {
  ref: 'FoodItem',
  localField: '_id',
  foreignField: 'restaurant',
  justOne: false
});

// Index for searching
restaurantSchema.index({ name: 'text', 'address.area': 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
