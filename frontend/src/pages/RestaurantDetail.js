import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiClock, FiStar, FiMapPin, FiPhone, FiPlus, FiMinus } from 'react-icons/fi';
import { restaurantAPI, foodAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const { addToCart, removeFromCart, getItemQuantity } = useCart();

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      const [restaurantRes, menuRes] = await Promise.all([
        restaurantAPI.getById(id),
        foodAPI.getByRestaurant(id)
      ]);
      
      setRestaurant(restaurantRes.data.data);
      setMenu(menuRes.data.grouped || {});
      
      // Set first category as active
      const categories = Object.keys(menuRes.data.grouped || {});
      if (categories.length > 0) {
        setActiveCategory(categories[0]);
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMenu = () => {
    if (!vegOnly) return menu;
    
    const filtered = {};
    Object.entries(menu).forEach(([category, items]) => {
      const vegItems = items.filter(item => item.isVeg);
      if (vegItems.length > 0) {
        filtered[category] = vegItems;
      }
    });
    return filtered;
  };

  const filteredMenu = getFilteredMenu();
  const categories = Object.keys(filteredMenu);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="empty-state">
        <h3>Restaurant not found</h3>
      </div>
    );
  }

  return (
    <div className="restaurant-detail-page">
      {/* Restaurant Header */}
      <div className="restaurant-header">
        <div className="container">
          <div className="restaurant-info">
            <div className="restaurant-info-image">
              🍽️
            </div>
            <div className="restaurant-info-content">
              <div className="flex gap-2" style={{ alignItems: 'center' }}>
                <h1>{restaurant.name}</h1>
                {restaurant.isVegOnly && (
                  <span className="badge badge-veg">Pure Veg</span>
                )}
                <span className={`badge ${restaurant.isOpen ? 'badge-success' : 'badge-danger'}`}>
                  {restaurant.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              <p className="cuisine">{restaurant.cuisine?.join(', ') || 'Multi Cuisine'}</p>
              <div className="meta">
                <span className="restaurant-rating">
                  <FiStar /> {restaurant.rating?.toFixed(1) || '4.0'} ({restaurant.totalRatings || 0} ratings)
                </span>
                <span><FiClock /> {restaurant.deliveryTime}</span>
                <span><FiMapPin /> {restaurant.address?.area}, {restaurant.address?.city}</span>
              </div>
              <p className="text-secondary" style={{ fontSize: '14px', marginTop: '8px' }}>
                <FiPhone style={{ marginRight: '4px' }} /> {restaurant.phone}
              </p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Min Order: ₹{restaurant.minOrder} • Delivery Charge: ₹{restaurant.deliveryCharge}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="menu-section">
        <div className="container">
          <div className="flex-between mb-3">
            <h2>Menu</h2>
            <label className="flex gap-1" style={{ alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
              />
              <span className="food-type veg"></span>
              Veg Only
            </label>
          </div>

          {/* Category Filters */}
          <div className="menu-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`menu-filter-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category} ({filteredMenu[category]?.length || 0})
              </button>
            ))}
          </div>

          {/* Menu Items */}
          {categories.length === 0 ? (
            <div className="empty-state">
              <h3>No items available</h3>
              <p>This restaurant hasn't added menu items yet</p>
            </div>
          ) : (
            categories.map((category) => (
              <div 
                key={category} 
                className="menu-category"
                id={category}
                style={{ display: activeCategory === category ? 'block' : 'none' }}
              >
                <h2>{category}</h2>
                {filteredMenu[category]?.map((item) => (
                  <div key={item._id} className="food-item">
                    <div className="food-item-content">
                      <div className="food-item-header">
                        <span className={`food-type ${item.isVeg ? 'veg' : 'nonveg'}`}></span>
                        <span className="food-item-name">{item.name}</span>
                        {item.isBestseller && (
                          <span className="food-item-bestseller">⭐ Bestseller</span>
                        )}
                      </div>
                      <div className="food-item-price">₹{item.price}</div>
                      <p className="food-item-description">{item.description}</p>
                    </div>
                    <div className="food-item-image">
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '32px',
                        background: '#f5f5f5',
                        borderRadius: '10px'
                      }}>
                        🍽️
                      </div>
                      
                      {getItemQuantity(item._id) === 0 ? (
                        <button
                          className="add-to-cart-btn"
                          onClick={() => addToCart(item, restaurant)}
                          disabled={!restaurant.isOpen}
                        >
                          ADD
                        </button>
                      ) : (
                        <div className="quantity-controls">
                          <button onClick={() => removeFromCart(item._id)}>
                            <FiMinus />
                          </button>
                          <span>{getItemQuantity(item._id)}</span>
                          <button onClick={() => addToCart(item, restaurant)}>
                            <FiPlus />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
