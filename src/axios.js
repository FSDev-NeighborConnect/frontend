import axios from "axios"

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: "http://localhost:5000", // Adjust this to match your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies (CSRF token)
})

// Add a request interceptor for handling auth tokens and CSRF
api.interceptors.request.use(
  (config) => {
    // Get CSRF token from cookie if it exists
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1]

    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken
    }

    return config
  },
  (error) => Promise.reject(error),
)

// Add a response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          window.location.href = "/login"
          break
        case 403:
          // Forbidden - user doesn't have permission
          console.error("Permission denied:", error.response.data.message)
          break
        case 404:
          // Not found
          console.error("Resource not found:", error.response.data.message)
          break
        case 500:
          // Server error
          console.error("Server error:", error.response.data.message)
          break
        default:
          console.error("API Error:", error.response.data)
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request)
    } else {
      // Something happened in setting up the request
      console.error("Request error:", error.message)
    }
    return Promise.reject(error)
  },
)

export default api
