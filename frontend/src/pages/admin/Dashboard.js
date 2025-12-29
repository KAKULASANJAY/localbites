import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, 
  FiHome, FiCheckCircle, FiClock, FiList 
} from 'react-icons/fi';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
      subtitle: 'All time',
      icon: FiDollarSign,
      color: '#4caf50'
    },
    {
      title: 'Platform Commission',
      value: `₹${stats?.totalCommission?.toLocaleString() || 0}`,
      subtitle: 'Earnings',
      icon: FiTrendingUp,
      color: '#2196f3'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      subtitle: `${stats?.todayOrders || 0} today`,
      icon: FiShoppingBag,
      color: '#ff5722'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      subtitle: `${stats?.totalCustomers || 0} customers`,
      icon: FiUsers,
      color: '#9c27b0'
    },
    {
      title: 'Total Restaurants',
      value: stats?.totalRestaurants || 0,
      subtitle: `${stats?.activeRestaurants || 0} active`,
      icon: FiHome,
      color: '#ff9800'
    },
    {
      title: 'Pending Approvals',
      value: stats?.pendingApprovals || 0,
      subtitle: 'Restaurants',
      icon: FiClock,
      color: '#f44336'
    }
  ];

  return (
    <div className="section">
      <div className="container">
        <div className="flex-between mb-3">
          <h1>Admin Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-3 mb-4">
          {statCards.map((stat, index) => (
            <div key={index} className="card" style={{ padding: '24px' }}>
              <div className="flex gap-3" style={{ alignItems: 'flex-start' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-md)',
                  background: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <stat.icon style={{ fontSize: '24px', color: stat.color }} />
                </div>
                <div>
                  <p className="text-secondary" style={{ marginBottom: '4px' }}>{stat.title}</p>
                  <h2 style={{ marginBottom: '4px' }}>{stat.value}</h2>
                  <small className="text-secondary">{stat.subtitle}</small>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="mb-2">Quick Actions</h2>
        <div className="grid grid-4 mb-4">
          <Link to="/admin/restaurants" className="card card-hover" style={{ padding: '20px', textAlign: 'center' }}>
            <FiHome style={{ fontSize: '32px', color: 'var(--primary)', marginBottom: '12px' }} />
            <h4>Manage Restaurants</h4>
            <p className="text-secondary" style={{ fontSize: '13px' }}>Approve & manage</p>
          </Link>
          <Link to="/admin/users" className="card card-hover" style={{ padding: '20px', textAlign: 'center' }}>
            <FiUsers style={{ fontSize: '32px', color: 'var(--primary)', marginBottom: '12px' }} />
            <h4>Manage Users</h4>
            <p className="text-secondary" style={{ fontSize: '13px' }}>View all users</p>
          </Link>
          <Link to="/admin/orders" className="card card-hover" style={{ padding: '20px', textAlign: 'center' }}>
            <FiList style={{ fontSize: '32px', color: 'var(--primary)', marginBottom: '12px' }} />
            <h4>All Orders</h4>
            <p className="text-secondary" style={{ fontSize: '13px' }}>Platform orders</p>
          </Link>
          <Link to="/admin/restaurants?pending=true" className="card card-hover" style={{ padding: '20px', textAlign: 'center' }}>
            <FiCheckCircle style={{ fontSize: '32px', color: 'var(--success)', marginBottom: '12px' }} />
            <h4>Pending Approvals</h4>
            <p className="text-secondary" style={{ fontSize: '13px' }}>{stats?.pendingApprovals || 0} waiting</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-2">
          {/* Recent Orders */}
          <div className="card" style={{ padding: '20px' }}>
            <div className="flex-between mb-2">
              <h3>Recent Orders</h3>
              <Link to="/admin/orders" className="btn btn-sm btn-outline">View All</Link>
            </div>
            {stats?.recentOrders?.length > 0 ? (
              <div>
                {stats.recentOrders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex-between" style={{ 
                    padding: '12px 0',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <div>
                      <strong>#{order.orderNumber}</strong>
                      <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
                        {order.restaurant?.name}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong>₹{order.totalAmount}</strong>
                      <span className={`badge badge-${order.status === 'delivered' ? 'success' : 'primary'}`} style={{ display: 'block', marginTop: '4px' }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary">No recent orders</p>
            )}
          </div>

          {/* Pending Restaurants */}
          <div className="card" style={{ padding: '20px' }}>
            <div className="flex-between mb-2">
              <h3>Pending Restaurants</h3>
              <Link to="/admin/restaurants?pending=true" className="btn btn-sm btn-outline">View All</Link>
            </div>
            {stats?.pendingRestaurants?.length > 0 ? (
              <div>
                {stats.pendingRestaurants.slice(0, 5).map((restaurant) => (
                  <div key={restaurant._id} className="flex-between" style={{ 
                    padding: '12px 0',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <div>
                      <strong>{restaurant.name}</strong>
                      <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
                        {restaurant.cuisine?.join(', ')}
                      </p>
                    </div>
                    <Link 
                      to={`/admin/restaurants`}
                      className="btn btn-sm btn-primary"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <FiCheckCircle style={{ fontSize: '48px', color: 'var(--success)', marginBottom: '12px' }} />
                <p className="text-secondary">No pending approvals</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
