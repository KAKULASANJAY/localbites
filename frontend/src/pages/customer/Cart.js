import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiMinus, FiTrash2, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const { 
    cartItems, 
    restaurant, 
    addToCart, 
    removeFromCart, 
    deleteFromCart, 
    getCartTotal, 
    clearCart 
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const deliveryCharge = restaurant?.deliveryCharge || 0;
  const itemsTotal = getCartTotal();
  const totalAmount = itemsTotal + deliveryCharge;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="section">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon"><FiShoppingBag /></div>
            <h3>Your cart is empty</h3>
            <p>Add items from a restaurant to get started</p>
            <Link to="/restaurants" className="btn btn-primary">
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="mb-3">Your Cart</h1>

        <div className="cart-container">
          {/* Cart Items */}
          <div className="cart-items">
            {/* Restaurant Info */}
            <div className="flex-between mb-3" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3>{restaurant?.name}</h3>
                <p className="text-secondary" style={{ fontSize: '14px' }}>
                  {restaurant?.address?.area}
                </p>
              </div>
              <button 
                className="btn btn-sm" 
                style={{ color: 'var(--danger)', background: 'none' }}
                onClick={clearCart}
              >
                <FiTrash2 /> Clear Cart
              </button>
            </div>

            {/* Items */}
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <span className={`food-type ${item.isVeg ? 'veg' : 'nonveg'}`}></span>
                
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{item.price} each</div>
                </div>

                <div className="quantity-controls" style={{ 
                  position: 'relative', 
                  transform: 'none',
                  left: 'auto',
                  bottom: 'auto'
                }}>
                  <button onClick={() => removeFromCart(item._id)}>
                    <FiMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item, restaurant)}>
                    <FiPlus />
                  </button>
                </div>

                <div className="cart-item-total">
                  ₹{item.price * item.quantity}
                </div>

                <button 
                  className="cart-item-remove"
                  onClick={() => deleteFromCart(item._id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            
            <div className="cart-summary-row">
              <span>Items Total</span>
              <span>₹{itemsTotal}</span>
            </div>
            <div className="cart-summary-row">
              <span>Delivery Charge</span>
              <span>₹{deliveryCharge}</span>
            </div>
            <div className="cart-summary-row total">
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>

            {restaurant?.minOrder && itemsTotal < restaurant.minOrder && (
              <div className="badge badge-warning" style={{ 
                width: '100%', 
                justifyContent: 'center', 
                marginTop: '16px',
                padding: '10px'
              }}>
                Add ₹{restaurant.minOrder - itemsTotal} more for minimum order
              </div>
            )}

            <button
              className="btn btn-primary btn-block btn-lg mt-3"
              onClick={handleCheckout}
              disabled={restaurant?.minOrder && itemsTotal < restaurant.minOrder}
            >
              Proceed to Checkout <FiArrowRight />
            </button>

            <p className="text-center text-secondary mt-2" style={{ fontSize: '13px' }}>
              💵 Cash on Delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
