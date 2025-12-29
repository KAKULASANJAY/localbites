const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

// @desc    Get all approved restaurants
// @route   GET /api/restaurants
// @access  Public
exports.getRestaurants = async (req, res, next) => {
  try {
    const { search, cuisine, vegOnly, sortBy } = req.query;

    // Build query
    let query = { isApproved: true };

    // Search by name or area
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'address.area': { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by cuisine
    if (cuisine) {
      query.cuisine = { $in: cuisine.split(',') };
    }

    // Filter veg only restaurants
    if (vegOnly === 'true') {
      query.isVegOnly = true;
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'rating':
        sort = { rating: -1 };
        break;
      case 'deliveryTime':
        sort = { deliveryTime: 1 };
        break;
      case 'minOrder':
        sort = { minOrder: 1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const restaurants = await Restaurant.find(query)
      .sort(sort)
      .select('-commissionPercentage');

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single restaurant with menu
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .select('-commissionPercentage')
      .populate({
        path: 'menu',
        match: { isAvailable: true },
        select: '-createdAt -updatedAt -__v'
      });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create restaurant (for restaurant owners)
// @route   POST /api/restaurants
// @access  Private (restaurant role)
exports.createRestaurant = async (req, res, next) => {
  try {
    // Check if user already has a restaurant
    const existingRestaurant = await Restaurant.findOne({ owner: req.user.id });
    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: 'You already have a registered restaurant'
      });
    }

    const restaurant = await Restaurant.create({
      ...req.body,
      owner: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Restaurant created. Waiting for admin approval.',
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my restaurant (for restaurant owners)
// @route   GET /api/restaurants/my-restaurant
// @access  Private (restaurant role)
exports.getMyRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id })
      .populate({
        path: 'menu',
        select: '-createdAt -updatedAt -__v'
      });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'You have not registered a restaurant yet'
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (restaurant owner)
exports.updateRestaurant = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check ownership
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this restaurant'
      });
    }

    // Fields that restaurant owner can update
    const allowedFields = ['name', 'description', 'phone', 'address', 'openingTime', 'closingTime', 'isOpen', 'deliveryTime', 'minOrder', 'deliveryCharge', 'isVegOnly', 'image', 'cuisine'];
    
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle restaurant open/close
// @route   PUT /api/restaurants/:id/toggle-status
// @access  Private (restaurant owner)
exports.toggleStatus = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check ownership
    if (restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { isOpen: !restaurant.isOpen },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};
