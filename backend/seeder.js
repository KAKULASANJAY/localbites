const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Models
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const FoodItem = require('./models/FoodItem');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

// Sample data for Annavaram restaurants
const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Restaurant.deleteMany();
    await FoodItem.deleteMany();
    console.log('Data cleared...');

    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@localbites.com',
      phone: '9999999999',
      password: adminPassword,
      role: 'admin',
      isActive: true
    });
    console.log('✅ Admin created: admin@localbites.com / admin123');

    // Create Restaurant Owners
    const ownerPassword = await bcrypt.hash('owner123', 10);
    
    const owners = await User.insertMany([
      { name: 'Maa Bhavani Owner', email: 'maabhavani@localbites.com', phone: '9876543201', password: ownerPassword, role: 'restaurant', isActive: true },
      { name: 'One Food Courts Owner', email: 'onefoodcourts@localbites.com', phone: '9876543202', password: ownerPassword, role: 'restaurant', isActive: true },
      { name: '7 Family Owner', email: '7family@localbites.com', phone: '9876543203', password: ownerPassword, role: 'restaurant', isActive: true },
      { name: 'Venkateswara Owner', email: 'venkateswara@localbites.com', phone: '9876543204', password: ownerPassword, role: 'restaurant', isActive: true },
      { name: 'Dattudu Owner', email: 'dattudu@localbites.com', phone: '9876543205', password: ownerPassword, role: 'restaurant', isActive: true },
      { name: 'Vyra Owner', email: 'vyra@localbites.com', phone: '9876543206', password: ownerPassword, role: 'restaurant', isActive: true },
      { name: 'Durga Dhaba Owner', email: 'durgadhaba@localbites.com', phone: '9876543207', password: ownerPassword, role: 'restaurant', isActive: true },
      { name: 'Amalodbhavi Owner', email: 'amalodbhavi@localbites.com', phone: '9876543208', password: ownerPassword, role: 'restaurant', isActive: true },
      { name: 'C&C Owner', email: 'candc@localbites.com', phone: '9876543209', password: ownerPassword, role: 'restaurant', isActive: true },
      { name: 'U1 Family Owner', email: 'u1family@localbites.com', phone: '9876543210', password: ownerPassword, role: 'restaurant', isActive: true },
      { name: 'Kokila Sri Owner', email: 'kokilasri@localbites.com', phone: '9876543211', password: ownerPassword, role: 'restaurant', isActive: true },
      { name: 'Chandamama Owner', email: 'chandamama@localbites.com', phone: '9876543212', password: ownerPassword, role: 'restaurant', isActive: true },
      { name: 'Swagath Grand Owner', email: 'swagathgrand@localbites.com', phone: '9876543213', password: ownerPassword, role: 'restaurant', isActive: true },
      { name: 'Sri Sai Ganesh Owner', email: 'srisaiganesh@localbites.com', phone: '9876543214', password: ownerPassword, role: 'restaurant', isActive: true }
    ]);

    console.log('✅ Restaurant owners created');

    // Create Customer
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customer = await User.create({
      name: 'Sanjay Kumar',
      email: 'sanjay@gmail.com',
      phone: '9876543200',
      password: customerPassword,
      role: 'customer',
      address: {
        street: 'Temple Road',
        area: 'Annavaram',
        city: 'Kakinada',
        pincode: '533406'
      },
      isActive: true
    });
    console.log('✅ Customer created: sanjay@gmail.com / customer123');

    // Create Restaurants
    const restaurants = await Restaurant.insertMany([
      {
        owner: owners[0]._id,
        name: 'MAA BHAVANI RESTAURANT',
        description: 'Authentic Andhra cuisine with homestyle cooking. Famous for traditional meals and quick service near the temple.',
        cuisine: ['South Indian', 'Thali', 'Biryani'],
        phone: '9876543201',
        address: { street: 'Temple Road', area: 'Annavaram', city: 'Kakinada', pincode: '533406', landmark: 'Near Satyanarayana Swamy Temple' },
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        isApproved: true, isOpen: true, rating: 4.9, totalRatings: 67, deliveryTime: 25, minimumOrder: 100, deliveryFee: 20
      },
      {
        owner: owners[1]._id,
        name: 'One Food Courts Annavaram',
        description: 'Best restaurant in Annavaram! Scenic, upbeat stop for local snacks and Andhra specials. Famous for Butter Garlic Chicken.',
        cuisine: ['South Indian', 'Chinese', 'Biryani', 'Fast Food'],
        phone: '9876543202',
        address: { street: 'NH 16', area: 'Near RTA Check Post', city: 'Annavaram', pincode: '533406', landmark: '7CW8+6W8' },
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
        isApproved: true, isOpen: true, rating: 4.0, totalRatings: 13000, deliveryTime: 30, minimumOrder: 200, deliveryFee: 30
      },
      {
        owner: owners[2]._id,
        name: '7 Family Restaurant',
        description: 'Family-friendly restaurant with comfortable dining. Offers dine-in, drive-through, and no-contact delivery.',
        cuisine: ['South Indian', 'North Indian', 'Chinese', 'Biryani'],
        phone: '9876543203',
        address: { street: 'NH-16', area: 'Back side Gowri Kalyana Mandapam', city: 'Annavaram', pincode: '533406', landmark: 'Opposite Govt Degree College' },
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
        isApproved: true, isOpen: true, rating: 5.0, totalRatings: 29, deliveryTime: 25, minimumOrder: 200, deliveryFee: 25
      },
      {
        owner: owners[3]._id,
        name: 'Venkateswara Restaurant & Dhaba',
        description: 'Budget-friendly dhaba serving delicious home-style Andhra food. Perfect for a quick and tasty meal.',
        cuisine: ['South Indian', 'Thali', 'Street Food'],
        phone: '9876543204',
        address: { street: 'Main Road', area: 'Bendapudi', city: 'Annavaram', pincode: '533406' },
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
        isApproved: true, isOpen: true, rating: 4.8, totalRatings: 53, deliveryTime: 20, minimumOrder: 50, deliveryFee: 15
      },
      {
        owner: owners[4]._id,
        name: 'Dattudu Family Dhaba',
        description: 'Popular dhaba known for authentic Andhra flavors. Great for families and groups.',
        cuisine: ['South Indian', 'Biryani', 'Thali', 'Street Food'],
        phone: '9876543205',
        address: { street: 'Highway Road', area: 'Tetagunta', city: 'Annavaram', pincode: '533406' },
        image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800',
        isApproved: true, isOpen: true, rating: 4.1, totalRatings: 3200, deliveryTime: 35, minimumOrder: 200, deliveryFee: 30
      },
      {
        owner: owners[5]._id,
        name: 'Vyra Family Restaurant',
        description: 'Well-known family restaurant on NH-5. Offers dine-in, takeaway, and no-contact delivery.',
        cuisine: ['South Indian', 'North Indian', 'Chinese', 'Biryani'],
        phone: '9876543206',
        address: { street: 'NH-5, Rajahmundry Annavaram Road', area: 'Tetagunta', city: 'East Godavari', pincode: '533406' },
        image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800',
        isApproved: true, isOpen: true, rating: 3.9, totalRatings: 4700, deliveryTime: 35, minimumOrder: 200, deliveryFee: 35
      },
      {
        owner: owners[6]._id,
        name: 'Durga Dhaba & Restaurant',
        description: 'Family-friendly dhaba with delicious home-cooked meals. Known for warm hospitality.',
        cuisine: ['South Indian', 'Thali', 'Biryani'],
        phone: '9876543207',
        address: { street: '79CV+R3V', area: 'Annavaram', city: 'Kakinada', pincode: '533406' },
        image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800',
        isApproved: true, isOpen: true, rating: 4.5, totalRatings: 76, deliveryTime: 30, minimumOrder: 150, deliveryFee: 25
      },
      {
        owner: owners[7]._id,
        name: 'HOTEL AMALODBHAVI',
        description: 'Popular restaurant on AH45 highway. Great for travelers and locals alike. Full menu with AC and Non-AC seating.',
        cuisine: ['South Indian', 'North Indian', 'Chinese', 'Biryani', 'Thali'],
        phone: '9876543208',
        address: { street: 'AH45', area: 'Annavaram', city: 'Kakinada', pincode: '533406' },
        image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800',
        isApproved: true, isOpen: true, rating: 4.3, totalRatings: 3500, deliveryTime: 30, minimumOrder: 200, deliveryFee: 30
      },
      {
        owner: owners[8]._id,
        name: 'C&C FAMILY RESTAURANT',
        description: 'Cozy family restaurant with affordable prices. Perfect for quick bites and family meals.',
        cuisine: ['South Indian', 'Chinese', 'Fast Food'],
        phone: '9876543209',
        address: { street: 'Main Road', area: 'Opposite Satya Deva Guardian', city: 'Annavaram', pincode: '533406' },
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800',
        isApproved: true, isOpen: true, rating: 3.8, totalRatings: 28, deliveryTime: 25, minimumOrder: 100, deliveryFee: 20
      },
      {
        owner: owners[9]._id,
        name: 'U1 Family Dhaba and Restaurant',
        description: 'Family-friendly dhaba with tasty food and quick service. Great for takeaway.',
        cuisine: ['South Indian', 'Thali', 'Biryani'],
        phone: '9876543210',
        address: { street: '79FV+6M4', area: 'Annavaram', city: 'Kakinada', pincode: '533406' },
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
        isApproved: true, isOpen: true, rating: 4.1, totalRatings: 14, deliveryTime: 25, minimumOrder: 100, deliveryFee: 20
      },
      {
        owner: owners[10]._id,
        name: 'Kokila Sri Dhaba & Restaurant',
        description: 'Traditional dhaba serving authentic Andhra meals. Known for generous portions and great taste.',
        cuisine: ['South Indian', 'Thali', 'Biryani', 'Street Food'],
        phone: '9876543211',
        address: { street: 'Main Road', area: 'Bendapudi', city: 'Annavaram', pincode: '533406' },
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
        isApproved: true, isOpen: true, rating: 4.3, totalRatings: 79, deliveryTime: 30, minimumOrder: 200, deliveryFee: 25
      },
      {
        owner: owners[11]._id,
        name: 'Chandamama Garden Restaurant & Dhaba',
        description: 'Beautiful garden restaurant with outdoor seating. Perfect for a relaxing meal with family.',
        cuisine: ['South Indian', 'North Indian', 'Chinese', 'Biryani'],
        phone: '9876543212',
        address: { street: 'Y Junction', area: 'Annavaram to Tuni Road', city: 'Annavaram', pincode: '533406' },
        image: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800',
        isApproved: true, isOpen: true, rating: 4.6, totalRatings: 9, deliveryTime: 35, minimumOrder: 150, deliveryFee: 30
      },
      {
        owner: owners[12]._id,
        name: 'Swagath Grand',
        description: 'Hotel and restaurant with good service and reasonable prices. Multi-cuisine menu available.',
        cuisine: ['South Indian', 'North Indian', 'Chinese', 'Continental'],
        phone: '9876543213',
        address: { street: '7CM4+H6F', area: 'Annavaram', city: 'Kakinada', pincode: '533406' },
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        isApproved: true, isOpen: true, rating: 3.4, totalRatings: 598, deliveryTime: 40, minimumOrder: 250, deliveryFee: 35
      },
      {
        owner: owners[13]._id,
        name: 'Sri Sai Ganesh Amalapuram Vari Bojunam',
        description: 'Authentic Amalapuram style meals. Health-focused food with AC and Non-AC dining. Famous for traditional Andhra Bojunam.',
        cuisine: ['South Indian', 'Thali'],
        phone: '9876543214',
        address: { street: 'Tetagunta Road', area: 'Tetagunta', city: 'Annavaram', pincode: '533406' },
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
        isApproved: true, isOpen: true, rating: 4.6, totalRatings: 90, deliveryTime: 25, minimumOrder: 100, deliveryFee: 20
      }
    ]);

    console.log('✅ Restaurants created');

    // Create Food Items for each restaurant
    const foodItems = [];

    // MAA BHAVANI RESTAURANT - Traditional Andhra
    const maaBhavaniItems = [
      { name: 'Andhra Meals (Unlimited)', price: 120, category: 'Thali', isVeg: true, description: 'Traditional unlimited Andhra thali with rice, sambar, rasam, curries, pickle, papad', isBestseller: true },
      { name: 'Chicken Biryani', price: 180, category: 'Biryani', isVeg: false, description: 'Aromatic basmati rice cooked with tender chicken pieces and spices', isBestseller: true },
      { name: 'Mutton Biryani', price: 220, category: 'Biryani', isVeg: false, description: 'Flavorful biryani with succulent mutton pieces' },
      { name: 'Egg Biryani', price: 130, category: 'Biryani', isVeg: false, description: 'Spiced rice with boiled eggs' },
      { name: 'Veg Biryani', price: 120, category: 'Biryani', isVeg: true, description: 'Fragrant rice with mixed vegetables' },
      { name: 'Idli (4 pcs)', price: 40, category: 'Starters', isVeg: true, description: 'Soft steamed rice cakes with sambar and chutney' },
      { name: 'Masala Dosa', price: 60, category: 'Starters', isVeg: true, description: 'Crispy dosa with spiced potato filling', isBestseller: true },
      { name: 'Pesarattu', price: 50, category: 'Starters', isVeg: true, description: 'Green gram dosa - Andhra specialty' },
      { name: 'Chicken 65', price: 160, category: 'Starters', isVeg: false, description: 'Spicy deep-fried chicken - Andhra style', isBestseller: true },
      { name: 'Gongura Chicken', price: 200, category: 'Main Course', isVeg: false, description: 'Chicken cooked with tangy gongura leaves' },
      { name: 'Chapati (2 pcs)', price: 30, category: 'Breads', isVeg: true, description: 'Soft wheat bread' },
      { name: 'Butter Milk', price: 25, category: 'Beverages', isVeg: true, description: 'Refreshing spiced buttermilk' }
    ];
    maaBhavaniItems.forEach(item => foodItems.push({ ...item, restaurant: restaurants[0]._id }));

    // One Food Courts - Multi-cuisine
    const oneFoodCourtsItems = [
      { name: 'Butter Garlic Chicken', price: 280, category: 'Main Course', isVeg: false, description: 'Signature dish - Juicy chicken in butter garlic sauce', isBestseller: true },
      { name: 'Chicken Fried Rice', price: 150, category: 'Rice', isVeg: false, description: 'Wok-tossed rice with chicken and vegetables' },
      { name: 'Veg Fried Rice', price: 120, category: 'Rice', isVeg: true, description: 'Stir-fried rice with fresh vegetables' },
      { name: 'Chicken Manchurian', price: 180, category: 'Chinese', isVeg: false, description: 'Crispy chicken in tangy manchurian sauce', isBestseller: true },
      { name: 'Gobi Manchurian', price: 140, category: 'Chinese', isVeg: true, description: 'Crispy cauliflower in spicy sauce' },
      { name: 'Hyderabadi Biryani', price: 200, category: 'Biryani', isVeg: false, description: 'Authentic dum biryani with tender meat' },
      { name: 'Paneer Butter Masala', price: 180, category: 'Main Course', isVeg: true, description: 'Cottage cheese in rich tomato gravy' },
      { name: 'Chilli Chicken', price: 170, category: 'Chinese', isVeg: false, description: 'Spicy Indo-Chinese chicken preparation' },
      { name: 'Veg Noodles', price: 110, category: 'Chinese', isVeg: true, description: 'Stir-fried noodles with vegetables' },
      { name: 'Chicken Noodles', price: 140, category: 'Chinese', isVeg: false, description: 'Hakka noodles with chicken' },
      { name: 'Fish Fry', price: 180, category: 'Starters', isVeg: false, description: 'Crispy fried fish with Andhra spices' },
      { name: 'Prawn Biryani', price: 280, category: 'Biryani', isVeg: false, description: 'Coastal specialty biryani with prawns', isBestseller: true },
      { name: 'Cold Coffee', price: 60, category: 'Beverages', isVeg: true, description: 'Chilled coffee with ice cream' },
      { name: 'Fresh Lime Soda', price: 40, category: 'Beverages', isVeg: true, description: 'Refreshing lime soda' }
    ];
    oneFoodCourtsItems.forEach(item => foodItems.push({ ...item, restaurant: restaurants[1]._id }));

    // 7 Family Restaurant
    const sevenFamilyItems = [
      { name: 'Family Thali Special', price: 150, category: 'Thali', isVeg: true, description: 'Deluxe thali with 8 items including sweet', isBestseller: true },
      { name: 'Non-Veg Thali', price: 200, category: 'Thali', isVeg: false, description: 'Complete meal with chicken curry and rice' },
      { name: 'Butter Chicken', price: 220, category: 'Main Course', isVeg: false, description: 'Creamy tomato-based chicken curry', isBestseller: true },
      { name: 'Dal Tadka', price: 120, category: 'Main Course', isVeg: true, description: 'Yellow lentils tempered with spices' },
      { name: 'Jeera Rice', price: 80, category: 'Rice', isVeg: true, description: 'Cumin flavored basmati rice' },
      { name: 'Naan', price: 35, category: 'Breads', isVeg: true, description: 'Soft leavened bread from tandoor' },
      { name: 'Garlic Naan', price: 45, category: 'Breads', isVeg: true, description: 'Naan topped with garlic' },
      { name: 'Chicken Lollipop', price: 180, category: 'Starters', isVeg: false, description: 'Crispy chicken drumettes' },
      { name: 'Mushroom Manchurian', price: 150, category: 'Chinese', isVeg: true, description: 'Mushrooms in spicy manchurian gravy' },
      { name: 'Special Biryani', price: 190, category: 'Biryani', isVeg: false, description: 'House special layered biryani' },
      { name: 'Gulab Jamun (2 pcs)', price: 50, category: 'Desserts', isVeg: true, description: 'Sweet milk dumplings in sugar syrup' }
    ];
    sevenFamilyItems.forEach(item => foodItems.push({ ...item, restaurant: restaurants[2]._id }));

    // Venkateswara Restaurant - Budget friendly
    const venkateswaraItems = [
      { name: 'Mini Meals', price: 60, category: 'Thali', isVeg: true, description: 'Budget-friendly small portion meals', isBestseller: true },
      { name: 'Full Meals', price: 80, category: 'Thali', isVeg: true, description: 'Complete Andhra meals' },
      { name: 'Curd Rice', price: 40, category: 'Rice', isVeg: true, description: 'Cooling yogurt rice' },
      { name: 'Lemon Rice', price: 50, category: 'Rice', isVeg: true, description: 'Tangy lemon flavored rice' },
      { name: 'Tamarind Rice', price: 50, category: 'Rice', isVeg: true, description: 'Pulihora - Temple style', isBestseller: true },
      { name: 'Sambar Rice', price: 50, category: 'Rice', isVeg: true, description: 'Rice mixed with sambar' },
      { name: 'Upma', price: 35, category: 'Starters', isVeg: true, description: 'Semolina preparation' },
      { name: 'Pongal', price: 45, category: 'Starters', isVeg: true, description: 'Rice and lentil dish' },
      { name: 'Filter Coffee', price: 20, category: 'Beverages', isVeg: true, description: 'South Indian filter coffee' },
      { name: 'Tea', price: 15, category: 'Beverages', isVeg: true, description: 'Hot masala chai' }
    ];
    venkateswaraItems.forEach(item => foodItems.push({ ...item, restaurant: restaurants[3]._id }));

    // Dattudu Family Dhaba
    const dattuduItems = [
      { name: 'Raju Gari Kodi Pulao', price: 180, category: 'Biryani', isVeg: false, description: 'Authentic Andhra chicken pulao', isBestseller: true },
      { name: 'Natukodi Pulusu', price: 250, category: 'Main Course', isVeg: false, description: 'Country chicken curry - Spicy and flavorful', isBestseller: true },
      { name: 'Royyala Iguru', price: 280, category: 'Main Course', isVeg: false, description: 'Prawns cooked in spicy gravy' },
      { name: 'Chepala Pulusu', price: 220, category: 'Main Course', isVeg: false, description: 'Andhra fish curry' },
      { name: 'Goat Fry', price: 260, category: 'Starters', isVeg: false, description: 'Dry mutton fry with spices' },
      { name: 'Ulavacharu Chicken', price: 240, category: 'Main Course', isVeg: false, description: 'Chicken in horse gram gravy' },
      { name: 'Dhaba Special Thali', price: 180, category: 'Thali', isVeg: false, description: 'Full non-veg thali with rice and curries' },
      { name: 'Pappu Charu', price: 80, category: 'Main Course', isVeg: true, description: 'Lentil rasam' },
      { name: 'Gongura Pachadi', price: 60, category: 'Sides', isVeg: true, description: 'Tangy sorrel leaves chutney' },
      { name: 'Mudda Pappu', price: 70, category: 'Main Course', isVeg: true, description: 'Plain dal with ghee' }
    ];
    dattuduItems.forEach(item => foodItems.push({ ...item, restaurant: restaurants[4]._id }));

    // Vyra Family Restaurant
    const vyraItems = [
      { name: 'Highway Special Biryani', price: 200, category: 'Biryani', isVeg: false, description: 'Famous highway-style biryani', isBestseller: true },
      { name: 'Tandoori Chicken', price: 280, category: 'Starters', isVeg: false, description: 'Clay oven roasted chicken' },
      { name: 'Paneer Tikka', price: 200, category: 'Starters', isVeg: true, description: 'Grilled cottage cheese cubes' },
      { name: 'Dal Makhani', price: 160, category: 'Main Course', isVeg: true, description: 'Creamy black lentils' },
      { name: 'Kadai Chicken', price: 240, category: 'Main Course', isVeg: false, description: 'Chicken cooked in kadai with peppers' },
      { name: 'Mixed Veg Curry', price: 140, category: 'Main Course', isVeg: true, description: 'Seasonal vegetables in gravy' },
      { name: 'Rumali Roti', price: 30, category: 'Breads', isVeg: true, description: 'Paper-thin soft bread' },
      { name: 'Chicken Biryani Family Pack', price: 450, category: 'Biryani', isVeg: false, description: 'Serves 3-4 people' },
      { name: 'Veg Manchurian Dry', price: 140, category: 'Chinese', isVeg: true, description: 'Crispy vegetable balls in dry preparation' },
      { name: 'Egg Curry', price: 120, category: 'Main Course', isVeg: false, description: 'Boiled eggs in spicy gravy' }
    ];
    vyraItems.forEach(item => foodItems.push({ ...item, restaurant: restaurants[5]._id }));

    // Durga Dhaba
    const durgaDhabaItems = [
      { name: 'Durga Special Meals', price: 130, category: 'Thali', isVeg: true, description: 'Signature unlimited thali', isBestseller: true },
      { name: 'Chicken Curry', price: 180, category: 'Main Course', isVeg: false, description: 'Homestyle chicken curry' },
      { name: 'Egg Biryani Special', price: 140, category: 'Biryani', isVeg: false, description: 'Flavorful egg biryani' },
      { name: 'Fried Rice Chicken', price: 160, category: 'Rice', isVeg: false, description: 'Indo-Chinese fried rice' },
      { name: 'Ghee Rice', price: 80, category: 'Rice', isVeg: true, description: 'Fragrant rice with pure ghee' },
      { name: 'Parotta (2 pcs)', price: 40, category: 'Breads', isVeg: true, description: 'Layered Kerala parotta' },
      { name: 'Chicken Parotta', price: 150, category: 'Main Course', isVeg: false, description: 'Parotta with chicken curry combo' },
      { name: 'Lassi', price: 40, category: 'Beverages', isVeg: true, description: 'Sweet yogurt drink' }
    ];
    durgaDhabaItems.forEach(item => foodItems.push({ ...item, restaurant: restaurants[6]._id }));

    // Hotel Amalodbhavi
    const amalodbhaviItems = [
      { name: 'Amalodbhavi Special Thali', price: 180, category: 'Thali', isVeg: true, description: 'Grand vegetarian thali with 12 items', isBestseller: true },
      { name: 'Mutton Curry', price: 280, category: 'Main Course', isVeg: false, description: 'Slow-cooked mutton in spices' },
      { name: 'Prawns Fry', price: 300, category: 'Starters', isVeg: false, description: 'Crispy fried prawns', isBestseller: true },
      { name: 'Fish Pulusu', price: 250, category: 'Main Course', isVeg: false, description: 'Tangy fish curry - Coastal style' },
      { name: 'Veg Biryani Dum', price: 150, category: 'Biryani', isVeg: true, description: 'Slow-cooked vegetable biryani' },
      { name: 'Chicken Biryani Dum', price: 200, category: 'Biryani', isVeg: false, description: 'Traditional dum biryani' },
      { name: 'Spring Roll Veg', price: 120, category: 'Chinese', isVeg: true, description: 'Crispy rolls with vegetable filling' },
      { name: 'Schezwan Noodles', price: 140, category: 'Chinese', isVeg: true, description: 'Spicy schezwan style noodles' },
      { name: 'Sweet Pongal', price: 60, category: 'Desserts', isVeg: true, description: 'Traditional sweet rice dish' },
      { name: 'Payasam', price: 50, category: 'Desserts', isVeg: true, description: 'Rice kheer - South Indian style' }
    ];
    amalodbhaviItems.forEach(item => foodItems.push({ ...item, restaurant: restaurants[7]._id }));

    // C&C Family Restaurant
    const candcItems = [
      { name: 'Quick Meals', price: 70, category: 'Thali', isVeg: true, description: 'Fast service budget meals', isBestseller: true },
      { name: 'Chicken Fried Rice', price: 130, category: 'Rice', isVeg: false, description: 'Quick and tasty fried rice' },
      { name: 'Noodles Combo', price: 120, category: 'Chinese', isVeg: true, description: 'Noodles with manchurian' },
      { name: 'Burger Veg', price: 80, category: 'Burger', isVeg: true, description: 'Classic veggie burger' },
      { name: 'Burger Chicken', price: 110, category: 'Burger', isVeg: false, description: 'Juicy chicken burger' },
      { name: 'French Fries', price: 70, category: 'Snacks', isVeg: true, description: 'Crispy potato fries' },
      { name: 'Samosa (2 pcs)', price: 30, category: 'Snacks', isVeg: true, description: 'Crispy potato filled pastry' },
      { name: 'Soft Drinks', price: 30, category: 'Beverages', isVeg: true, description: 'Pepsi/Coca-Cola/Sprite' }
    ];
    candcItems.forEach(item => foodItems.push({ ...item, restaurant: restaurants[8]._id }));

    // U1 Family Dhaba
    const u1Items = [
      { name: 'U1 Special Thali', price: 100, category: 'Thali', isVeg: true, description: 'Value for money thali', isBestseller: true },
      { name: 'Egg Curry Rice', price: 90, category: 'Rice', isVeg: false, description: 'Rice with egg curry' },
      { name: 'Chicken Curry Rice', price: 130, category: 'Rice', isVeg: false, description: 'Rice with chicken curry' },
      { name: 'Veg Curry Rice', price: 70, category: 'Rice', isVeg: true, description: 'Rice with seasonal vegetable curry' },
      { name: 'Plain Dosa', price: 40, category: 'Starters', isVeg: true, description: 'Crispy rice crepe' },
      { name: 'Onion Dosa', price: 55, category: 'Starters', isVeg: true, description: 'Dosa topped with onions' },
      { name: 'Set Dosa', price: 50, category: 'Starters', isVeg: true, description: 'Soft spongy dosas (3 pcs)' }
    ];
    u1Items.forEach(item => foodItems.push({ ...item, restaurant: restaurants[9]._id }));

    // Kokila Sri Dhaba
    const kokilaSriItems = [
      { name: 'Kokila Meals', price: 120, category: 'Thali', isVeg: true, description: 'Generous portion Andhra meals', isBestseller: true },
      { name: 'Boneless Chicken', price: 200, category: 'Starters', isVeg: false, description: 'Crispy boneless chicken pieces' },
      { name: 'Chicken Biryani Special', price: 180, category: 'Biryani', isVeg: false, description: 'Extra spicy biryani', isBestseller: true },
      { name: 'Mutton Biryani', price: 250, category: 'Biryani', isVeg: false, description: 'Rich and flavorful mutton biryani' },
      { name: 'Pappu Annam', price: 60, category: 'Rice', isVeg: true, description: 'Rice mixed with dal and ghee' },
      { name: 'Chicken Fry', price: 180, category: 'Starters', isVeg: false, description: 'Dry fried chicken' },
      { name: 'Mirchi Bajji', price: 40, category: 'Snacks', isVeg: true, description: 'Stuffed chilli fritters' }
    ];
    kokilaSriItems.forEach(item => foodItems.push({ ...item, restaurant: restaurants[10]._id }));

    // Chandamama Garden Restaurant
    const chandamamaItems = [
      { name: 'Garden Special Thali', price: 200, category: 'Thali', isVeg: true, description: 'Premium thali in garden ambiance', isBestseller: true },
      { name: 'Grilled Chicken', price: 280, category: 'Main Course', isVeg: false, description: 'Perfectly grilled whole chicken' },
      { name: 'Fish Tikka', price: 260, category: 'Starters', isVeg: false, description: 'Marinated and grilled fish pieces' },
      { name: 'Paneer Do Pyaza', price: 180, category: 'Main Course', isVeg: true, description: 'Paneer with onion gravy' },
      { name: 'Veg Manchurian Gravy', price: 150, category: 'Chinese', isVeg: true, description: 'Vegetable balls in manchurian gravy' },
      { name: 'Chicken Lollipop', price: 200, category: 'Starters', isVeg: false, description: 'Spicy chicken drumettes' },
      { name: 'Family Biryani', price: 500, category: 'Biryani', isVeg: false, description: 'Large pot biryani for family' },
      { name: 'Mocktails', price: 80, category: 'Beverages', isVeg: true, description: 'Refreshing non-alcoholic drinks' }
    ];
    chandamamaItems.forEach(item => foodItems.push({ ...item, restaurant: restaurants[11]._id }));

    // Swagath Grand
    const swagathItems = [
      { name: 'Executive Thali', price: 250, category: 'Thali', isVeg: true, description: 'Premium multi-course thali', isBestseller: true },
      { name: 'Chicken Tikka Masala', price: 280, category: 'Main Course', isVeg: false, description: 'Creamy tikka masala curry' },
      { name: 'Continental Platter', price: 350, category: 'Main Course', isVeg: false, description: 'Grilled chicken with mashed potatoes and veggies' },
      { name: 'Pasta Alfredo', price: 220, category: 'Pasta', isVeg: true, description: 'Creamy white sauce pasta' },
      { name: 'Veg Fried Rice Combo', price: 180, category: 'Combo', isVeg: true, description: 'Fried rice with manchurian' },
      { name: 'Prawns Biryani', price: 320, category: 'Biryani', isVeg: false, description: 'Coastal prawns biryani' },
      { name: 'Brownie with Ice Cream', price: 120, category: 'Desserts', isVeg: true, description: 'Warm brownie topped with vanilla ice cream' },
      { name: 'Fresh Juice', price: 70, category: 'Beverages', isVeg: true, description: 'Seasonal fresh fruit juice' }
    ];
    swagathItems.forEach(item => foodItems.push({ ...item, restaurant: restaurants[12]._id }));

    // Sri Sai Ganesh - Traditional Bojunam
    const sriSaiGaneshItems = [
      { name: 'Amalapuram Bojunam', price: 100, category: 'Thali', isVeg: true, description: 'Authentic Amalapuram style unlimited meals', isBestseller: true },
      { name: 'Special Bojunam', price: 130, category: 'Thali', isVeg: true, description: 'Premium thali with extra items', isBestseller: true },
      { name: 'Rasam Rice', price: 50, category: 'Rice', isVeg: true, description: 'Tangy pepper rasam with rice' },
      { name: 'Sambar Rice', price: 50, category: 'Rice', isVeg: true, description: 'Lentil vegetable stew with rice' },
      { name: 'Curd Rice', price: 45, category: 'Rice', isVeg: true, description: 'Cooling yogurt rice' },
      { name: 'Avakaya Pickle', price: 30, category: 'Sides', isVeg: true, description: 'Spicy mango pickle' },
      { name: 'Gongura Pickle', price: 30, category: 'Sides', isVeg: true, description: 'Tangy sorrel leaves pickle' },
      { name: 'Pesarattu Special', price: 70, category: 'Starters', isVeg: true, description: 'Green gram dosa with upma' },
      { name: 'Idli Sambar', price: 50, category: 'Starters', isVeg: true, description: 'Soft idlis with hot sambar' },
      { name: 'Filter Coffee', price: 25, category: 'Beverages', isVeg: true, description: 'Traditional South Indian coffee' }
    ];
    sriSaiGaneshItems.forEach(item => foodItems.push({ ...item, restaurant: restaurants[13]._id }));

    await FoodItem.insertMany(foodItems);
    console.log('✅ Food items created');

    console.log(`
========================================
🎉 Database seeded successfully!
========================================

Login Credentials:
------------------
Admin:      admin@localbites.com / admin123
Customer:   sanjay@gmail.com / customer123

Restaurant Owners (all use password: owner123):
- maabhavani@localbites.com (MAA BHAVANI RESTAURANT)
- onefoodcourts@localbites.com (One Food Courts)
- 7family@localbites.com (7 Family Restaurant)
- venkateswara@localbites.com (Venkateswara Restaurant)
- dattudu@localbites.com (Dattudu Family Dhaba)
- vyra@localbites.com (Vyra Family Restaurant)
- durgadhaba@localbites.com (Durga Dhaba)
- amalodbhavi@localbites.com (Hotel Amalodbhavi)
- candc@localbites.com (C&C Family Restaurant)
- u1family@localbites.com (U1 Family Dhaba)
- kokilasri@localbites.com (Kokila Sri Dhaba)
- chandamama@localbites.com (Chandamama Garden)
- swagathgrand@localbites.com (Swagath Grand)
- srisaiganesh@localbites.com (Sri Sai Ganesh)

Total Restaurants: 14 (All Annavaram based)
========================================
`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Restaurant.deleteMany();
    await FoodItem.deleteMany();
    console.log('Data destroyed...');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  seedData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Usage: node seeder.js -i (import) or -d (delete)');
  process.exit(1);
}
