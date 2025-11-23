import config from "../config/config";

// Base API service using fetch
class ApiService {
  constructor() {
    this.baseURL = config.apiBaseUrl;
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem("token");
  }

  // Get headers with token
  getHeaders(customHeaders = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  // Handle API response
  async handleResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      throw {
        status: response.status,
        message: data.message || "Something went wrong",
        data: data,
      };
    }

    return data;
  }

  // GET request
  async get(endpoint, customHeaders = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(customHeaders),
    });

    return await this.handleResponse(response);
  }

  // POST request
  async post(endpoint, data = {}, customHeaders = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(customHeaders),
      body: JSON.stringify(data),
    });

    return await this.handleResponse(response);
  }

  // PUT request
  async put(endpoint, data = {}, customHeaders = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(customHeaders),
      body: JSON.stringify(data),
    });

    return await this.handleResponse(response);
  }

  // PATCH request
  async patch(endpoint, data = {}, customHeaders = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PATCH",
      headers: this.getHeaders(customHeaders),
      body: JSON.stringify(data),
    });

    return await this.handleResponse(response);
  }

  // DELETE request
  async delete(endpoint, customHeaders = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(customHeaders),
    });

    return await this.handleResponse(response);
  }
}

// Create and export a single instance
const apiService = new ApiService();
export default apiService;
