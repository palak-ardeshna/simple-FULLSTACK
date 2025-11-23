import apiService from "./api";

// User service for user-related API calls
class UserService {
  // Get all users (optional filters object for any field)
  async getAllUsers(filters = {}) {
    try {
      // Build query parameters from filters object dynamically
      // Example: { role: "user", name: "John", email: "test@example.com" }
      const queryParams = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (
          filters[key] !== null &&
          filters[key] !== undefined &&
          filters[key] !== ""
        ) {
          queryParams.append(key, filters[key]);
        }
      });

      // Build endpoint with query parameters
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/user/all?${queryString}` : "/user/all";

      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const response = await apiService.get(`/user/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  async updateUser(userData) {
    try {
      const response = await apiService.put("/user/update", userData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete user (logged in user)
  async deleteUser() {
    try {
      const response = await apiService.delete("/user/delete");
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete user by ID (admin only)
  async deleteUserById(userId) {
    try {
      const response = await apiService.delete(`/user/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Create and export a single instance
const userService = new UserService();
export default userService;
