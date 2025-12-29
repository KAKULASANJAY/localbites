import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiHome, FiList, FiPackage, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import '../../styles/components.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'restaurant':
        return '/restaurant-dashboard';
      default:
        return '/my-orders';
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          🍕 Local<span>Bites</span>
        </Link>

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <FiHome /> Home
          </Link>

          <Link 
            to="/restaurants" 
            className={`navbar-link ${isActive('/restaurants') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <FiList /> Restaurants
          </Link>

          {isAuthenticated && user?.role === 'customer' && (
            <Link 
              to="/my-orders" 
              className={`navbar-link ${isActive('/my-orders') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <FiPackage /> My Orders
            </Link>
          )}

          <Link 
            to="/cart" 
            className={`navbar-link cart-icon ${isActive('/cart') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <FiShoppingCart />
            {getItemsCount() > 0 && (
              <span className="cart-badge">{getItemsCount()}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="navbar-user">
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="user-dropdown">
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
                  <strong>{user?.name}</strong>
                  <div style={{ fontSize: '12px', color: '#666' }}>{user?.email}</div>
                </div>
                <Link to={getDashboardLink()} onClick={closeMenu}>
                  <FiSettings /> Dashboard
                </Link>
                <Link to="/profile" onClick={closeMenu}>
                  <FiUser /> Profile
                </Link>
                <div className="divider"></div>
                <button onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link 
                to="/login" 
                className="btn btn-outline btn-sm"
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary btn-sm"
                onClick={closeMenu}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
