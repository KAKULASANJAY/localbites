const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalRestaurants = await Restaurant.countDocuments();
    const approvedRestaurants = await Restaurant.countDocuments({ isApproved: true });
    const pendingRestaurants = await Restaurant.countDocuments({ isApproved: false });
    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

    // Calculate revenue
    const revenueData = await Order.aggregate([
      { $match: { status: 'delivered' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalCommission: { $sum: '$commission.amount' }
        }
      }
    ]);

    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });

    const todayRevenue = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          deliveredAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          commission: { $sum: '$commission.amount' }
        }
      }
    ]);

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'name phone')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Top restaurants
    const topRestaurants = await Order.aggregate([
      { $match: { status: 'delivered' } },
      {
        $group: {
          _id: '$restaurant',
          orderCount: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { orderCount: -1 } },
      { $limit: 5 }
    ]);

    // Populate top restaurants
    await Restaurant.populate(topRestaurants, { path: '_id', select: 'name' });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers
        },
        restaurants: {
          total: totalRestaurants,
          approved: approvedRestaurants,
          pending: pendingRestaurants
        },
        orders: {
          total: totalOrders,
          delivered: deliveredOrders,
          today: todayOrders,
          byStatus: ordersByStatus
        },
        revenue: {
          total: revenueData[0]?.totalRevenue || 0,
          commission: revenueData[0]?.totalCommission || 0,
          today: todayRevenue[0]?.total || 0,
          todayCommission: todayRevenue[0]?.commission || 0
        },
        recentOrders,
        topRestaurants
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all restaurants (including unapproved)
// @route   GET /api/admin/restaurants
// @access  Private (admin)
exports.getAllRestaurants = async (req, res, next) => {
  try {
    const { approved, page = 1, limit = 20 } = req.query;

    let query = {};
    if (approved === 'true') query.isApproved = true;
    if (approved === 'false') query.isApproved = false;

    const restaurants = await Restaurant.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Restaurant.countDocuments(query);

    res.status(200).json({
      success: true,
      count: restaurants.length,
      total,
      pages: Math.ceil(total / limit),
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Reject restaurant
// @route   PUT /api/admin/restaurants/:id/approve
// @access  Private (admin)
exports.approveRestaurant = async (req, res, next) => {
  try {
    const { approved, commissionPercentage } = req.body;

    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    const updateData = { isApproved: approved };
    if (commissionPercentage !== undefined) {
      updateData.commissionPercentage = commissionPercentage;
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('owner', 'name email phone');

    res.status(200).json({
      success: true,
      message: approved ? 'Restaurant approved' : 'Restaurant rejected',
      data: updatedRestaurant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update restaurant commission
// @route   PUT /api/admin/restaurants/:id/commission
// @access  Private (admin)
exports.updateCommission = async (req, res, next) => {
  try {
    const { commissionPercentage } = req.body;

    if (commissionPercentage < 0 || commissionPercentage > 30) {
      return res.status(400).json({
        success: false,
        message: 'Commission must be between 0 and 30 percent'
      });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { commissionPercentage },
      { new: true }
    );

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

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;

    let query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-active
// @access  Private (admin)
exports.toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate admin users'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: !user.isActive },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private (admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, restaurantId, startDate, endDate, page = 1, limit = 20 } = req.query;

    let query = {};

    if (status) query.status = status;
    if (restaurantId) query.restaurant = restaurantId;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('customer', 'name phone')
      .populate('restaurant', 'name')
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
