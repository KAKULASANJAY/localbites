import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiDollarSign, FiClock, FiCheckCircle, FiAlertCircle, FiMenu, FiSettings } from 'react-icons/fi';
import { restaurantAPI, orderAPI } from '../../services/api';

const RestaurantDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    preparing: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [restaurantRes, ordersRes] = await Promise.all([
        restaurantAPI.getMyRestaurant(),
        orderAPI.getRestaurantOrders({ limit: 10 })
      ]);

      setRestaurant(restaurantRes.data.data);
      setOrders(ordersRes.data.data);

      // Calculate stats from status counts
      const statusCounts = ordersRes.data.statusCounts || [];
      const stats = {
        total: ordersRes.data.total || 0,
        pending: 0,
        preparing: 0,
        completed: 0
      };

      statusCounts.forEach(s => {
        if (['placed', 'confirmed'].includes(s._id)) stats.pending += s.count;
        if (['preparing', 'ready'].includes(s._id)) stats.preparing += s.count;
        if (s._id === 'delivered') stats.completed += s.count;
      });

      setStats(stats);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="section">
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <div className="card" style={{ padding: '40px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏪</div>
            <h2>Register Your Restaurant</h2>
            <p className="text-secondary mb-3">
              You haven't registered a restaurant yet. Create your restaurant profile to start receiving orders.
            </p>
            <Link to="/restaurant-dashboard/settings" className="btn btn-primary btn-lg">
              Register Restaurant
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div className="flex-between mb-3">
          <div>
            <h1>{restaurant.name}</h1>
            <div className="flex gap-2 mt-1">
              <span className={`badge ${restaurant.isApproved ? 'badge-success' : 'badge-warning'}`}>
                {restaurant.isApproved ? 'Approved' : 'Pending Approval'}
              </span>
              <span className={`badge ${restaurant.isOpen ? 'badge-success' : 'badge-danger'}`}>
                {restaurant.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/restaurant-dashboard/menu" className="btn btn-outline">
              <FiMenu /> Manage Menu
            </Link>
            <Link to="/restaurant-dashboard/settings" className="btn btn-outline">
              <FiSettings /> Settings
            </Link>
          </div>
        </div>

        {!restaurant.isApproved && (
          <div className="card mb-3" style={{ 
            padding: '16px', 
            background: '#fff3e0',
            border: '1px solid #ffe0b2'
          }}>
            <div className="flex gap-2" style={{ alignItems: 'center' }}>
              <FiAlertCircle style={{ color: '#e65100', fontSize: '24px' }} />
              <div>
                <strong>Pending Approval</strong>
                <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
                  Your restaurant is under review. You'll start receiving orders once approved by admin.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-4 mb-3">
          <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <FiPackage style={{ fontSize: '32px', color: 'var(--primary)', marginBottom: '8px' }} />
            <h3>{stats.total}</h3>
            <p className="text-secondary">Total Orders</p>
          </div>
          <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <FiClock style={{ fontSize: '32px', color: 'var(--warning)', marginBottom: '8px' }} />
            <h3>{stats.pending}</h3>
            <p className="text-secondary">Pending</p>
          </div>
          <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <FiClock style={{ fontSize: '32px', color: 'var(--info)', marginBottom: '8px' }} />
            <h3>{stats.preparing}</h3>
            <p className="text-secondary">Preparing</p>
          </div>
          <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <FiCheckCircle style={{ fontSize: '32px', color: 'var(--success)', marginBottom: '8px' }} />
            <h3>{stats.completed}</h3>
            <p className="text-secondary">Completed</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-3 mb-3">
          <Link to="/restaurant-dashboard/orders" className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <FiPackage style={{ fontSize: '40px', color: 'var(--primary)', marginBottom: '12px' }} />
            <h4>View Orders</h4>
            <p className="text-secondary">Manage incoming orders</p>
          </Link>
          <Link to="/restaurant-dashboard/menu" className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <FiMenu style={{ fontSize: '40px', color: 'var(--primary)', marginBottom: '12px' }} />
            <h4>Menu Items</h4>
            <p className="text-secondary">{restaurant.menu?.length || 0} items</p>
          </Link>
          <Link to="/restaurant-dashboard/settings" className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <FiSettings style={{ fontSize: '40px', color: 'var(--primary)', marginBottom: '12px' }} />
            <h4>Settings</h4>
            <p className="text-secondary">Update restaurant info</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="flex-between mb-3">
            <h3>Recent Orders</h3>
            <Link to="/restaurant-dashboard/orders" className="btn btn-outline btn-sm">
              View All
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <FiPackage style={{ fontSize: '48px', color: 'var(--text-light)', marginBottom: '16px' }} />
              <h4>No orders yet</h4>
              <p className="text-secondary">Orders will appear here when customers place them</p>
            </div>
          ) : (
            <div>
              {orders.slice(0, 5).map((order) => (
                <Link
                  key={order._id}
                  to={`/order/${order._id}`}
                  className="flex-between"
                  style={{ 
                    padding: '16px 0',
                    borderBottom: '1px solid var(--border-color)'
                  }}
                >
                  <div>
                    <div className="flex gap-2" style={{ alignItems: 'center' }}>
                      <strong>#{order.orderNumber}</strong>
                      <span className={`order-status-badge ${order.status}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-secondary" style={{ fontSize: '13px' }}>
                      {order.customer?.name} • {order.items?.length} items
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>₹{order.totalAmount}</strong>
                    <p className="text-secondary" style={{ fontSize: '13px' }}>
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
