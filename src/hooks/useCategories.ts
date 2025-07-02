import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import type { Category, Subcategory } from '../services/api';
import { mockCategories } from '../data/mockData';

export interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch public categories (includes subcategories)
      const categoriesData = await apiClient.getPublicCategories();
      console.log('=== API CATEGORIES ===', categoriesData);
      
      // The API now returns categories with subcategories included
      const categoriesWithSubcategories = categoriesData.map(category => ({
        ...category,
        subcategories: category.subcategories || []
      }));
      
      console.log('=== FINAL CATEGORIES WITH SUBCATEGORIES ===', categoriesWithSubcategories);
      setCategories(categoriesWithSubcategories);
    } catch (err) {
      console.error('Error loading categories from API, falling back to mock data:', err);
      // Fallback to mock data if API fails
      const mockCategoriesWithSubcategories = mockCategories.map(category => ({
        id: Number(category.id),
        name: category.name,
        description: '',
        isActive: true,
        priority: category.priority || 0,
        subcategories: category.subcategories.map(sub => ({
          id: Number(sub.id),
          name: sub.name,
          description: '',
          categoryId: Number(category.id),
          isActive: true,
          priority: sub.priority || 0
        }))
      }));
      console.log('=== USING MOCK DATA ===', mockCategoriesWithSubcategories);
      setCategories(mockCategoriesWithSubcategories);
      setError(null); // Clear error since we're using fallback
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryById = (id: number): CategoryWithSubcategories | undefined => {
    return categories.find(cat => cat.id === id);
  };

  const getSubcategoryById = (categoryId: number, subcategoryId: number): Subcategory | undefined => {
    const category = getCategoryById(categoryId);
    return category?.subcategories.find(sub => sub.id === subcategoryId);
  };

  const getSubcategoriesByCategory = (categoryId: number): Subcategory[] => {
    const category = getCategoryById(categoryId);
    return category?.subcategories || [];
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
    loadCategories,
    getCategoryById,
    getSubcategoryById,
    getSubcategoriesByCategory
  };
}; 