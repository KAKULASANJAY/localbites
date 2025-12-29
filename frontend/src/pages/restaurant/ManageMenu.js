import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiArrowLeft } from 'react-icons/fi';
import { restaurantAPI, foodAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ManageMenu = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    isVeg: true,
    isBestseller: false,
    spiceLevel: 'Medium'
  });

  const categories = [
    'Starters', 'Main Course', 'Breads', 'Rice', 'Biryani', 
    'Chinese', 'Pizza', 'Burger', 'Sandwich', 'Rolls', 
    'Snacks', 'Desserts', 'Beverages', 'Thali', 'Combo', 'Other'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await restaurantAPI.getMyRestaurant();
      setRestaurant(res.data.data);
      setMenuItems(res.data.data.menu || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await foodAPI.update(editingItem._id, {
          ...formData,
          price: Number(formData.price)
        });
        toast.success('Item updated!');
      } else {
        await foodAPI.create({
          ...formData,
          price: Number(formData.price)
        });
        toast.success('Item added!');
      }
      
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      isVeg: item.isVeg,
      isBestseller: item.isBestseller || false,
      spiceLevel: item.spiceLevel || 'Medium'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await foodAPI.delete(id);
      toast.success('Item deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      await foodAPI.toggleAvailability(id);
      fetchData();
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Main Course',
      isVeg: true,
      isBestseller: false,
      spiceLevel: 'Medium'
    });
  };

  // Group items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div className="flex-between mb-3">
          <div className="flex gap-2" style={{ alignItems: 'center' }}>
            <Link to="/restaurant-dashboard" className="btn btn-outline btn-sm">
              <FiArrowLeft />
            </Link>
            <h1>Menu Management</h1>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            <FiPlus /> Add Item
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="card mb-3" style={{ padding: '24px' }}>
            <h3 className="mb-3">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Item Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="e.g., Butter Chicken"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    className="form-input"
                    placeholder="e.g., 250"
                    value={formData.price}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-input form-textarea"
                  placeholder="Brief description of the dish..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="grid grid-3">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    className="form-input form-select"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Spice Level</label>
                  <select
                    name="spiceLevel"
                    className="form-input form-select"
                    value={formData.spiceLevel}
                    onChange={handleChange}
                  >
                    <option value="Mild">Mild</option>
                    <option value="Medium">Medium</option>
                    <option value="Spicy">Spicy</option>
                    <option value="Extra Spicy">Extra Spicy</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <div className="flex gap-3 mt-2">
                    <label className="flex gap-1" style={{ cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="isVeg"
                        checked={formData.isVeg}
                        onChange={() => setFormData({ ...formData, isVeg: true })}
                      />
                      <span className="food-type veg"></span> Veg
                    </label>
                    <label className="flex gap-1" style={{ cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="isVeg"
                        checked={!formData.isVeg}
                        onChange={() => setFormData({ ...formData, isVeg: false })}
                      />
                      <span className="food-type nonveg"></span> Non-Veg
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="flex gap-1" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="isBestseller"
                    checked={formData.isBestseller}
                    onChange={handleChange}
                  />
                  ⭐ Mark as Bestseller
                </label>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Menu Items */}
        {Object.keys(groupedItems).length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🍽️</div>
            <h3>No menu items yet</h3>
            <p className="text-secondary">Add your first menu item to get started</p>
          </div>
        ) : (
          Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="card mb-3" style={{ padding: '24px' }}>
              <h3 className="mb-2">{category} ({items.length})</h3>
              
              {items.map((item) => (
                <div 
                  key={item._id}
                  className="flex-between"
                  style={{ 
                    padding: '16px 0',
                    borderBottom: '1px solid var(--border-color)',
                    opacity: item.isAvailable ? 1 : 0.6
                  }}
                >
                  <div className="flex gap-2" style={{ alignItems: 'flex-start' }}>
                    <span className={`food-type ${item.isVeg ? 'veg' : 'nonveg'}`}></span>
                    <div>
                      <div className="flex gap-1" style={{ alignItems: 'center' }}>
                        <strong>{item.name}</strong>
                        {item.isBestseller && (
                          <span className="badge" style={{ background: '#fff3e0', color: '#e65100', fontSize: '11px' }}>
                            ⭐ Bestseller
                          </span>
                        )}
                        {!item.isAvailable && (
                          <span className="badge badge-danger">Unavailable</span>
                        )}
                      </div>
                      <p className="text-secondary" style={{ fontSize: '13px' }}>
                        {item.description}
                      </p>
                      <strong>₹{item.price}</strong>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      className="btn btn-sm"
                      style={{ background: 'none', color: item.isAvailable ? 'var(--success)' : 'var(--text-secondary)' }}
                      onClick={() => handleToggleAvailability(item._id)}
                      title={item.isAvailable ? 'Mark unavailable' : 'Mark available'}
                    >
                      {item.isAvailable ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ background: 'none', color: 'var(--info)' }}
                      onClick={() => handleEdit(item)}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ background: 'none', color: 'var(--danger)' }}
                      onClick={() => handleDelete(item._id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageMenu;
