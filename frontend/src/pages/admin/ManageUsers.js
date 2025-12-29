import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiArrowLeft, FiSearch, FiUser, FiPhone, FiMail, 
  FiToggleLeft, FiToggleRight, FiShield 
} from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterRole !== 'all') params.role = filterRole;
      
      const response = await adminAPI.getAllUsers(params);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      await adminAPI.toggleUserActive(userId);
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone?.includes(searchQuery)
  );

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'badge-danger';
      case 'restaurant': return 'badge-primary';
      case 'delivery': return 'badge-warning';
      default: return 'badge-success';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const roleCounts = {
    all: users.length,
    customer: users.filter(u => u.role === 'customer').length,
    restaurant: users.filter(u => u.role === 'restaurant').length,
    admin: users.filter(u => u.role === 'admin').length
  };

  return (
    <div className="section">
      <div className="container">
        <div className="flex gap-2 mb-3" style={{ alignItems: 'center' }}>
          <Link to="/admin" className="btn btn-outline btn-sm">
            <FiArrowLeft />
          </Link>
          <h1>Manage Users</h1>
        </div>

        {/* Filters */}
        <div className="card mb-3" style={{ padding: '16px' }}>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            <div className="search-box" style={{ flex: '1', minWidth: '250px' }}>
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="form-input"
              style={{ width: 'auto' }}
            >
              <option value="all">All Roles ({roleCounts.all})</option>
              <option value="customer">Customers ({roleCounts.customer})</option>
              <option value="restaurant">Restaurants ({roleCounts.restaurant})</option>
              <option value="admin">Admins ({roleCounts.admin})</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-4 mb-3">
          {Object.entries(roleCounts).map(([role, count]) => (
            <div 
              key={role}
              className={`card ${filterRole === role ? 'active' : ''}`}
              style={{ 
                padding: '16px', 
                textAlign: 'center',
                cursor: 'pointer',
                border: filterRole === role ? '2px solid var(--primary)' : undefined
              }}
              onClick={() => setFilterRole(role)}
            >
              <h2 style={{ color: 'var(--primary)' }}>{count}</h2>
              <p className="text-secondary" style={{ textTransform: 'capitalize' }}>
                {role === 'all' ? 'Total Users' : `${role}s`}
              </p>
            </div>
          ))}
        </div>

        {/* Users List */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <FiUser style={{ fontSize: '64px', color: 'var(--text-light)', marginBottom: '16px' }} />
            <h3>No users found</h3>
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-light)' }}>
                  <th style={{ padding: '16px', textAlign: 'left' }}>User</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Contact</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Role</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Joined</th>
                  <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr 
                    key={user._id}
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                  >
                    <td style={{ padding: '16px' }}>
                      <div className="flex gap-2" style={{ alignItems: 'center' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'var(--primary)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold'
                        }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{user.name}</strong>
                          {user.role === 'admin' && (
                            <FiShield style={{ marginLeft: '6px', color: 'var(--danger)' }} />
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '14px' }}>
                        <div className="flex gap-1" style={{ alignItems: 'center', marginBottom: '4px' }}>
                          <FiMail style={{ color: 'var(--text-light)' }} />
                          {user.email}
                        </div>
                        <div className="flex gap-1" style={{ alignItems: 'center' }}>
                          <FiPhone style={{ color: 'var(--text-light)' }} />
                          {user.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span className="text-secondary">{formatDate(user.createdAt)}</span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      {user.role !== 'admin' && (
                        <button
                          className={`btn btn-sm ${user.isActive ? 'btn-outline' : 'btn-primary'}`}
                          onClick={() => handleToggleActive(user._id)}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? (
                            <>
                              <FiToggleRight /> Deactivate
                            </>
                          ) : (
                            <>
                              <FiToggleLeft /> Activate
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
