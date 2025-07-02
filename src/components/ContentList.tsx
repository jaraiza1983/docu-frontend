import React, { useState } from 'react';
import type { Content, Category } from '../types';
import { mockCategories } from '../data/mockData';

interface ContentListProps {
  content: Content[];
  onEdit: (content: Content) => void;
  onDelete: (contentId: number) => void;
  onView: (content: Content) => void;
  onCreateNew: () => void;
  isLoading?: boolean;
}

const ContentList: React.FC<ContentListProps> = ({ 
  content, 
  onEdit, 
  onDelete, 
  onView, 
  onCreateNew,
  isLoading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Get unique categories
  const categories = mockCategories;
  const statuses = ['draft', 'published', 'archived'];

  // Filter and sort content
  const filteredAndSortedContent = content
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !selectedCategory || item.categoryId?.toString() === selectedCategory;
      const matchesStatus = !selectedStatus || item.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'priority':
          aValue = a.priority || 0;
          bValue = b.priority || 0;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        default:
          aValue = a.priority || 0;
          bValue = b.priority || 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return 'No category';
    return categories.find((cat: Category) => Number(cat.id) === categoryId)?.name || 'No category';
  };

  const getSubcategoryName = (categoryId?: number, subcategoryId?: number) => {
    if (!categoryId || !subcategoryId) return 'No subcategory';
    const category = categories.find((cat: Category) => Number(cat.id) === categoryId);
    return category?.subcategories.find(sub => Number(sub.id) === subcategoryId)?.name || 'No subcategory';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Published';
      case 'draft': return 'Draft';
      case 'archived': return 'Archived';
      default: return 'Unknown';
    }
  };

  const getPriorityBadgeColor = (priority: number) => {
    if (priority >= 80) return 'danger';
    if (priority >= 60) return 'warning';
    if (priority >= 40) return 'info';
    if (priority >= 20) return 'success';
    return 'secondary';
  };

  const getPriorityText = (priority: number) => {
    if (priority >= 80) return 'Critical';
    if (priority >= 60) return 'High';
    if (priority >= 40) return 'Medium';
    if (priority >= 20) return 'Low';
    return 'Very Low';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('');
  };

  const handleDelete = (contentId: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDelete(contentId);
    }
  };

  return (
    <div className="content-list" style={{ marginTop: '56px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h2 style={{ margin: 0, marginBottom: '0.25rem' }}>
            <i className="bi bi-file-text me-2"></i>
            Content Management
          </h2>
          <p style={{ margin: 0, color: '#6c757d' }}>Create and manage your content</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={onCreateNew}
          disabled={isLoading}
        >
          <i className="bi bi-plus-circle me-2"></i>
          New Content
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
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
                placeholder="Search by title, description, or tags..."
              />
            </div>
            
            <div className="col-md-3">
              <label htmlFor="categoryFilter" className="form-label">
                <i className="bi bi-folder me-1"></i>
                Category
              </label>
              <select
                className="form-select"
                id="categoryFilter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-3">
              <label htmlFor="statusFilter" className="form-label">
                <i className="bi bi-flag me-1"></i>
                Status
              </label>
              <select
                className="form-select"
                id="statusFilter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
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
                <option value="createdAt">Date Created</option>
                <option value="updatedAt">Date Updated</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
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
          {filteredAndSortedContent.length} of {content.length} content items
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

      {/* Content Cards */}
      {isLoading && content.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ color: '#6c757d' }}>Loading content...</p>
        </div>
      ) : filteredAndSortedContent.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
          <h5 style={{ color: '#6c757d' }}>No content found</h5>
          <p style={{ color: '#6c757d' }}>No content matches the applied filters.</p>
          <button
            className="btn btn-primary"
            onClick={onCreateNew}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Create New Content
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {filteredAndSortedContent.map(item => (
            <div key={item.id} className="col-md-6 col-lg-4">
              <div className="card h-100 content-card">
                <div className="card-header d-flex justify-content-between align-items-start">
                  <h6 className="card-title mb-0 text-truncate" style={{ maxWidth: '70%' }}>
                    {item.title}
                  </h6>
                  <div className="d-flex flex-column align-items-end">
                    <span className={`badge bg-${getStatusBadgeColor(item.status)} mb-1`}>
                      {getStatusText(item.status)}
                    </span>
                    <span className={`badge bg-${getPriorityBadgeColor(item.priority || 0)}`}>
                      {getPriorityText(item.priority || 0)} ({item.priority || 0})
                    </span>
                  </div>
                </div>
                
                <div className="card-body d-flex flex-column">
                  <div className="content-description mb-3">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: item.description.length > 150 
                          ? item.description.substring(0, 150) + '...' 
                          : item.description 
                      }} 
                    />
                  </div>
                  
                  <div className="mt-auto">
                    <div className="mb-2">
                      <small className="text-muted">
                        <i className="bi bi-folder me-1"></i>
                        {getCategoryName(item.categoryId)} / {getSubcategoryName(item.categoryId, item.subcategoryId)}
                      </small>
                    </div>
                    
                    <div className="mb-2">
                      <small className="text-muted">
                        <i className="bi bi-person me-1"></i>
                        {typeof item.author === 'string' ? item.author : item.author?.name || 'Unknown'} | 
                        <i className="bi bi-calendar me-1"></i>
                        {new Date(item.createdAt).toLocaleDateString('en-US')}
                      </small>
                    </div>
                    
                    {item.tags.length > 0 && (
                      <div className="mb-3">
                        {item.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="badge bg-light text-dark me-1 mb-1 small">
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="badge bg-secondary small">
                            +{item.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm flex-fill"
                        onClick={() => onView(item)}
                        title="View content"
                      >
                        <i className="bi bi-eye me-1"></i>
                        View
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm flex-fill"
                        onClick={() => onEdit(item)}
                        title="Edit content"
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(item.id, item.title)}
                        title="Delete content"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentList; 