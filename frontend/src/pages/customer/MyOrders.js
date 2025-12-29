import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiClock, FiMapPin } from 'react-icons/fi';
import { orderAPI } from '../../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const params = activeTab !== 'all' ? { status: activeTab } : {};
      const response = await orderAPI.getMyOrders(params);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    return `order-status-badge ${status}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { key: 'all', label: 'All Orders' },
    { key: 'placed', label: 'Active' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="section">
      <div className="container">
        <h1 className="mb-3">My Orders</h1>

        {/* Tabs */}
        <div className="menu-filters mb-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`menu-filter-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FiPackage /></div>
            <h3>No orders found</h3>
            <p>You haven't placed any orders yet</p>
            <Link to="/restaurants" className="btn btn-primary">
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="grid" style={{ gap: '16px' }}>
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/order/${order._id}`}
                className="card"
                style={{ padding: '20px' }}
              >
                <div className="flex-between mb-2">
                  <div>
                    <h4>{order.restaurant?.name}</h4>
                    <p className="text-secondary" style={{ fontSize: '13px' }}>
                      <FiMapPin style={{ marginRight: '4px' }} />
                      {order.restaurant?.address?.area}
                    </p>
                  </div>
                  <span className={getStatusBadgeClass(order.status)}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="flex-between" style={{ 
                  padding: '12px 0',
                  borderTop: '1px solid var(--border-color)',
                  borderBottom: '1px solid var(--border-color)',
                  margin: '12px 0'
                }}>
                  <div>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {order.items?.map(item => `${item.name} × ${item.quantity}`).join(', ')}
                    </span>
                  </div>
                  <strong>₹{order.totalAmount}</strong>
                </div>

                <div className="flex-between" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <span>
                    <FiClock style={{ marginRight: '4px' }} />
                    {formatDate(order.createdAt)}
                  </span>
                  <span>Order #{order.orderNumber}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
