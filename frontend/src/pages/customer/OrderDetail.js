import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPhone, FiMapPin, FiCheck, FiX, FiClock } from 'react-icons/fi';
import { orderAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getById(id);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Order not found');
      navigate('/my-orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await orderAPI.cancel(id, 'Customer requested cancellation');
      toast.success('Order cancelled');
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const orderStatuses = [
    { key: 'placed', label: 'Order Placed', icon: FiClock },
    { key: 'confirmed', label: 'Confirmed', icon: FiCheck },
    { key: 'preparing', label: 'Preparing', icon: FiClock },
    { key: 'ready', label: 'Ready', icon: FiCheck },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: FiClock },
    { key: 'delivered', label: 'Delivered', icon: FiCheck }
  ];

  const getStatusIndex = (status) => {
    return orderStatuses.findIndex(s => s.key === status);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="empty-state">
        <h3>Order not found</h3>
      </div>
    );
  }

  const currentStatusIndex = getStatusIndex(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Order Header */}
        <div className="card mb-3" style={{ padding: '24px' }}>
          <div className="flex-between mb-3">
            <div>
              <h2>Order #{order.orderNumber}</h2>
              <p className="text-secondary">{formatDate(order.createdAt)}</p>
            </div>
            <span className={`order-status-badge ${order.status}`}>
              {order.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Order Timeline */}
          {!isCancelled && (
            <div className="order-timeline">
              {orderStatuses.map((status, index) => {
                const isCompleted = index < currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const StatusIcon = status.icon;

                return (
                  <div 
                    key={status.key} 
                    className={`timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                  >
                    <div className="timeline-icon">
                      {isCompleted ? <FiCheck /> : <StatusIcon />}
                    </div>
                    <div className="timeline-content">
                      <h4>{status.label}</h4>
                      {isCompleted && order[`${status.key}At`] && (
                        <p>{formatDate(order[`${status.key}At`])}</p>
                      )}
                      {isCurrent && <p>In progress...</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {isCancelled && (
            <div className="card" style={{ 
              padding: '16px', 
              background: '#ffebee',
              border: '1px solid #ffcdd2'
            }}>
              <div className="flex gap-2" style={{ alignItems: 'center' }}>
                <FiX style={{ color: 'var(--danger)', fontSize: '24px' }} />
                <div>
                  <strong>Order Cancelled</strong>
                  <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
                    {order.cancelReason || 'Order was cancelled'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Restaurant Info */}
        <div className="card mb-3" style={{ padding: '24px' }}>
          <h3 className="mb-2">Restaurant</h3>
          <div className="flex-between">
            <div>
              <h4>{order.restaurant?.name}</h4>
              <p className="text-secondary" style={{ fontSize: '14px' }}>
                <FiMapPin style={{ marginRight: '4px' }} />
                {order.restaurant?.address?.area}, {order.restaurant?.address?.city}
              </p>
            </div>
            <a 
              href={`tel:${order.restaurant?.phone}`}
              className="btn btn-outline btn-sm"
            >
              <FiPhone /> Call
            </a>
          </div>
        </div>

        {/* Order Items */}
        <div className="card mb-3" style={{ padding: '24px' }}>
          <h3 className="mb-2">Order Items</h3>
          {order.items?.map((item, index) => (
            <div 
              key={index}
              className="flex-between"
              style={{ 
                padding: '12px 0',
                borderBottom: index < order.items.length - 1 ? '1px solid var(--border-color)' : 'none'
              }}
            >
              <div className="flex gap-2" style={{ alignItems: 'center' }}>
                <span>{item.name}</span>
                <span className="text-secondary">× {item.quantity}</span>
              </div>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          
          <div style={{ 
            marginTop: '16px', 
            paddingTop: '16px', 
            borderTop: '2px solid var(--border-color)'
          }}>
            <div className="flex-between mb-1">
              <span>Items Total</span>
              <span>₹{order.itemsTotal}</span>
            </div>
            <div className="flex-between mb-1">
              <span>Delivery Charge</span>
              <span>₹{order.deliveryCharge}</span>
            </div>
            <div className="flex-between" style={{ fontWeight: 600, fontSize: '18px', marginTop: '8px' }}>
              <span>Total Amount</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="card mb-3" style={{ padding: '24px' }}>
          <h3 className="mb-2">Delivery Address</h3>
          <p><strong>{order.deliveryAddress?.name}</strong></p>
          <p>{order.deliveryAddress?.street}</p>
          <p>{order.deliveryAddress?.area}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}</p>
          {order.deliveryAddress?.landmark && (
            <p className="text-secondary">Landmark: {order.deliveryAddress?.landmark}</p>
          )}
          <p className="mt-2">
            <FiPhone style={{ marginRight: '4px' }} />
            {order.deliveryAddress?.phone}
          </p>
        </div>

        {/* Payment Info */}
        <div className="card mb-3" style={{ padding: '24px' }}>
          <h3 className="mb-2">Payment</h3>
          <div className="flex-between">
            <div>
              <p>
                <strong>
                  {order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment'}
                </strong>
              </p>
              <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </div>
            <strong style={{ fontSize: '20px' }}>₹{order.totalAmount}</strong>
          </div>
        </div>

        {/* Actions */}
        {user?.role === 'customer' && ['placed', 'confirmed'].includes(order.status) && (
          <button
            className="btn btn-danger btn-block"
            onClick={handleCancelOrder}
          >
            <FiX /> Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
