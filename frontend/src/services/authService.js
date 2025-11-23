import apiService from "./api";

// Global singleton pattern to prevent duplicate API calls
let getCurrentUserInProgress = false;
let getCurrentUserPromise = null;

// Authentication Service
class AuthService {
  // Register new user
  async register(userData) {
    try {
      const response = await apiService.post("/auth/register", userData);

      // Handle backend response structure
      let token = null;
      let user = null;

      // Check if response has data object (backend structure)
      if (response.data) {
        token = response.data.token;
        // User data is directly in response.data (not nested in user object)
        user = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        };
      } else {
        token = response.token;
        user = response.user;
      }

      // Save token to localStorage
      if (token) {
        localStorage.setItem("token", token);
        console.log("✅ Register: Token saved to localStorage");
      } else {
        console.warn("⚠️ Register: No token in response");
      }

      // Return in the format Redux expects
      return {
        token: token,
        user: user,
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      // Re-throw error to be handled by Redux
      throw new Error(error.message || "Registration failed");
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await apiService.post("/auth/login", credentials);

      // Handle backend response structure
      let token = null;
      let user = null;

      // Check if response has data object (backend structure)
      if (response.data) {
        token = response.data.token;
        // User data is directly in response.data (not nested in user object)
        user = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        };
      } else {
        // Direct structure
        token = response.token;
        user = response.user;
        console.log(
          "✅ Extracted directly - Token:",
          token ? "exists" : "missing",
        );
        console.log("✅ Extracted directly - User:", user);
      }

      // Save token to localStorage
      if (token) {
        localStorage.setItem("token", token);
        console.log("✅ Login: Token saved to localStorage");
      } else {
        console.warn("⚠️ Login: No token in response");
      }

      // Return in the format Redux expects
      const returnData = {
        token: token,
        user: user,
        success: response.success,
        message: response.message,
      };
      console.log("📦 Returning to Redux:", returnData);
      return returnData;
    } catch (error) {
      console.error("❌ Login: Error occurred:", error);
      throw error;
    }
  }

  // Logout user
  logout() {
    console.log("👋 Logout: Removing token from localStorage");
    localStorage.removeItem("token");
    return Promise.resolve();
  }

  // Get current user
  async getCurrentUser() {
    // If already in progress, return the same promise
    if (getCurrentUserInProgress && getCurrentUserPromise) {
      return getCurrentUserPromise;
    }

    // Set flag and create new promise
    getCurrentUserInProgress = true;

    getCurrentUserPromise = (async () => {
      try {
        // Get token from localStorage
        const token = this.getToken();
        if (!token) {
          throw new Error("No token found");
        }

        // Decode JWT token to get userId
        // JWT structure: header.payload.signature
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.id;

        // Call getUserById endpoint
        const response = await apiService.get(`/user/${userId}`);

        // Handle backend response structure
        // Backend returns: { success, message, data: { user object } }
        if (response.data) {
          return {
            user: response.data,
            success: response.success,
            message: response.message,
          };
        }

        return response;
      } catch (error) {
        // Re-throw error to be handled by Redux
        throw new Error(error.message || "Failed to fetch user");
      } finally {
        // Reset flags after completion
        getCurrentUserInProgress = false;
        getCurrentUserPromise = null;
      }
    })();

    return getCurrentUserPromise;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token;
  }

  // Get token
  getToken() {
    return localStorage.getItem("token");
  }

  // Set token
  setToken(token) {
    localStorage.setItem("token", token);
  }

  // Remove token
  removeToken() {
    localStorage.removeItem("token");
  }
}

// Create and export a single instance
const authService = new AuthService();
export default authService;
