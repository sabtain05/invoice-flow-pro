/**
 * Format currency based on user's currency preference
 */
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  /**
   * Format date to readable string
   */
  export const formatDate = (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    
    return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
  };
  
  /**
   * Format date for input fields (YYYY-MM-DD)
   */
  export const formatDateForInput = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };
  
  /**
   * Calculate due date based on payment terms
   */
  export const calculateDueDate = (issueDate, paymentTerms = 30) => {
    const date = new Date(issueDate);
    date.setDate(date.getDate() + paymentTerms);
    return date;
  };
  
  /**
   * Format file size to readable format
   */
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  /**
   * Truncate text with ellipsis
   */
  export const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  /**
   * Generate random color for avatars
   */
  export const getRandomColor = () => {
    const colors = [
      '#0ea5e9', '#0284c7', '#0369a1', '#075985',
      '#22c55e', '#16a34a', '#15803d', '#166534',
      '#f59e0b', '#d97706', '#b45309', '#92400e',
      '#ef4444', '#dc2626', '#b91c1c', '#991b1b',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  /**
   * Get initials from name
   */
  export const getInitials = (name) => {
    if (!name) return 'U';
    
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };