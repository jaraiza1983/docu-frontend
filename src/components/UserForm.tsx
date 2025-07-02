import React, { useState, useEffect } from 'react';
import type { UserFormData, UpdateUserFormData, User } from '../types';

interface UserFormProps {
  onSubmit: (data: UserFormData | UpdateUserFormData) => void;
  initialData?: User;
  isEditing?: boolean;
  isLoading?: boolean;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ 
  onSubmit, 
  initialData, 
  isEditing = false, 
  isLoading = false,
  onCancel 
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: 'creator'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when editing
  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        password: '', // Don't populate password when editing
        role: initialData.role
      });
    }
  }, [initialData, isEditing]);

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is not valid';
    }

    if (!isEditing && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.trim() && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isEditing && initialData) {
      // For editing, only include fields that have values
      const updateData: UpdateUserFormData = {};
      
      if (formData.name !== initialData.name) {
        updateData.name = formData.name;
      }
      
      if (formData.email !== initialData.email) {
        updateData.email = formData.email;
      }
      
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }
      
      if (formData.role !== initialData.role) {
        updateData.role = formData.role;
      }

      onSubmit(updateData);
    } else {
      // For creating, submit all form data
      onSubmit(formData);
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
            <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-person-plus'} me-2`}></i>
            {isEditing ? 'Edit User' : 'New User'}
          </h2>
          <p style={{ margin: 0, color: '#6c757d' }}>
            {isEditing ? 'Modify user information' : 'Create a new user in the system'}
          </p>
        </div>
        <button
          className="btn btn-outline-secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Cancel
        </button>
      </div>

      {/* Form */}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Name */}
              <div className="col-md-6">
                <label htmlFor="name" className="form-label">
                  <i className="bi bi-person me-1"></i>
                  Full Name *
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                  disabled={isLoading}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              {/* Email */}
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">
                  <i className="bi bi-envelope me-1"></i>
                  Email *
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="user@example.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              {/* Password */}
              <div className="col-md-6">
                <label htmlFor="password" className="form-label">
                  <i className="bi bi-lock me-1"></i>
                  Password {!isEditing && '*'}
                </label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder={isEditing ? "Leave empty to keep current" : "Minimum 6 characters"}
                  disabled={isLoading}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
                <div className="form-text">
                  {isEditing ? 'Leave empty to keep current password' : 'Minimum 6 characters'}
                </div>
              </div>

              {/* Role */}
              <div className="col-md-6">
                <label htmlFor="role" className="form-label">
                  <i className="bi bi-shield me-1"></i>
                  Role *
                </label>
                <select
                  className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">Select a role</option>
                  <option value="creator">Creator</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <div className="invalid-feedback">{errors.role}</div>
                )}
                <div className="form-text">
                  <strong>Creator:</strong> Can create and edit content<br />
                  <strong>Admin:</strong> Full system access
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <i className={`bi ${isEditing ? 'bi-check-circle' : 'bi-person-plus'} me-2`}></i>
                    {isEditing ? 'Update User' : 'Create User'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tips */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card bg-light">
            <div className="card-body">
              <h6 className="card-title">
                <i className="bi bi-lightbulb me-1"></i>
                User tips
              </h6>
              <ul style={{ margin: 0, fontSize: '0.875rem' }}>
                <li>Use real and complete names</li>
                <li>Unique and valid emails</li>
                <li>Secure passwords (minimum 6 characters)</li>
                <li>Assign roles based on responsibilities</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card bg-light">
            <div className="card-body">
              <h6 className="card-title">
                <i className="bi bi-gear me-1"></i>
                System roles
              </h6>
              <ul style={{ margin: 0, fontSize: '0.875rem' }}>
                <li><strong>Creator:</strong> Create and edit content</li>
                <li><strong>Admin:</strong> Complete system management</li>
                <li>Admins can manage users</li>
                <li>Creators can only create content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm; 