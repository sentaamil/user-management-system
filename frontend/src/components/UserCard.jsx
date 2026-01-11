import React from 'react';

const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <div 
      className="user-card" 
      data-cy="user-card"
      data-user-id={user.id}
    >
      <div className="user-card-header">
        <div className="user-avatar">
          {user.firstName[0]}{user.lastName[0]}
        </div>
        <div className="user-info">
          <h3 data-cy="user-name">{user.firstName} {user.lastName}</h3>
          <p className="user-email" data-cy="user-email">{user.email}</p>
        </div>
        <span className={`status-badge ${user.status.toLowerCase()}`} data-cy="user-status">
          {user.status}
        </span>
      </div>
      
      <div className="user-card-body">
        <div className="user-detail">
          <span className="detail-label">Role:</span>
          <span className="detail-value" data-cy="user-role">{user.role}</span>
        </div>
        <div className="user-detail">
          <span className="detail-label">Department:</span>
          <span className="detail-value" data-cy="user-department">{user.department}</span>
        </div>
        <div className="user-detail">
          <span className="detail-label">Phone:</span>
          <span className="detail-value">{user.phone}</span>
        </div>
        <div className="user-detail">
          <span className="detail-label">Location:</span>
          <span className="detail-value">{user.location}</span>
        </div>
        <div className="user-detail">
          <span className="detail-label">Join Date:</span>
          <span className="detail-value">{user.joinDate}</span>
        </div>
      </div>
      
      <div className="user-card-footer">
        <button 
          className="btn btn-edit" 
          onClick={() => onEdit(user)}
          data-cy="edit-user-btn"
        >
          ✏️ Edit
        </button>
        <button 
          className="btn btn-delete" 
          onClick={() => onDelete(user.id)}
          data-cy="delete-user-btn"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;