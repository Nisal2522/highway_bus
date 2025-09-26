// User service for API calls
export const userService = {
  // Get user details by ID
  async getUserById(userId) {
    try {
      const response = await fetch(`http://localhost:8081/api/users/${userId}`);
      if (response.ok) {
        const result = await response.json();
        // Return the data object from the response
        return result.data || result;
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  },

  // Get user details by email
  async getUserByEmail(email) {
    try {
      const response = await fetch(`http://localhost:8081/api/users/email/${email}`);
      if (response.ok) {
        const result = await response.json();
        // Return the data object from the response
        return result.data || result;
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  },

  // Update user details
  async updateUser(userId, userData) {
    try {
      const response = await fetch(`http://localhost:8081/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to update user details');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      throw error;
    }
  },

  // Login user
  async login(email, password) {
    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        // Return the data object from the response
        return result.data || result;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await fetch('http://localhost:8081/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        return await response.json();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
};
