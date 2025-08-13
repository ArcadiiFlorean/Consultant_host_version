// hooks/useDocuments.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useDocuments = (isAdmin = false) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const API_BASE = isAdmin ? '/documents_admin_api.php' : '/documents_public_api.php';

  // Load documents
  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(API_BASE);
      if (response.data.success) {
        setDocuments(response.data.data);
      } else {
        setError(response.data.error || 'Eroare la încărcarea documentelor');
      }
    } catch (err) {
      setError('Eroare de conexiune la încărcarea documentelor');
      console.error('Load documents error:', err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  // Upload document (doar pentru admin)
  const uploadDocument = useCallback(async (file, formData) => {
    if (!isAdmin) {
      throw new Error('Upload disponibil doar pentru admin');
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    const uploadData = new FormData();
    uploadData.append('document', file);
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description || '');
    uploadData.append('category', formData.category || 'general');
    uploadData.append('is_featured', formData.is_featured ? 'true' : 'false');

    try {
      const response = await axios.post(API_BASE, uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      if (response.data.success) {
        await loadDocuments(); // Reîncarcă lista
        return response.data;
      } else {
        throw new Error(response.data.error || 'Eroare la încărcarea documentului');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Eroare de conexiune';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [API_BASE, isAdmin, loadDocuments]);

  // Delete document (doar pentru admin)
  const deleteDocument = useCallback(async (id) => {
    if (!isAdmin) {
      throw new Error('Ștergere disponibilă doar pentru admin');
    }

    setError(null);
    
    try {
      const response = await axios.delete(`${API_BASE}?id=${id}`);
      if (response.data.success) {
        await loadDocuments(); // Reîncarcă lista
        return response.data;
      } else {
        throw new Error(response.data.error || 'Eroare la ștergerea documentului');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Eroare de conexiune';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [API_BASE, isAdmin, loadDocuments]);

  // Update document (doar pentru admin)
  const updateDocument = useCallback(async (id, updatedData) => {
    if (!isAdmin) {
      throw new Error('Actualizare disponibilă doar pentru admin');
    }

    setError(null);
    
    try {
      const response = await axios.put(`${API_BASE}?id=${id}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        await loadDocuments(); // Reîncarcă lista
        return response.data;
      } else {
        throw new Error(response.data.error || 'Eroare la actualizarea documentului');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Eroare de conexiune';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [API_BASE, isAdmin, loadDocuments]);

  // Download document
  const downloadDocument = useCallback((id, title) => {
    try {
      // Log pentru analytics (opțional)
      console.log(`Downloading document: ${title} (ID: ${id})`);
      
      // Deschide link-ul de descărcare
      window.open(`${API_BASE}?download=1&id=${id}`, '_blank');
    } catch (err) {
      console.error('Download error:', err);
      setError('Eroare la descărcarea documentului');
    }
  }, [API_BASE]);

  // Filter și sort utilities
  const filterDocuments = useCallback((documents, filters) => {
    let filtered = [...documents];

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(doc => doc.category === filters.category);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(term) ||
        (doc.description && doc.description.toLowerCase().includes(term))
      );
    }

    // Filter by featured (admin)
    if (filters.featuredOnly) {
      filtered = filtered.filter(doc => doc.is_featured);
    }

    // Sort: featured first, then by date
    filtered.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return filtered;
  }, []);

  // Get statistics (admin)
  const getStatistics = useCallback(() => {
    if (!documents.length) {
      return {
        total: 0,
        featured: 0,
        totalDownloads: 0,
        byCategory: {},
        recentUploads: 0
      };
    }

    const featured = documents.filter(doc => doc.is_featured).length;
    const totalDownloads = documents.reduce((sum, doc) => sum + doc.downloads_count, 0);
    
    // Group by category
    const byCategory = documents.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {});

    // Recent uploads (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUploads = documents.filter(doc => 
      new Date(doc.created_at) > sevenDaysAgo
    ).length;

    return {
      total: documents.length,
      featured,
      totalDownloads,
      byCategory,
      recentUploads
    };
  }, [documents]);

  // Validate file before upload
  const validateFile = useCallback((file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipul de fișier nu este permis. Folosește PDF, Word, Excel, text sau imagini.'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Fișierul este prea mare. Dimensiunea maximă este 10MB.'
      };
    }

    return { valid: true };
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes) => {
    if (bytes >= 1073741824) {
      return (bytes / 1073741824).toFixed(2) + ' GB';
    } else if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(2) + ' MB';
    } else if (bytes >= 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return bytes + ' bytes';
    }
  }, []);

  // Get document icon helpers
  const getDocumentIcon = useCallback((fileType) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
    if (fileType.includes('image')) return '🖼️';
    return '📋';
  }, []);

  const getDocumentIconColor = useCallback((fileType) => {
    if (fileType.includes('pdf')) return 'from-red-400 to-red-600';
    if (fileType.includes('word') || fileType.includes('document')) return 'from-blue-400 to-blue-600';
    if (fileType.includes('excel') || fileType.includes('sheet')) return 'from-green-400 to-green-600';
    if (fileType.includes('image')) return 'from-yellow-400 to-yellow-600';
    return 'from-gray-400 to-gray-600';
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial load
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  return {
    // State
    documents,
    loading,
    error,
    uploading,
    uploadProgress,

    // Actions
    loadDocuments,
    uploadDocument,
    deleteDocument,
    updateDocument,
    downloadDocument,
    clearError,

    // Utilities
    filterDocuments,
    getStatistics,
    validateFile,
    formatFileSize,
    getDocumentIcon,
    getDocumentIconColor
  };
};

export default useDocuments;