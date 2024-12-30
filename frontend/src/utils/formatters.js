export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  // Handle MongoDB date format which comes as { $date: "2024-03-20T12:34:56.789Z" }
  if (typeof dateString === 'object' && dateString.$date) {
    dateString = dateString.$date;
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';  // Return empty string for invalid dates
  
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  // Handle MongoDB date format
  if (typeof dateString === 'object' && dateString.$date) {
    dateString = dateString.$date;
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatAmount = (amount) => {
  if (!amount) return '₹0.00';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}; 