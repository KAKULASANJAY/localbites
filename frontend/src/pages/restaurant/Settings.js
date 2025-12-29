import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiPower, FiPlus, FiMapPin, FiClock, FiDollarSign } from 'react-icons/fi';
import { restaurantAPI } from '../../services/api';
import toast from 'react-hot-toast';

const RestaurantSettings = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasRestaurant, setHasRestaurant] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    cuisine: '',
    address: {
      street: '',
      area: '',
      city: '',
      pincode: ''
    },
    deliveryTime: '',
    minimumOrder: '',
    image: ''
  });

  const cuisineOptions = [
    'North Indian', 'South Indian', 'Chinese', 'Fast Food', 'Pizza',
    'Biryani', 'Street Food', 'Desserts', 'Beverages', 'Thali',
    'Italian', 'Continental', 'Mughlai', 'Bengali', 'Punjabi'
  ];

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      const response = await restaurantAPI.getMyRestaurant();
      const data = response.data.data;
      setRestaurant(data);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        phone: data.phone || '',
        cuisine: data.cuisine?.join(', ') || '',
        address: {
          street: data.address?.street || '',
          area: data.address?.area || '',
          city: data.address?.city || '',
          pincode: data.address?.pincode || ''
        },
        deliveryTime: data.deliveryTime || '',
        minimumOrder: data.minimumOrder || '',
        image: data.image || ''
      });
    } catch (error) {
      if (error.response?.status === 404) {
        setHasRestaurant(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        cuisine: formData.cuisine.split(',').map(c => c.trim()).filter(Boolean),
        deliveryTime: parseInt(formData.deliveryTime) || 30,
        minimumOrder: parseInt(formData.minimumOrder) || 0
      };

      if (hasRestaurant) {
        await restaurantAPI.update(restaurant._id, payload);
        toast.success('Settings saved successfully');
      } else {
        await restaurantAPI.create(payload);
        toast.success('Restaurant created successfully');
        setHasRestaurant(true);
        fetchRestaurant();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const toggleOpen = async () => {
    try {
      await restaurantAPI.toggleStatus(restaurant._id);
      setRestaurant(prev => ({ ...prev, isOpen: !prev.isOpen }));
      toast.success(`Restaurant is now ${restaurant.isOpen ? 'closed' : 'open'}`);
    } catch (error) {
      toast.error('Failed to toggle status');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="flex gap-2 mb-3" style={{ alignItems: 'center' }}>
          <Link to="/restaurant-dashboard" className="btn btn-outline btn-sm">
            <FiArrowLeft />
          </Link>
          <h1>{hasRestaurant ? 'Restaurant Settings' : 'Register Restaurant'}</h1>
        </div>

        {/* Status Card */}
        {hasRestaurant && restaurant && (
          <div className="card mb-3" style={{ padding: '20px' }}>
            <div className="flex-between">
              <div>
                <h3 style={{ marginBottom: '4px' }}>{restaurant.name}</h3>
                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                  <span className={`badge ${restaurant.isOpen ? 'badge-success' : 'badge-danger'}`}>
                    {restaurant.isOpen ? 'Open' : 'Closed'}
                  </span>
                  <span className={`badge ${restaurant.isApproved ? 'badge-success' : 'badge-warning'}`}>
                    {restaurant.isApproved ? 'Approved' : 'Pending Approval'}
                  </span>
                </div>
              </div>
              <button
                className={`btn ${restaurant.isOpen ? 'btn-danger' : 'btn-success'}`}
                onClick={toggleOpen}
              >
                <FiPower /> {restaurant.isOpen ? 'Close Restaurant' : 'Open Restaurant'}
              </button>
            </div>
          </div>
        )}

        {!hasRestaurant && (
          <div className="card mb-3" style={{ 
            padding: '20px', 
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            border: '2px solid var(--primary)'
          }}>
            <div className="flex gap-2" style={{ alignItems: 'center' }}>
              <FiPlus style={{ fontSize: '24px', color: 'var(--primary)' }} />
              <div>
                <h3 style={{ marginBottom: '4px' }}>Create Your Restaurant</h3>
                <p className="text-secondary" style={{ margin: 0 }}>
                  Fill in the details below to register your restaurant on our platform
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="card mb-3" style={{ padding: '20px' }}>
            <h3 className="mb-2">Basic Information</h3>
            
            <div className="form-group">
              <label className="form-label">Restaurant Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Your restaurant name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                rows="3"
                placeholder="Brief description about your restaurant"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="10-digit phone number"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cuisine Types *</label>
              <input
                type="text"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="e.g., North Indian, Chinese, Fast Food"
              />
              <small className="text-secondary">
                Suggestions: {cuisineOptions.slice(0, 6).join(', ')}
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="form-input"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Address */}
          <div className="card mb-3" style={{ padding: '20px' }}>
            <h3 className="mb-2">
              <FiMapPin style={{ marginRight: '8px' }} />
              Address
            </h3>
            
            <div className="form-group">
              <label className="form-label">Street Address *</label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Shop/Building, Street name"
              />
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Area *</label>
                <input
                  type="text"
                  name="address.area"
                  value={formData.address.area}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Locality/Area"
                />
              </div>
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="City"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Pincode *</label>
              <input
                type="text"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="6-digit pincode"
                maxLength="6"
              />
            </div>
          </div>

          {/* Delivery Settings */}
          <div className="card mb-3" style={{ padding: '20px' }}>
            <h3 className="mb-2">
              <FiClock style={{ marginRight: '8px' }} />
              Delivery Settings
            </h3>
            
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">
                  <FiClock style={{ marginRight: '4px' }} />
                  Delivery Time (minutes) *
                </label>
                <input
                  type="number"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  className="form-input"
                  required
                  min="10"
                  max="120"
                  placeholder="30"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FiDollarSign style={{ marginRight: '4px' }} />
                  Minimum Order (₹)
                </label>
                <input
                  type="number"
                  name="minimumOrder"
                  value={formData.minimumOrder}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Commission Info (readonly) */}
          {hasRestaurant && restaurant && (
            <div className="card mb-3" style={{ padding: '20px', background: 'var(--bg-light)' }}>
              <h3 className="mb-2">Platform Information</h3>
              <div className="grid grid-2">
                <div>
                  <p className="text-secondary" style={{ marginBottom: '4px' }}>Commission Rate</p>
                  <strong style={{ fontSize: '24px' }}>{restaurant.commissionPercentage}%</strong>
                </div>
                <div>
                  <p className="text-secondary" style={{ marginBottom: '4px' }}>Rating</p>
                  <strong style={{ fontSize: '24px' }}>
                    {restaurant.rating?.toFixed(1) || 'N/A'} ⭐
                  </strong>
                  <span className="text-secondary" style={{ fontSize: '14px' }}>
                    ({restaurant.totalRatings || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={saving}
          >
            <FiSave />
            {saving ? 'Saving...' : (hasRestaurant ? 'Save Settings' : 'Create Restaurant')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantSettings;
