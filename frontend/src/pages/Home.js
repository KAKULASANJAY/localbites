import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiClock, FiStar, FiMapPin } from 'react-icons/fi';
import { restaurantAPI } from '../services/api';
import '../styles/pages.css';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(search)}`);
    }
  };

  const cuisineTypes = [
    { name: 'North Indian', icon: '🍛' },
    { name: 'South Indian', icon: '🥘' },
    { name: 'Chinese', icon: '🥡' },
    { name: 'Pizza', icon: '🍕' },
    { name: 'Biryani', icon: '🍚' },
    { name: 'Fast Food', icon: '🍔' },
    { name: 'Desserts', icon: '🍰' },
    { name: 'Thali', icon: '🍽️' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Delicious Food,<br />Delivered to Your Door</h1>
          <p>Order from your favorite local restaurants</p>
          
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for restaurants or food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary">
              <FiSearch /> Search
            </button>
          </form>
        </div>
      </section>

      {/* Cuisines Section */}
      <section className="section">
        <div className="container">
          <h2 className="mb-3">What are you craving?</h2>
          <div className="grid grid-4">
            {cuisineTypes.map((cuisine) => (
              <Link
                key={cuisine.name}
                to={`/restaurants?cuisine=${encodeURIComponent(cuisine.name)}`}
                className="card"
                style={{ textAlign: 'center', padding: '24px' }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{cuisine.icon}</div>
                <h4>{cuisine.name}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="flex-between mb-3">
            <h2>Popular Restaurants</h2>
            <Link to="/restaurants" className="btn btn-outline btn-sm">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-3">
              {restaurants.slice(0, 6).map((restaurant) => (
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
                    <h3>{restaurant.name}</h3>
                    <p className="restaurant-cuisine">
                      {restaurant.cuisine?.join(', ') || 'Multi Cuisine'}
                    </p>
                    <div className="restaurant-meta">
                      <span className="restaurant-rating">
                        <FiStar /> {restaurant.rating || '4.0'}
                      </span>
                      <span>
                        <FiClock /> {restaurant.deliveryTime}
                      </span>
                      <span>
                        <FiMapPin /> {restaurant.address?.area}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && restaurants.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🍽️</div>
              <h3>No restaurants yet</h3>
              <p>Be the first restaurant to join our platform!</p>
              <Link to="/register" className="btn btn-primary">
                Register Your Restaurant
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <h2 className="text-center mb-4">How It Works</h2>
          <div className="grid grid-3">
            <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
              <h4>Choose Restaurant</h4>
              <p className="text-secondary">Browse local restaurants and pick your favorite</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
              <h4>Select Your Food</h4>
              <p className="text-secondary">Add items to cart and place your order</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚴</div>
              <h4>Get Delivered</h4>
              <p className="text-secondary">Food delivered to your doorstep. Pay on delivery!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: 'var(--primary)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: 'white' }}>Own a Restaurant?</h2>
          <p style={{ marginBottom: '24px', opacity: 0.9 }}>
            Partner with us and reach more customers in your area
          </p>
          <Link to="/register" className="btn btn-secondary btn-lg">
            Register Your Restaurant
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
