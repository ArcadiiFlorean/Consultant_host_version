// utils/documentUtils.js

export const DOCUMENT_CATEGORIES = [
  { value: 'general', label: 'General', icon: '📋', color: 'gray' },
  { value: 'ghiduri', label: 'Ghiduri', icon: '📖', color: 'blue' },
  { value: 'formulare', label: 'Formulare', icon: '📝', color: 'green' },
  { value: 'resurse', label: 'Resurse', icon: '💎', color: 'purple' },
  { value: 'exercitii', label: 'Exerciții', icon: '🏃‍♀️', color: 'pink' },
  { value: 'planuri', label: 'Planuri Alimentare', icon: '🍽️', color: 'yellow' }
];

export const ALLOWED_FILE_TYPES = [
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

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const FILE_TYPE_INFO = {
  'application/pdf': {
    icon: '📄',
    name: 'PDF',
    color: 'red',
    bgClass: 'bg-red-500',
    gradientClass: 'from-red-400 to-red-600'
  },
  'application/msword': {
    icon: '📝',
    name: 'Word',
    color: 'blue',
    bgClass: 'bg-blue-500',
    gradientClass: 'from-blue-400 to-blue-600'
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    icon: '📝',
    name: 'Word',
    color: 'blue',
    bgClass: 'bg-blue-500',
    gradientClass: 'from-blue-400 to-blue-600'
  },
  'application/vnd.ms-excel': {
    icon: '📊',
    name: 'Excel',
    color: 'green',
    bgClass: 'bg-green-500',
    gradientClass: 'from-green-400 to-green-600'
  },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    icon: '📊',
    name: 'Excel',
    color: 'green',
    bgClass: 'bg-green-500',
    gradientClass: 'from-green-400 to-green-600'
  },
  'text/plain': {
    icon: '📄',
    name: 'Text',
    color: 'gray',
    bgClass: 'bg-gray-500',
    gradientClass: 'from-gray-400 to-gray-600'
  },
  'image/jpeg': {
    icon: '🖼️',
    name: 'Imagine',
    color: 'yellow',
    bgClass: 'bg-yellow-500',
    gradientClass: 'from-yellow-400 to-yellow-600'
  },
  'image/png': {
    icon: '🖼️',
    name: 'Imagine',
    color: 'yellow',
    bgClass: 'bg-yellow-500',
    gradientClass: 'from-yellow-400 to-yellow-600'
  },
  'image/gif': {
    icon: '🖼️',
    name: 'Imagine',
    color: 'yellow',
    bgClass: 'bg-yellow-500',
    gradientClass: 'from-yellow-400 to-yellow-600'
  },
  'image/webp': {
    icon: '🖼️',
    name: 'Imagine',
    color: 'yellow',
    bgClass: 'bg-yellow-500',
    gradientClass: 'from-yellow-400 to-yellow-600'
  }
};

/**
 * Validează un fișier pentru upload
 */
