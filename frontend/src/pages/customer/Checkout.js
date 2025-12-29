import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiPhone, FiUser, FiCheck } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, restaurant, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    area: user?.address?.area || '',
    city: user?.address?.city || 'Annavaram',
    pincode: user?.address?.pincode || '',
    landmark: ''
  });
  const [specialInstructions, setSpecialInstructions] = useState('');

  const deliveryCharge = restaurant?.deliveryCharge || 0;
  const itemsTotal = getCartTotal();
  const totalAmount = itemsTotal + deliveryCharge;

  const handleChange = (e) => {
    setDeliveryAddress({ ...deliveryAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        restaurantId: restaurant._id,
        items: cartItems.map(item => ({
          foodItem: item._id,
          quantity: item.quantity
        })),
        deliveryAddress,
        specialInstructions
      };

      const response = await orderAPI.place(orderData);
      
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order/${response.data.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="mb-3">Checkout</h1>

        <div className="cart-container">
          {/* Delivery Form */}
          <div className="cart-items">
            <form onSubmit={handleSubmit}>
              <h3 className="mb-3">
                <FiMapPin style={{ marginRight: '8px' }} />
                Delivery Address
              </h3>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <FiUser style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      style={{ paddingLeft: '42px' }}
                      placeholder="Receiver's name"
                      value={deliveryAddress.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <FiPhone style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      style={{ paddingLeft: '42px' }}
                      placeholder="10-digit phone number"
                      value={deliveryAddress.phone}
                      onChange={handleChange}
                      pattern="[6-9][0-9]{9}"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  name="street"
                  className="form-input"
                  placeholder="House/Flat no., Building, Street"
                  value={deliveryAddress.street}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Area / Locality</label>
                  <input
                    type="text"
                    name="area"
                    className="form-input"
                    placeholder="Area name"
                    value={deliveryAddress.area}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    className="form-input"
                    placeholder="Pincode"
                    value={deliveryAddress.pincode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  className="form-input"
                  placeholder="Near temple, opposite park, etc."
                  value={deliveryAddress.landmark}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Special Instructions (Optional)</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Any special cooking instructions or delivery notes..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                ></textarea>
              </div>

              {/* Payment Info */}
              <div className="card" style={{ 
                padding: '16px', 
                background: '#f0fdf4',
                border: '2px solid var(--success)',
                marginTop: '20px'
              }}>
                <div className="flex gap-2" style={{ alignItems: 'center' }}>
                  <span style={{ fontSize: '24px' }}>💵</span>
                  <div>
                    <strong>Cash on Delivery</strong>
                    <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
                      Pay ₹{totalAmount} when your order arrives
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg mt-3"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : `Place Order • ₹${totalAmount}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            
            <div style={{ 
              padding: '12px 0', 
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '12px'
            }}>
              <strong>{restaurant?.name}</strong>
              <p className="text-secondary" style={{ fontSize: '13px' }}>
                {restaurant?.address?.area}
              </p>
            </div>

            {/* Items */}
            {cartItems.map((item) => (
              <div key={item._id} className="flex-between" style={{ padding: '8px 0' }}>
                <div className="flex gap-1" style={{ alignItems: 'center' }}>
                  <span className={`food-type ${item.isVeg ? 'veg' : 'nonveg'}`} style={{ transform: 'scale(0.8)' }}></span>
                  <span style={{ fontSize: '14px' }}>{item.name} × {item.quantity}</span>
                </div>
                <span style={{ fontSize: '14px' }}>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <div className="cart-summary-row" style={{ marginTop: '12px' }}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
