import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPhone, FiCheck, FiX, FiClock } from 'react-icons/fi';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [statusCounts, setStatusCounts] = useState({});

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let status = '';
      if (activeTab === 'pending') status = 'placed';
      else if (activeTab === 'preparing') status = 'preparing';
      else if (activeTab === 'ready') status = 'ready';
      else if (activeTab === 'completed') status = 'delivered';

      const response = await orderAPI.getRestaurantOrders({ 
        status: status || undefined,
        limit: 50 
      });
      setOrders(response.data.data);
      
      // Update status counts
      const counts = {};
      response.data.statusCounts?.forEach(s => {
        counts[s._id] = s.count;
      });
      setStatusCounts(counts);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
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

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'placed': 'confirmed',
      'confirmed': 'preparing',
      'preparing': 'ready',
      'ready': 'out_for_delivery',
      'out_for_delivery': 'delivered'
    };
    return statusFlow[currentStatus];
  };

  const getStatusLabel = (status) => {
    const labels = {
      'placed': 'Accept Order',
      'confirmed': 'Start Preparing',
      'preparing': 'Mark Ready',
      'ready': 'Out for Delivery',
      'out_for_delivery': 'Mark Delivered'
    };
    return labels[status] || status;
  };

  const tabs = [
    { key: 'pending', label: 'New Orders', count: (statusCounts['placed'] || 0) + (statusCounts['confirmed'] || 0) },
    { key: 'preparing', label: 'Preparing', count: statusCounts['preparing'] || 0 },
    { key: 'ready', label: 'Ready', count: (statusCounts['ready'] || 0) + (statusCounts['out_for_delivery'] || 0) },
    { key: 'completed', label: 'Completed', count: statusCounts['delivered'] || 0 },
    { key: 'all', label: 'All Orders', count: null }
  ];

  return (
    <div className="section">
      <div className="container">
        <div className="flex gap-2 mb-3" style={{ alignItems: 'center' }}>
          <Link to="/restaurant-dashboard" className="btn btn-outline btn-sm">
            <FiArrowLeft />
          </Link>
          <h1>Orders</h1>
        </div>

        {/* Tabs */}
        <div className="menu-filters mb-3" style={{ overflowX: 'auto' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`menu-filter-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span className="badge badge-primary" style={{ marginLeft: '6px', padding: '2px 8px' }}>
                  {tab.count}
                </span>
              )}
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
            <FiClock style={{ fontSize: '64px', color: 'var(--text-light)', marginBottom: '16px' }} />
            <h3>No orders found</h3>
            <p className="text-secondary">Orders will appear here when customers place them</p>
          </div>
        ) : (
          <div className="grid" style={{ gap: '16px' }}>
            {orders.map((order) => (
              <div key={order._id} className="card" style={{ padding: '20px' }}>
                {/* Order Header */}
                <div className="flex-between mb-2">
                  <div>
                    <div className="flex gap-2" style={{ alignItems: 'center' }}>
                      <h4>#{order.orderNumber}</h4>
                      <span className={`order-status-badge ${order.status}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-secondary" style={{ fontSize: '13px' }}>
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <strong style={{ fontSize: '20px' }}>₹{order.totalAmount}</strong>
                </div>

                {/* Customer Info */}
                <div className="flex-between" style={{ 
                  padding: '12px',
                  background: 'var(--bg-light)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '12px'
                }}>
                  <div>
                    <strong>{order.customer?.name}</strong>
                    <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
                      {order.deliveryAddress?.street}, {order.deliveryAddress?.area}
                    </p>
                  </div>
                  <a 
                    href={`tel:${order.customer?.phone}`}
                    className="btn btn-outline btn-sm"
                  >
                    <FiPhone /> Call
                  </a>
                </div>

                {/* Order Items */}
                <div style={{ marginBottom: '16px' }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex-between" style={{ padding: '4px 0' }}>
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Special Instructions */}
                {order.specialInstructions && (
                  <div style={{ 
                    padding: '12px',
                    background: '#fff3e0',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '12px',
                    fontSize: '14px'
                  }}>
                    <strong>Note:</strong> {order.specialInstructions}
                  </div>
                )}

                {/* Actions */}
                {!['delivered', 'cancelled'].includes(order.status) && (
                  <div className="flex gap-2">
                    <button
                      className="btn btn-primary flex-1"
                      onClick={() => updateStatus(order._id, getNextStatus(order.status))}
                    >
                      <FiCheck /> {getStatusLabel(order.status)}
                    </button>
                    {order.status === 'placed' && (
                      <button
                        className="btn btn-danger"
                        onClick={() => updateStatus(order._id, 'cancelled')}
                      >
                        <FiX /> Reject
                      </button>
                    )}
                  </div>
                )}

                <Link 
                  to={`/order/${order._id}`}
                  className="btn btn-outline btn-sm btn-block mt-2"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantOrders;
