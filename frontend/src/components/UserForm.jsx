import React, { useState, useEffect } from 'react';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'User',
    status: 'Active',
    department: '',
    location: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="modal-overlay" data-cy="user-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{user ? 'Edit User' : 'Add New User'}</h2>
          <button className="close-btn" onClick={onCancel} data-cy="close-modal">×</button>
        </div>
        
        <form onSubmit={handleSubmit} data-cy="user-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                data-cy="input-firstName"
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-msg">{errors.firstName}</span>}
            </div>
            
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                data-cy="input-lastName"
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="error-msg">{errors.lastName}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                data-cy="input-email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                data-cy="input-phone"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-msg">{errors.phone}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                data-cy="input-role"
              >
                <option value="User">User</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                data-cy="input-status"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Department *</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                data-cy="input-department"
                className={errors.department ? 'error' : ''}
              />
              {errors.department && <span className="error-msg">{errors.department}</span>}
            </div>
            
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                data-cy="input-location"
                className={errors.location ? 'error' : ''}
              />
              {errors.location && <span className="error-msg">{errors.location}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label>Join Date</label>
            <input
              type="date"
              name="joinDate"
              value={formData.joinDate}
              onChange={handleChange}
              data-cy="input-joinDate"
            />
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" data-cy="submit-user">
              {user ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;