export const validateFile = (file) => {
  if (!file) {
    return {
      valid: false,
      error: 'Nu a fost selectat niciun fișier'
    };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipul de fișier nu este permis. Folosește PDF, Word, Excel, text sau imagini.'
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Fișierul este prea mare. Dimensiunea maximă este ${formatFileSize(MAX_FILE_SIZE)}.`
    };
  }

  return { valid: true };
};

/**
 * Formatează dimensiunea unui fișier
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 bytes';
  
  const k = 1024;
  const sizes = ['bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Obține informații despre tipul de fișier
 */
export const getFileTypeInfo = (mimeType) => {
  return FILE_TYPE_INFO[mimeType] || {
    icon: '📋',
    name: 'Document',
    color: 'gray',
    bgClass: 'bg-gray-500',
    gradientClass: 'from-gray-400 to-gray-600'
  };
};

/**
 * Obține informații despre categorie
 */
export const getCategoryInfo = (categoryValue) => {
  return DOCUMENT_CATEGORIES.find(cat => cat.value === categoryValue) || {
    value: categoryValue,
    label: categoryValue,
    icon: '📋',
    color: 'gray'
  };
};

/**
 * Generează un nume de fișier safe pentru URL
 */
export const generateSafeFilename = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  
  return `doc_${timestamp}_${randomString}.${extension}`;
};

/**
 * Sortează documentele (featured primul, apoi după dată)
 */
export const sortDocuments = (documents) => {
  return [...documents].sort((a, b) => {
    // Featured documents first
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    
    // Then by creation date (newest first)
    return new Date(b.created_at) - new Date(a.created_at);
  });
};

/**
 * Filtrează documentele
 */
export const filterDocuments = (documents, filters = {}) => {
  let filtered = [...documents];

  // Filter by category
  if (filters.category && filters.category !== '') {
    filtered = filtered.filter(doc => doc.category === filters.category);
  }

  // Filter by search term
  if (filters.searchTerm && filters.searchTerm.trim() !== '') {
    const term = filters.searchTerm.toLowerCase().trim();
    filtered = filtered.filter(doc => 
      doc.title.toLowerCase().includes(term) ||
      (doc.description && doc.description.toLowerCase().includes(term)) ||
      doc.original_filename.toLowerCase().includes(term)
    );
  }

  // Filter by featured status
  if (filters.featuredOnly) {
    filtered = filtered.filter(doc => doc.is_featured);
  }

  // Filter by status (admin only)
  if (filters.status) {
    filtered = filtered.filter(doc => doc.status === filters.status);
  }

  return sortDocuments(filtered);
};

/**
 * Calculează statistici pentru documente
 */
export const calculateDocumentStats = (documents) => {
  if (!documents || documents.length === 0) {
    return {
      total: 0,
      featured: 0,
      totalDownloads: 0,
      byCategory: {},
      byFileType: {},
      recentUploads: 0,
      averageSize: 0
    };
  }

  const featured = documents.filter(doc => doc.is_featured).length;
  const totalDownloads = documents.reduce((sum, doc) => sum + (doc.downloads_count || 0), 0);
  
  // Group by category
  const byCategory = documents.reduce((acc, doc) => {
    const category = doc.category || 'general';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // Group by file type
  const byFileType = documents.reduce((acc, doc) => {
    const typeInfo = getFileTypeInfo(doc.file_type);
    const typeName = typeInfo.name;
    acc[typeName] = (acc[typeName] || 0) + 1;
    return acc;
  }, {});

  // Recent uploads (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentUploads = documents.filter(doc => 
    new Date(doc.created_at) > sevenDaysAgo
  ).length;

  // Average file size
  const totalSize = documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0);
  const averageSize = documents.length > 0 ? totalSize / documents.length : 0;

  return {
    total: documents.length,
    featured,
    totalDownloads,
    byCategory,
    byFileType,
    recentUploads,
    averageSize: formatFileSize(averageSize)
  };
};

/**
 * Obține culoarea pentru categoria documentului
 */
export const getCategoryColor = (category) => {
  const categoryInfo = getCategoryInfo(category);
  
  const colorMap = {
    gray: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800',
    yellow: 'bg-yellow-100 text-yellow-800'
  };
  
  return colorMap[categoryInfo.color] || colorMap.gray;
};

/**
 * Validează datele formularului pentru document
 */
export const validateDocumentForm = (formData, file) => {
  const errors = {};

  if (!formData.title || formData.title.trim().length < 3) {
    errors.title = 'Titlul trebuie să aibă cel puțin 3 caractere';
  }

  if (formData.title && formData.title.length > 255) {
    errors.title = 'Titlul nu poate avea mai mult de 255 de caractere';
  }

  if (formData.description && formData.description.length > 1000) {
    errors.description = 'Descrierea nu poate avea mai mult de 1000 de caractere';
  }

  if (!formData.category) {
    errors.category = 'Categoria este obligatorie';
  }

  if (file) {
    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      errors.file = fileValidation.error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Debounce function pentru search
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Escape HTML pentru prevni XSS
 */
export const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, function(m) { 
    return map[m]; 
  });
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};