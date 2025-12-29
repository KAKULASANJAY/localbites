import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiArrowLeft, FiSearch, FiFilter, FiEye, 
  FiCalendar, FiDollarSign, FiPackage 
} from 'react-icons/fi';
import { adminAPI } from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, pagination.page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      if (filterStatus !== 'all') params.status = filterStatus;
      
      const response = await adminAPI.getAllOrders(params);
      setOrders(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination?.total || response.data.count
      }));
      
      // Calculate stats
      const allOrders = response.data.data;
      setStats({
        total: response.data.count,
        revenue: allOrders.reduce((sum, o) => sum + o.totalAmount, 0),
        commission: allOrders.reduce((sum, o) => sum + (o.platformCommission || 0), 0)
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.restaurant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      'placed': 'badge-warning',
      'confirmed': 'badge-primary',
      'preparing': 'badge-primary',
      'ready': 'badge-primary',
      'out_for_delivery': 'badge-primary',
      'delivered': 'badge-success',
      'cancelled': 'badge-danger'
    };
    return colors[status] || 'badge-secondary';
  };

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'placed', label: 'Placed' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="section">
      <div className="container">
        <div className="flex gap-2 mb-3" style={{ alignItems: 'center' }}>
          <Link to="/admin" className="btn btn-outline btn-sm">
            <FiArrowLeft />
          </Link>
          <h1>All Orders</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-3 mb-3">
          <div className="card" style={{ padding: '20px' }}>
            <div className="flex gap-2" style={{ alignItems: 'center' }}>
              <FiPackage style={{ fontSize: '24px', color: 'var(--primary)' }} />
              <div>
                <p className="text-secondary" style={{ marginBottom: '4px' }}>Total Orders</p>
                <h2>{stats.total || 0}</h2>
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <div className="flex gap-2" style={{ alignItems: 'center' }}>
              <FiDollarSign style={{ fontSize: '24px', color: 'var(--success)' }} />
              <div>
                <p className="text-secondary" style={{ marginBottom: '4px' }}>Total Revenue</p>
                <h2>₹{stats.revenue?.toLocaleString() || 0}</h2>
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <div className="flex gap-2" style={{ alignItems: 'center' }}>
              <FiDollarSign style={{ fontSize: '24px', color: 'var(--primary)' }} />
              <div>
                <p className="text-secondary" style={{ marginBottom: '4px' }}>Commission</p>
                <h2>₹{stats.commission?.toLocaleString() || 0}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-3" style={{ padding: '16px' }}>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            <div className="search-box" style={{ flex: '1', minWidth: '250px' }}>
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by order #, restaurant, or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="form-input"
              style={{ width: 'auto' }}
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <FiPackage style={{ fontSize: '64px', color: 'var(--text-light)', marginBottom: '16px' }} />
            <h3>No orders found</h3>
          </div>
        ) : (
          <>
            <div className="card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-light)' }}>
                    <th style={{ padding: '16px', textAlign: 'left' }}>Order #</th>
                    <th style={{ padding: '16px', textAlign: 'left' }}>Restaurant</th>
                    <th style={{ padding: '16px', textAlign: 'left' }}>Customer</th>
                    <th style={{ padding: '16px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Amount</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Commission</th>
                    <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order._id}
                      style={{ borderBottom: '1px solid var(--border-color)' }}
                    >
                      <td style={{ padding: '16px' }}>
                        <strong>#{order.orderNumber}</strong>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div>
                          <strong>{order.restaurant?.name}</strong>
                          <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
                            {order.restaurant?.address?.area}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div>
                          <span>{order.customer?.name}</span>
                          <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
                            {order.customer?.phone}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span className="text-secondary">
                          <FiCalendar style={{ marginRight: '4px' }} />
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <strong>₹{order.totalAmount}</strong>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <span style={{ color: 'var(--success)' }}>
                          ₹{order.platformCommission || 0}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span className={`badge ${getStatusBadge(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <Link 
                          to={`/order/${order._id}`}
                          className="btn btn-sm btn-outline"
                        >
                          <FiEye /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total > pagination.limit && (
              <div className="flex-center gap-2 mt-3">
                <button
                  className="btn btn-outline btn-sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </button>
                <span className="text-secondary">
                  Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                </span>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
