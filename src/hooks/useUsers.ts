import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../services/api';
import type { User, UserFormData, UpdateUserFormData, UserListState } from '../types';

export type UserViewMode = 'list' | 'create' | 'edit';

interface UseUsersReturn {
  users: User[];
  currentView: UserViewMode;
  selectedUser: User | null;
  editingUser: User | null;
  isLoading: boolean;
  error: string | null;
  createUser: (data: UserFormData) => Promise<void>;
  updateUser: (id: number, data: UpdateUserFormData) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  setCurrentView: (view: UserViewMode) => void;
  selectUser: (user: User) => void;
  setEditingUser: (user: User | null) => void;
  goToList: () => void;
  goToCreate: () => void;
  goToEdit: (user: User) => void;
  refreshUsers: () => Promise<void>;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentView, setCurrentView] = useState<UserViewMode>('list');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load users from API on component mount
  useEffect(() => {
    refreshUsers();
  }, []);

  const refreshUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const apiUsers = await apiClient.getAllUsers();
      setUsers(apiUsers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar usuarios';
      setError(errorMessage);
      console.error('Error loading users:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: UserFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.createUser(data);
      await refreshUsers();
      setCurrentView('list');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear usuario';
      setError(errorMessage);
      console.error('Error creating user:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshUsers]);

  const updateUser = useCallback(async (id: number, data: UpdateUserFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.updateUser(id, data);
      await refreshUsers();
      setCurrentView('list');
      setEditingUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar usuario';
      setError(errorMessage);
      console.error('Error updating user:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshUsers]);

  const deleteUser = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.deleteUser(id);
      await refreshUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar usuario';
      setError(errorMessage);
      console.error('Error deleting user:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshUsers]);

  const selectUser = useCallback((user: User) => {
    setSelectedUser(user);
  }, []);

  const goToList = useCallback(() => {
    setCurrentView('list');
    setSelectedUser(null);
    setEditingUser(null);
  }, []);

  const goToCreate = useCallback(() => {
    setCurrentView('create');
    setSelectedUser(null);
    setEditingUser(null);
  }, []);

  const goToEdit = useCallback((user: User) => {
    setCurrentView('edit');
    setEditingUser(user);
    setSelectedUser(null);
  }, []);

  return {
    users,
    currentView,
    selectedUser,
    editingUser,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    setCurrentView,
    selectUser,
    setEditingUser,
    goToList,
    goToCreate,
    goToEdit,
    refreshUsers
  };
}; 