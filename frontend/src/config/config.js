// Configuration file for environment variables
const config = {
  // API Base URL
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',

  // Environment
  env: import.meta.env.VITE_ENV || 'development',

  // Helper function to get full API endpoint
  getApiUrl: (endpoint) => {
    return `${config.apiBaseUrl}${endpoint}`;
  },
};

export default config;
