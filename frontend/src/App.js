import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/Home';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetail from './pages/RestaurantDetail';
import Login from './pages/Login';
import Register from './pages/Register';

// Customer Pages
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import MyOrders from './pages/customer/MyOrders';
import OrderDetail from './pages/customer/OrderDetail';
import Profile from './pages/customer/Profile';

// Restaurant Pages
import RestaurantDashboard from './pages/restaurant/Dashboard';
import ManageMenu from './pages/restaurant/ManageMenu';
import RestaurantOrders from './pages/restaurant/Orders';
import RestaurantSettings from './pages/restaurant/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageRestaurants from './pages/admin/ManageRestaurants';
import ManageUsers from './pages/admin/ManageUsers';
import AdminOrders from './pages/admin/Orders';

// Route Protection
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/restaurants" element={<RestaurantList />} />
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Customer Routes */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={
                  <PrivateRoute roles={['customer']}>
                    <Checkout />
                  </PrivateRoute>
                } />
                <Route path="/my-orders" element={
                  <PrivateRoute roles={['customer']}>
                    <MyOrders />
                  </PrivateRoute>
                } />
                <Route path="/order/:id" element={
                  <PrivateRoute roles={['customer', 'restaurant', 'admin']}>
                    <OrderDetail />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />

                {/* Restaurant Routes */}
                <Route path="/restaurant-dashboard" element={
                  <PrivateRoute roles={['restaurant']}>
                    <RestaurantDashboard />
                  </PrivateRoute>
                } />
                <Route path="/restaurant-dashboard/menu" element={
                  <PrivateRoute roles={['restaurant']}>
                    <ManageMenu />
                  </PrivateRoute>
                } />
                <Route path="/restaurant-dashboard/orders" element={
                  <PrivateRoute roles={['restaurant']}>
                    <RestaurantOrders />
                  </PrivateRoute>
                } />
                <Route path="/restaurant-dashboard/settings" element={
                  <PrivateRoute roles={['restaurant']}>
                    <RestaurantSettings />
                  </PrivateRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <PrivateRoute roles={['admin']}>
                    <AdminDashboard />
                  </PrivateRoute>
                } />
                <Route path="/admin/restaurants" element={
                  <PrivateRoute roles={['admin']}>
                    <ManageRestaurants />
                  </PrivateRoute>
                } />
                <Route path="/admin/users" element={
                  <PrivateRoute roles={['admin']}>
                    <ManageUsers />
                  </PrivateRoute>
                } />
                <Route path="/admin/orders" element={
                  <PrivateRoute roles={['admin']}>
                    <AdminOrders />
                  </PrivateRoute>
                } />
              </Routes>
            </main>
            <Footer />
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#333',
                  color: '#fff',
                }
              }}
            />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
