import React from 'react';
import UserList from './UserList';
import UserForm from './UserForm';
import { useUsers } from '../hooks/useUsers';
import type { UserFormData, UpdateUserFormData, User } from '../types';

const Users: React.FC = () => {
  const {
    users,
    currentView,
    editingUser,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    goToList,
    goToCreate,
    goToEdit
  } = useUsers();

  const handleCreateUser = async (data: UserFormData | UpdateUserFormData) => {
    try {
      await createUser(data as UserFormData);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (data: UserFormData | UpdateUserFormData) => {
    if (!editingUser) return;
    
    try {
      await updateUser(editingUser.id, data as UpdateUserFormData);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = (user: User) => {
    goToEdit(user);
  };

  const handleCancel = () => {
    goToList();
  };

  // Show error if any
  if (error && currentView === 'list') {
    return (
      <div style={{ 
        minHeight: 'calc(100vh - 56px)',
        marginTop: '56px',
        padding: '1rem'
      }}>
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Error:</strong> {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => window.location.reload()}
            aria-label="Close"
          ></button>
          <div className="mt-3">
            <button className="btn btn-outline-primary btn-sm" onClick={() => window.location.reload()}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render based on current view
  switch (currentView) {
    case 'create':
      return (
        <div style={{ 
          minHeight: 'calc(100vh - 56px)',
          marginTop: '56px',
          padding: '1rem'
        }}>
          <UserForm
            onSubmit={handleCreateUser}
            isLoading={isLoading}
            onCancel={handleCancel}
          />
        </div>
      );

    case 'edit':
      return (
        <div style={{ 
          minHeight: 'calc(100vh - 56px)',
          marginTop: '56px',
          padding: '1rem'
        }}>
          <UserForm
            onSubmit={handleUpdateUser}
            initialData={editingUser || undefined}
            isEditing={true}
            isLoading={isLoading}
            onCancel={handleCancel}
          />
        </div>
      );

    case 'list':
    default:
      return (
        <div style={{ 
          minHeight: 'calc(100vh - 56px)',
          marginTop: '56px',
          padding: '1rem'
        }}>
          <UserList
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onCreateNew={goToCreate}
            isLoading={isLoading}
          />
        </div>
      );
  }
};

export default Users; 