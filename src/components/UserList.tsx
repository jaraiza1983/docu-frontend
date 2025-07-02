import React, { useState } from 'react';
import type { User } from '../types';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
  onCreateNew: () => void;
  isLoading?: boolean;
}

const UserList: React.FC<UserListProps> = ({ 
  users, 
  onEdit, 
  onDelete, 
  onCreateNew, 
  isLoading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'creator' | ''>('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filtrar y ordenar usuarios
  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !selectedRole || user.role === selectedRole;
      
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'role':
          aValue = a.role.toLowerCase();
          bValue = b.role.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt || '').getTime();
          bValue = new Date(b.createdAt || '').getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getRoleBadge = (role: string) => {
    const badgeClass = role === 'admin' ? 'bg-danger' : 'bg-success';
    const roleText = role === 'admin' ? 'Admin' : 'Creator';
    
    return (
      <span className={`badge ${badgeClass} text-white`}>
        {roleText}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
  };

  const handleDelete = (userId: number, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      onDelete(userId);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h2 style={{ margin: 0, marginBottom: '0.25rem' }}>
            <i className="bi bi-people me-2"></i>
            User Management
          </h2>
          <p style={{ margin: 0, color: '#6c757d' }}>Manage system users</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={onCreateNew}
          disabled={isLoading}
        >
          <i className="bi bi-person-plus me-2"></i>
          New User
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="searchInput" className="form-label">
                <i className="bi bi-search me-1"></i>
                Search
              </label>
              <input
                type="text"
                className="form-control"
                id="searchInput"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
              />
            </div>
            
            <div className="col-md-4">
              <label htmlFor="roleFilter" className="form-label">
                <i className="bi bi-shield me-1"></i>
                Role
              </label>
              <select
                className="form-select"
                id="roleFilter"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">All roles</option>
                <option value="creator">Creator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="col-md-2">
              <label htmlFor="sortBy" className="form-label">
                <i className="bi bi-sort-down me-1"></i>
                Sort by
              </label>
              <select
                className="form-select"
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="role">Role</option>
                <option value="createdAt">Date Created</option>
              </select>
            </div>
          </div>
          
          <div className="mt-3">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={clearFilters}
            >
              <i className="bi bi-x-circle me-1"></i>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results count and loading */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <small style={{ color: '#6c757d' }}>
          {filteredAndSortedUsers.length} of {users.length} users
        </small>
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <small style={{ color: '#6c757d' }}>Updating...</small>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-body p-0">
          {isLoading && users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p style={{ color: '#6c757d' }}>Loading users...</p>
            </div>
          ) : filteredAndSortedUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <i className="bi bi-people-x fs-1 text-muted mb-3"></i>
              <h5 style={{ color: '#6c757d' }}>No users found</h5>
              <p style={{ color: '#6c757d' }}>No users match the applied filters.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Date Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <i className="bi bi-person-circle text-primary"></i>
                          </div>
                          <div>
                            <div className="fw-semibold">{user.name}</div>
                            <small className="text-muted">ID: {user.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-envelope text-muted me-2"></i>
                          {user.email}
                        </div>
                      </td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>
                        <small className="text-muted">
                          {formatDate(user.createdAt)}
                        </small>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => onEdit(user)}
                            title="Edit user"
                            disabled={isLoading}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(user.id, user.name)}
                            title="Delete user"
                            disabled={isLoading}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList; 