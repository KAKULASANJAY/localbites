import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiClock, FiStar, FiMapPin, FiFilter } from 'react-icons/fi';
import { restaurantAPI } from '../services/api';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    cuisine: searchParams.get('cuisine') || '',
    vegOnly: searchParams.get('vegOnly') === 'true',
    sortBy: searchParams.get('sortBy') || ''
  });

  useEffect(() => {
    fetchRestaurants();
  }, [searchParams]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await restaurantAPI.getAll({
        search: filters.search,
        cuisine: filters.cuisine,
        vegOnly: filters.vegOnly,
        sortBy: filters.sortBy
      });
      setRestaurants(response.data.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const cuisineOptions = [
    'North Indian', 'South Indian', 'Chinese', 'Fast Food', 
    'Pizza', 'Biryani', 'Street Food', 'Desserts'
  ];

  return (
    <div className="section">
      <div className="container">
        <h1 className="mb-3">Restaurants</h1>

        {/* Filters */}
        <div className="card mb-3" style={{ padding: '20px' }}>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ position: 'relative' }}>
                <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search restaurants..."
                  style={{ paddingLeft: '40px' }}
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            {/* Cuisine Filter */}
            <select
              className="form-input form-select"
              style={{ width: 'auto' }}
              value={filters.cuisine}
              onChange={(e) => handleFilterChange('cuisine', e.target.value)}
            >
              <option value="">All Cuisines</option>
              {cuisineOptions.map((cuisine) => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              className="form-input form-select"
              style={{ width: 'auto' }}
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="rating">Rating</option>
              <option value="deliveryTime">Delivery Time</option>
              <option value="minOrder">Min Order</option>
            </select>

            {/* Veg Only */}
            <label className="flex gap-1" style={{ alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filters.vegOnly}
                onChange={(e) => handleFilterChange('vegOnly', e.target.checked)}
              />
              <span className="food-type veg" style={{ marginLeft: '4px' }}></span>
              Veg Only
            </label>
          </div>
        </div>

        {/* Restaurant Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : restaurants.length > 0 ? (
          <div className="grid grid-3">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant._id}
                to={`/restaurant/${restaurant._id}`}
                className="restaurant-card"
              >
                <div className="restaurant-card-image">
                  🍽️
                  <span className={`restaurant-status ${restaurant.isOpen ? 'open' : 'closed'}`}>
                    {restaurant.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                <div className="restaurant-card-body">
                  <div className="flex-between">
                    <h3>{restaurant.name}</h3>
                    {restaurant.isVegOnly && (
                      <span className="food-type veg" title="Pure Veg"></span>
                    )}
                  </div>
                  <p className="restaurant-cuisine">
                    {restaurant.cuisine?.join(', ') || 'Multi Cuisine'}
                  </p>
                  <div className="restaurant-meta">
                    <span className="restaurant-rating">
                      <FiStar /> {restaurant.rating?.toFixed(1) || '4.0'}
                    </span>
                    <span>
                      <FiClock /> {restaurant.deliveryTime}
                    </span>
                    <span>
                      <FiMapPin /> {restaurant.address?.area}
                    </span>
                  </div>
                  <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Min Order: ₹{restaurant.minOrder} • Delivery: ₹{restaurant.deliveryCharge}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No restaurants found</h3>
            <p>Try adjusting your filters or search term</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setFilters({ search: '', cuisine: '', vegOnly: false, sortBy: '' });
                setSearchParams({});
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
