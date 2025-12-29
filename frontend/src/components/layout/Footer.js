import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>🍕 LocalBites</h3>
            <p>
              Your favorite local food, delivered to your doorstep.
              Supporting local restaurants and bringing delicious meals to your home.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/restaurants">Restaurants</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/my-orders">My Orders</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>For Partners</h4>
            <ul>
              <li><Link to="/register">Register Restaurant</Link></li>
              <li><Link to="/login">Restaurant Login</Link></li>
              <li><Link to="#">Become a Delivery Partner</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <ul>
              <li><a href="mailto:support@localbites.com">support@localbites.com</a></li>
              <li><a href="tel:+919999999999">+91 99999 99999</a></li>
              <li>Annavaram, Kakinada District, India</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} LocalBites. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
