require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@localbites.com',
    phone: '9999999999',
    password: 'admin123',
    role: 'admin',
    address: {
      street: 'Main Street',
      area: 'Central',
      city: 'Your Town',
      pincode: '123456'
    }
  },
  {
    name: 'Sharma Restaurant',
    email: 'sharma@restaurant.com',
    phone: '9876543210',
    password: 'restaurant123',
    role: 'restaurant',
    address: {
      street: 'Market Road',
      area: 'Old Town',
      city: 'Your Town',
      pincode: '123456'
    }
  },
  {
    name: 'Pizza Palace Owner',
    email: 'pizza@restaurant.com',
    phone: '9876543211',
    password: 'restaurant123',
    role: 'restaurant',
    address: {
      street: 'MG Road',
      area: 'New Market',
      city: 'Your Town',
      pincode: '123456'
    }
  },
  {
    name: 'Test Customer',
    email: 'customer@test.com',
    phone: '9876543212',
    password: 'customer123',
    role: 'customer',
    address: {
      street: 'Gandhi Nagar',
      area: 'Sector 5',
      city: 'Your Town',
      pincode: '123456'
    }
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🔗 Connected to database');

    // Clear existing data
    await User.deleteMany();
    await Restaurant.deleteMany();
    await FoodItem.deleteMany();
    console.log('🗑️ Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Get restaurant owners
    const sharmaOwner = createdUsers.find(u => u.email === 'sharma@restaurant.com');
    const pizzaOwner = createdUsers.find(u => u.email === 'pizza@restaurant.com');

    // Create restaurants
    const restaurants = [
      {
        owner: sharmaOwner._id,
        name: 'Sharma Dhaba',
        description: 'Authentic North Indian food with homemade taste. Family recipes passed down for generations.',
        cuisine: ['North Indian', 'Thali', 'Biryani'],
        address: {
          street: 'Market Road',
          area: 'Old Town',
          city: 'Your Town',
          pincode: '123456',
          landmark: 'Near Bus Stand'
        },
        phone: '9876543210',
        isApproved: true,
        isOpen: true,
        rating: 4.5,
        totalRatings: 120,
        deliveryTime: '30-40 mins',
        minOrder: 150,
        deliveryCharge: 20,
        isVegOnly: false,
        commissionPercentage: 10
      },
      {
        owner: pizzaOwner._id,
        name: 'Pizza Palace',
        description: 'Best pizzas in town! Fresh ingredients, crispy crust, loaded toppings.',
        cuisine: ['Pizza', 'Fast Food', 'Beverages'],
        address: {
          street: 'MG Road',
          area: 'New Market',
          city: 'Your Town',
          pincode: '123456',
          landmark: 'Opposite City Mall'
        },
        phone: '9876543211',
        isApproved: true,
        isOpen: true,
        rating: 4.2,
        totalRatings: 85,
        deliveryTime: '25-35 mins',
        minOrder: 199,
        deliveryCharge: 30,
        isVegOnly: false,
        commissionPercentage: 12
      }
    ];

    const createdRestaurants = await Restaurant.create(restaurants);
    console.log(`🏪 Created ${createdRestaurants.length} restaurants`);

    // Create food items for Sharma Dhaba
    const sharmaDhaba = createdRestaurants.find(r => r.name === 'Sharma Dhaba');
    const pizzaPalace = createdRestaurants.find(r => r.name === 'Pizza Palace');

    const sharmaMenu = [
      // Starters
      { restaurant: sharmaDhaba._id, name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 180, category: 'Starters', isVeg: true, isBestseller: true },
      { restaurant: sharmaDhaba._id, name: 'Chicken Tikka', description: 'Tender chicken pieces grilled to perfection', price: 220, category: 'Starters', isVeg: false, isBestseller: true },
      { restaurant: sharmaDhaba._id, name: 'Veg Pakora', description: 'Crispy mixed vegetable fritters', price: 80, category: 'Starters', isVeg: true },
      
      // Main Course
      { restaurant: sharmaDhaba._id, name: 'Dal Makhani', description: 'Creamy black lentils cooked overnight', price: 160, category: 'Main Course', isVeg: true, isBestseller: true },
      { restaurant: sharmaDhaba._id, name: 'Paneer Butter Masala', description: 'Cottage cheese in rich tomato gravy', price: 200, category: 'Main Course', isVeg: true },
      { restaurant: sharmaDhaba._id, name: 'Butter Chicken', description: 'Tender chicken in creamy tomato sauce', price: 260, category: 'Main Course', isVeg: false, isBestseller: true },
      { restaurant: sharmaDhaba._id, name: 'Kadai Chicken', description: 'Chicken cooked with bell peppers and spices', price: 240, category: 'Main Course', isVeg: false },
      { restaurant: sharmaDhaba._id, name: 'Mix Veg', description: 'Seasonal vegetables in Indian spices', price: 140, category: 'Main Course', isVeg: true },
      
      // Breads
      { restaurant: sharmaDhaba._id, name: 'Butter Naan', description: 'Soft leavened bread with butter', price: 40, category: 'Breads', isVeg: true },
      { restaurant: sharmaDhaba._id, name: 'Garlic Naan', description: 'Naan topped with garlic', price: 50, category: 'Breads', isVeg: true },
      { restaurant: sharmaDhaba._id, name: 'Tandoori Roti', description: 'Whole wheat bread from clay oven', price: 25, category: 'Breads', isVeg: true },
      { restaurant: sharmaDhaba._id, name: 'Laccha Paratha', description: 'Layered flaky flatbread', price: 45, category: 'Breads', isVeg: true },
      
      // Rice
      { restaurant: sharmaDhaba._id, name: 'Jeera Rice', description: 'Cumin flavored basmati rice', price: 120, category: 'Rice', isVeg: true },
      { restaurant: sharmaDhaba._id, name: 'Veg Biryani', description: 'Aromatic rice with vegetables', price: 180, category: 'Biryani', isVeg: true },
      { restaurant: sharmaDhaba._id, name: 'Chicken Biryani', description: 'Fragrant rice with tender chicken', price: 220, category: 'Biryani', isVeg: false, isBestseller: true },
      
      // Thali
      { restaurant: sharmaDhaba._id, name: 'Veg Thali', description: '2 Sabzi, Dal, Rice, Roti, Salad, Sweet', price: 180, category: 'Thali', isVeg: true, isBestseller: true },
      { restaurant: sharmaDhaba._id, name: 'Non-Veg Thali', description: 'Chicken Curry, Dal, Rice, Roti, Salad', price: 250, category: 'Thali', isVeg: false },
      
      // Beverages
      { restaurant: sharmaDhaba._id, name: 'Lassi', description: 'Sweet yogurt drink', price: 50, category: 'Beverages', isVeg: true },
      { restaurant: sharmaDhaba._id, name: 'Masala Chaas', description: 'Spiced buttermilk', price: 40, category: 'Beverages', isVeg: true }
    ];

    const pizzaMenu = [
      // Pizza
      { restaurant: pizzaPalace._id, name: 'Margherita Pizza', description: 'Classic cheese and tomato', price: 199, category: 'Pizza', isVeg: true },
      { restaurant: pizzaPalace._id, name: 'Farmhouse Pizza', description: 'Loaded with fresh vegetables', price: 299, category: 'Pizza', isVeg: true, isBestseller: true },
      { restaurant: pizzaPalace._id, name: 'Pepperoni Pizza', description: 'Classic pepperoni with extra cheese', price: 349, category: 'Pizza', isVeg: false, isBestseller: true },
      { restaurant: pizzaPalace._id, name: 'Chicken Supreme', description: 'Loaded chicken with veggies', price: 399, category: 'Pizza', isVeg: false },
      { restaurant: pizzaPalace._id, name: 'Paneer Tikka Pizza', description: 'Indian twist with paneer', price: 329, category: 'Pizza', isVeg: true },
      
      // Burger
      { restaurant: pizzaPalace._id, name: 'Veg Burger', description: 'Crispy patty with fresh veggies', price: 99, category: 'Burger', isVeg: true },
      { restaurant: pizzaPalace._id, name: 'Chicken Burger', description: 'Juicy chicken patty burger', price: 149, category: 'Burger', isVeg: false, isBestseller: true },
      { restaurant: pizzaPalace._id, name: 'Double Cheese Burger', description: 'Extra cheese, extra flavor', price: 179, category: 'Burger', isVeg: true },
      
      // Snacks
      { restaurant: pizzaPalace._id, name: 'French Fries', description: 'Crispy golden fries', price: 99, category: 'Snacks', isVeg: true },
      { restaurant: pizzaPalace._id, name: 'Garlic Bread', description: 'Cheesy garlic bread sticks', price: 129, category: 'Snacks', isVeg: true },
      { restaurant: pizzaPalace._id, name: 'Chicken Wings', description: '6 pcs spicy chicken wings', price: 199, category: 'Snacks', isVeg: false },
      
      // Beverages
      { restaurant: pizzaPalace._id, name: 'Coca Cola', description: '300ml', price: 40, category: 'Beverages', isVeg: true },
      { restaurant: pizzaPalace._id, name: 'Cold Coffee', description: 'Chilled coffee shake', price: 99, category: 'Beverages', isVeg: true },
      { restaurant: pizzaPalace._id, name: 'Mojito', description: 'Fresh lime mint cooler', price: 79, category: 'Beverages', isVeg: true }
    ];

    await FoodItem.create([...sharmaMenu, ...pizzaMenu]);
    console.log(`🍔 Created ${sharmaMenu.length + pizzaMenu.length} food items`);

    console.log(`
    ✅ Database seeded successfully!
    
    📧 Login Credentials:
    ─────────────────────
    Admin:
      Email: admin@localbites.com
      Password: admin123
    
    Restaurant 1:
      Email: sharma@restaurant.com
      Password: restaurant123
    
    Restaurant 2:
      Email: pizza@restaurant.com
      Password: restaurant123
    
    Customer:
      Email: customer@test.com
      Password: customer123
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
