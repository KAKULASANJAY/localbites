const FoodItem = require('../models/FoodItem');
const Restaurant = require('../models/Restaurant');

// @desc    Get food items for a restaurant
// @route   GET /api/foods/restaurant/:restaurantId
// @access  Public
exports.getRestaurantMenu = async (req, res, next) => {
  try {
    const { category, vegOnly, available } = req.query;

    let query = { restaurant: req.params.restaurantId };

    if (category) {
      query.category = category;
    }

    if (vegOnly === 'true') {
      query.isVeg = true;
    }

    if (available !== 'false') {
      query.isAvailable = true;
    }

    const foodItems = await FoodItem.find(query).sort({ category: 1, name: 1 });

    // Group by category
    const groupedMenu = foodItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      count: foodItems.length,
      data: foodItems,
      grouped: groupedMenu
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food item
// @route   GET /api/foods/:id
// @access  Public
exports.getFoodItem = async (req, res, next) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id).populate('restaurant', 'name');

    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: foodItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add food item
// @route   POST /api/foods
// @access  Private (restaurant owner)
exports.addFoodItem = async (req, res, next) => {
  try {
    // Get restaurant owned by user
    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'You must have a restaurant to add food items'
      });
    }

    const foodItem = await FoodItem.create({
      ...req.body,
      restaurant: restaurant._id
    });

    res.status(201).json({
      success: true,
      data: foodItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update food item
// @route   PUT /api/foods/:id
// @access  Private (restaurant owner)
exports.updateFoodItem = async (req, res, next) => {
  try {
    let foodItem = await FoodItem.findById(req.params.id).populate('restaurant', 'owner');

    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    // Check ownership
    if (foodItem.restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this food item'
      });
    }

    foodItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: foodItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete food item
// @route   DELETE /api/foods/:id
// @access  Private (restaurant owner)
exports.deleteFoodItem = async (req, res, next) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id).populate('restaurant', 'owner');

    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    // Check ownership
    if (foodItem.restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this food item'
      });
    }

    await foodItem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Food item deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle food availability
// @route   PUT /api/foods/:id/toggle-availability
// @access  Private (restaurant owner)
exports.toggleAvailability = async (req, res, next) => {
  try {
    let foodItem = await FoodItem.findById(req.params.id).populate('restaurant', 'owner');

    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    // Check ownership
    if (foodItem.restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    foodItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      { isAvailable: !foodItem.isAvailable },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: foodItem
    });
  } catch (error) {
    next(error);
  }
};
