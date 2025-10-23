//should i use .env instead?
// API for LCKD - Should i change location to eu-north-1 ???
const API_BASE_URL = 'https://u4bktng7d8.execute-api.us-east-1.amazonaws.com/dev';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response;
};

export const passwordAPI = {
  // Get all passwords
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/passwords`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching passwords:', error);
      throw error;
    }
  },

  // Create a new password
  create: async (passwordData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/passwords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });
      return response;
    } catch (error) {
      console.error('Error creating password:', error);
      throw error;
    }
  },

  // Update a password
  update: async (id, passwordData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/passwords/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });
      return response;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },

  // Delete a password
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/passwords/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      console.error('Error deleting password:', error);
      throw error;
    }
  },
};