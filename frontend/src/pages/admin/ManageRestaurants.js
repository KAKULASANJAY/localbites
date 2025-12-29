import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FiArrowLeft, FiCheck, FiX, FiSearch, FiEye, 
  FiMapPin, FiPhone, FiPercent, FiEdit2 
} from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ManageRestaurants = () => {
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterApproved, setFilterApproved] = useState(
    searchParams.get('pending') === 'true' ? 'pending' : 'all'
  );
  const [editingCommission, setEditingCommission] = useState(null);
  const [newCommission, setNewCommission] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, [filterApproved]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterApproved === 'pending') params.isApproved = false;
      else if (filterApproved === 'approved') params.isApproved = true;
      
      const response = await adminAPI.getAllRestaurants(params);
      setRestaurants(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, approved) => {
    try {
      await adminAPI.approveRestaurant(id, approved);
      toast.success(approved ? 'Restaurant approved' : 'Restaurant rejected');
      fetchRestaurants();
    } catch (error) {
      toast.error('Failed to update restaurant');
    }
  };

  const handleCommissionUpdate = async (id) => {
    try {
      await adminAPI.updateCommission(id, parseFloat(newCommission));
      toast.success('Commission updated');
      setEditingCommission(null);
      fetchRestaurants();
    } catch (error) {
      toast.error('Failed to update commission');
    }
  };

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.address?.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="section">
      <div className="container">
        <div className="flex gap-2 mb-3" style={{ alignItems: 'center' }}>
          <Link to="/admin" className="btn btn-outline btn-sm">
            <FiArrowLeft />
          </Link>
          <h1>Manage Restaurants</h1>
        </div>

        {/* Filters */}
        <div className="card mb-3" style={{ padding: '16px' }}>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            <div className="search-box" style={{ flex: '1', minWidth: '250px' }}>
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              value={filterApproved}
              onChange={(e) => setFilterApproved(e.target.value)}
              className="form-input"
              style={{ width: 'auto' }}
            >
              <option value="all">All Restaurants</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-3 mb-3">
          <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--primary)' }}>{restaurants.length}</h2>
            <p className="text-secondary">Total</p>
          </div>
          <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--success)' }}>
              {restaurants.filter(r => r.isApproved).length}
            </h2>
            <p className="text-secondary">Approved</p>
          </div>
          <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--warning)' }}>
              {restaurants.filter(r => !r.isApproved).length}
            </h2>
            <p className="text-secondary">Pending</p>
          </div>
        </div>

        {/* Restaurants List */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="empty-state">
            <h3>No restaurants found</h3>
          </div>
        ) : (
          <div className="grid" style={{ gap: '16px' }}>
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant._id} className="card" style={{ padding: '20px' }}>
                <div className="flex gap-3">
                  <img
                    src={restaurant.image || 'https://via.placeholder.com/120x120?text=Restaurant'}
                    alt={restaurant.name}
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div className="flex-between mb-1">
                      <div>
                        <h3 style={{ marginBottom: '4px' }}>{restaurant.name}</h3>
                        <div className="flex gap-1">
                          <span className={`badge ${restaurant.isApproved ? 'badge-success' : 'badge-warning'}`}>
                            {restaurant.isApproved ? 'Approved' : 'Pending'}
                          </span>
                          <span className={`badge ${restaurant.isOpen ? 'badge-success' : 'badge-danger'}`}>
                            {restaurant.isOpen ? 'Open' : 'Closed'}
                          </span>
                        </div>
                      </div>
                      <Link 
                        to={`/restaurant/${restaurant._id}`}
                        className="btn btn-outline btn-sm"
                        target="_blank"
                      >
                        <FiEye /> View
                      </Link>
                    </div>

                    <p className="text-secondary" style={{ fontSize: '14px', marginBottom: '8px' }}>
                      {restaurant.cuisine?.join(' • ')}
                    </p>

                    <div className="flex gap-3 mb-2" style={{ flexWrap: 'wrap', fontSize: '14px' }}>
                      <span className="text-secondary">
                        <FiMapPin style={{ marginRight: '4px' }} />
                        {restaurant.address?.area}, {restaurant.address?.city}
                      </span>
                      <span className="text-secondary">
                        <FiPhone style={{ marginRight: '4px' }} />
                        {restaurant.phone}
                      </span>
                    </div>

                    <div className="flex gap-2" style={{ alignItems: 'center' }}>
                      <span className="text-secondary">Owner: {restaurant.owner?.name}</span>
                      <span className="text-secondary">•</span>
                      <span className="text-secondary">⭐ {restaurant.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ 
                  marginTop: '16px', 
                  paddingTop: '16px', 
                  borderTop: '1px solid var(--border-color)' 
                }}>
                  <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
                    {/* Commission */}
                    <div className="flex gap-2" style={{ alignItems: 'center' }}>
                      <span className="text-secondary">
                        <FiPercent /> Commission:
                      </span>
                      {editingCommission === restaurant._id ? (
                        <div className="flex gap-1">
                          <input
                            type="number"
                            value={newCommission}
                            onChange={(e) => setNewCommission(e.target.value)}
                            className="form-input"
                            style={{ width: '80px', padding: '6px' }}
                            min="0"
                            max="50"
                          />
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleCommissionUpdate(restaurant._id)}
                          >
                            <FiCheck />
                          </button>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => setEditingCommission(null)}
                          >
                            <FiX />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-1" style={{ alignItems: 'center' }}>
                          <strong>{restaurant.commissionPercentage}%</strong>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => {
                              setEditingCommission(restaurant._id);
                              setNewCommission(restaurant.commissionPercentage.toString());
                            }}
                          >
                            <FiEdit2 />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Approval Actions */}
                    {!restaurant.isApproved ? (
                      <div className="flex gap-2">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(restaurant._id, true)}
                        >
                          <FiCheck /> Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleApprove(restaurant._id, false)}
                        >
                          <FiX /> Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleApprove(restaurant._id, false)}
                      >
                        Revoke Approval
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRestaurants;
