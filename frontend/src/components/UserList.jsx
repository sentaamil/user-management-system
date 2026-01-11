import React from 'react';
import UserCard from './UserCard';

const UserList = ({ users, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="empty-state" data-cy="empty-state">
        <div className="empty-icon">📭</div>
        <h3>No Users Found</h3>
        <p>No users match your search criteria. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="user-grid" data-cy="user-list">
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default UserList;