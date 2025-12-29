const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

// @desc    Place new order
// @route   POST /api/orders
// @access  Private (customer)
exports.placeOrder = async (req, res, next) => {
  try {
    const { restaurantId, items, deliveryAddress, specialInstructions } = req.body;

    // Validate restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    if (!restaurant.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant is not available'
      });
    }

    if (!restaurant.isOpen) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant is currently closed'
      });
    }

    // Validate and calculate items
    let itemsTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const foodItem = await FoodItem.findById(item.foodItem);
      
      if (!foodItem) {
        return res.status(400).json({
          success: false,
          message: `Food item not found: ${item.foodItem}`
        });
      }

      if (!foodItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${foodItem.name} is currently unavailable`
        });
      }

      if (foodItem.restaurant.toString() !== restaurantId) {
        return res.status(400).json({
          success: false,
          message: 'All items must be from the same restaurant'
        });
      }

      orderItems.push({
        foodItem: foodItem._id,
        name: foodItem.name,
        price: foodItem.price,
        quantity: item.quantity
      });

      itemsTotal += foodItem.price * item.quantity;
    }

    // Check minimum order
    if (itemsTotal < restaurant.minOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is ₹${restaurant.minOrder}`
      });
    }

    const totalAmount = itemsTotal + restaurant.deliveryCharge;

    // Create order
    const order = await Order.create({
      customer: req.user.id,
      restaurant: restaurantId,
      items: orderItems,
      itemsTotal,
      deliveryCharge: restaurant.deliveryCharge,
      totalAmount,
      commission: {
        percentage: restaurant.commissionPercentage,
        amount: Math.round((itemsTotal * restaurant.commissionPercentage) / 100)
      },
      deliveryAddress,
      specialInstructions,
      paymentMethod: 'cod'
    });

    // Populate order details
    await order.populate([
      { path: 'restaurant', select: 'name phone address' },
      { path: 'customer', select: 'name phone' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer's orders
// @route   GET /api/orders/my-orders
// @access  Private (customer)
exports.getMyOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = { customer: req.user.id };

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('restaurant', 'name phone address image')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / limit),
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name phone address')
      .populate('customer', 'name phone')
      .populate('deliveryPartner', 'name phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    const restaurant = await Restaurant.findById(order.restaurant);
    const isOwner = order.customer._id.toString() === req.user.id;
    const isRestaurant = restaurant && restaurant.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isRestaurant && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get restaurant orders
// @route   GET /api/orders/restaurant
// @access  Private (restaurant)
exports.getRestaurantOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    // Get restaurant owned by user
    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    let query = { restaurant: restaurant._id };

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('customer', 'name phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    // Get counts by status
    const statusCounts = await Order.aggregate([
      { $match: { restaurant: restaurant._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / limit),
      statusCounts,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (restaurant/admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    const restaurant = await Restaurant.findById(order.restaurant);
    const isRestaurant = restaurant && restaurant.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isRestaurant && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    // Validate status transition
    const statusFlow = {
      'placed': ['confirmed', 'cancelled'],
      'confirmed': ['preparing', 'cancelled'],
      'preparing': ['ready', 'cancelled'],
      'ready': ['out_for_delivery'],
      'out_for_delivery': ['delivered'],
      'delivered': [],
      'cancelled': []
    };

    if (!statusFlow[order.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from '${order.status}' to '${status}'`
      });
    }

    // Update status and timestamps
    const updateData = { status };
    
    if (status === 'confirmed') updateData.confirmedAt = new Date();
    if (status === 'ready') updateData.preparedAt = new Date();
    if (status === 'delivered') {
      updateData.deliveredAt = new Date();
      updateData.paymentStatus = 'paid'; // COD collected
    }
    if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
      updateData.cancelReason = req.body.reason || 'Cancelled by restaurant';
    }

    order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('customer', 'name phone');

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (customer)
// @route   PUT /api/orders/:id/cancel
// @access  Private (customer)
exports.cancelOrder = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check ownership
    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Can only cancel if order is placed or confirmed
    if (!['placed', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelReason: req.body.reason || 'Cancelled by customer'
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};
