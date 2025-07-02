import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../services/api';
import type { Content, ContentFormData, ApiContent } from '../types';

export type ViewMode = 'list' | 'create' | 'edit' | 'detail' | 'documentation';

interface UseContentManagerReturn {
  content: Content[];
  currentView: ViewMode;
  selectedContent: Content | null;
  editingContent: Content | null;
  isLoading: boolean;
  error: string | null;
  addContent: (data: ContentFormData) => Promise<void>;
  updateContent: (id: number, data: ContentFormData) => Promise<void>;
  deleteContent: (id: number) => Promise<void>;
  setCurrentView: (view: ViewMode) => void;
  selectContent: (content: Content) => void;
  setEditingContent: (content: Content | null) => void;
  goToList: () => void;
  goToCreate: () => void;
  goToEdit: (content: Content) => void;
  goToDetail: (content: Content) => void;
  goToDocumentation: () => void;
  refreshContent: () => Promise<void>;
}

// Helper function to convert API content to local content format
const convertApiContentToLocal = (apiContent: ApiContent): Content => {
  return {
    id: apiContent.id,
    title: apiContent.title,
    description: apiContent.description,
    categoryId: apiContent.categoryId,
    subcategoryId: apiContent.subcategoryId,
    category: apiContent.category,
    subcategory: apiContent.subcategory,
    tags: apiContent.tags,
    status: apiContent.status,
    priority: apiContent.priority,
    authorId: apiContent.authorId,
    lastUpdatedById: apiContent.lastUpdatedById,
    author: apiContent.author,
    lastUpdatedBy: apiContent.lastUpdatedBy,
    createdAt: apiContent.createdAt,
    updatedAt: apiContent.updatedAt
  };
};

// Helper function to convert local content form data to API format
const convertFormDataToApi = (data: ContentFormData) => {
  return {
    title: data.title,
    description: data.description,
    categoryId: data.categoryId,
    subcategoryId: data.subcategoryId,
    tags: data.tags,
    status: data.status,
    priority: data.priority || 0
  };
};

export const useContentManager = (): UseContentManagerReturn => {
  const [content, setContent] = useState<Content[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load content from API on component mount
  useEffect(() => {
    refreshContent();
  }, []);

  const refreshContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const apiContent = await apiClient.getAllContent();
      const convertedContent = apiContent.map(convertApiContentToLocal);
      setContent(convertedContent);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el contenido';
      setError(errorMessage);
      console.error('Error loading content:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addContent = useCallback(async (data: ContentFormData) => {
    console.log('=== ADD CONTENT DEBUG ===');
    console.log('Form data received:', data);
    console.log('Form data type:', typeof data);
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Converting form data to API format...');
      const apiData = convertFormDataToApi(data);
      console.log('API data:', apiData);
      
      console.log('Calling API createContent...');
      const newApiContent = await apiClient.createContent(apiData);
      console.log('API response:', newApiContent);
      
      console.log('Converting API response to local format...');
      const newContent = convertApiContentToLocal(newApiContent);
      console.log('New content:', newContent);
      
      console.log('Updating content state...');
      setContent(prev => {
        console.log('Previous content:', prev);
        const updated = [newContent, ...prev];
        console.log('Updated content:', updated);
        return updated;
      });
      
      console.log('Setting view to list...');
      setCurrentView('list');
      console.log('Content creation completed successfully');
    } catch (err) {
      console.error('=== ADD CONTENT ERROR ===');
      console.error('Error details:', err);
      console.error('Error type:', typeof err);
      console.error('Error instanceof Error:', err instanceof Error);
      
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el contenido';
      setError(errorMessage);
      console.error('Error creating content:', err);
      throw err; // Re-throw to let the form handle the error
    } finally {
      console.log('Setting loading to false...');
      setIsLoading(false);
    }
  }, []);

  const updateContent = useCallback(async (id: number, data: ContentFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const apiData = convertFormDataToApi(data);
      const updatedApiContent = await apiClient.updateContent(id, apiData);
      const updatedContent = convertApiContentToLocal(updatedApiContent);
      
      setContent(prev => prev.map(item => 
        item.id === id ? updatedContent : item
      ));
      setCurrentView('list');
      setEditingContent(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el contenido';
      setError(errorMessage);
      console.error('Error updating content:', err);
      throw err; // Re-throw to let the form handle the error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteContent = useCallback(async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
      setIsLoading(true);
      setError(null);
      
      try {
        await apiClient.deleteContent(id);
        
        setContent(prev => prev.filter(item => item.id !== id));
        if (selectedContent?.id === id) {
          setSelectedContent(null);
        }
        if (editingContent?.id === id) {
          setEditingContent(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el contenido';
        setError(errorMessage);
        console.error('Error deleting content:', err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedContent, editingContent]);

  const selectContent = useCallback((content: Content) => {
    setSelectedContent(content);
  }, []);

  const goToList = useCallback(() => {
    setCurrentView('list');
    setSelectedContent(null);
    setEditingContent(null);
    setError(null);
  }, []);

  const goToCreate = useCallback(() => {
    setCurrentView('create');
    setSelectedContent(null);
    setEditingContent(null);
    setError(null);
  }, []);

  const goToEdit = useCallback((content: Content) => {
    setCurrentView('edit');
    setEditingContent(content);
    setSelectedContent(null);
    setError(null);
  }, []);

  const goToDetail = useCallback((content: Content) => {
    setCurrentView('detail');
    setSelectedContent(content);
    setEditingContent(null);
    setError(null);
  }, []);

  const goToDocumentation = useCallback(() => {
    setCurrentView('documentation');
    setSelectedContent(null);
    setEditingContent(null);
    setError(null);
  }, []);

  return {
    content,
    currentView,
    selectedContent,
    editingContent,
    isLoading,
    error,
    addContent,
    updateContent,
    deleteContent,
    setCurrentView,
    selectContent,
    setEditingContent,
    goToList,
    goToCreate,
    goToEdit,
    goToDetail,
    goToDocumentation,
    refreshContent
  };
}; 