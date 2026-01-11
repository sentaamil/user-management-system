import React, { useState, useEffect } from 'react';
import { userAPI } from './services/api';
import UserList from './components/UserList';
import UserForm from './components/UserForm';

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      showNotification('Failed to fetch users', 'error');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.department.toLowerCase().includes(term)
      );
    }

    if (roleFilter !== 'All') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(id);
        setUsers(users.filter(u => u.id !== id));
        showNotification('User deleted successfully');
      } catch (error) {
        showNotification('Failed to delete user', 'error');
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleSubmitUser = async (userData) => {
    try {
      if (editingUser) {
        const response = await userAPI.update(editingUser.id, userData);
        setUsers(users.map(u => u.id === editingUser.id ? response.data : u));
        showNotification('User updated successfully');
      } else {
        const response = await userAPI.create(userData);
        setUsers([...users, response.data]);
        showNotification('User created successfully');
      }
      setShowModal(false);
      setEditingUser(null);
    } catch (error) {
      showNotification(
        error.response?.data?.errors?.[0]?.message || 'Failed to save user',
        'error'
      );
      console.error('Error saving user:', error);
    }
  };

  return (
    <div className="app" data-cy="app">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`} data-cy="notification">
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">👥</span>
              <h1>User Management System</h1>
            </div>
            <button 
              className="btn btn-primary add-user-btn" 
              onClick={handleAddUser}
              data-cy="add-user-btn"
            >
              ➕ Add User
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="filters-section">
        <div className="container">
          <div className="filters-content">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-cy="search-input"
              />
            </div>
            
            <div className="filter-group">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                data-cy="filter-role"
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                data-cy="filter-status"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="results-info">
            <p data-cy="user-count">
              Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
            </p>
          </div>
        </div>
      </div>

      {/* User List */}
      <main className="main-content">
        <div className="container">
          <UserList
            users={filteredUsers}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            loading={loading}
          />
        </div>
      </main>

      {/* User Form Modal */}
      {showModal && (
        <UserForm
          user={editingUser}
          onSubmit={handleSubmitUser}
          onCancel={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
}

export default App;