import axios from 'axios';

const API_BASE_URL = 'https://vegan-snacks.onrender.com/api/auth'; 

// Common error handler
export const handleAxiosError = (error, fallbackMessage) => {
  if (error.response && error.response.data) {
    const data = error.response.data;

    if (Array.isArray(data)) {
      throw new Error(data.join(", "));
    }
    if (typeof data === 'string') {
      throw new Error(data);
    }
    if (data.message) {
      throw new Error(data.message);
    }
  }
  throw new Error(fallbackMessage);
};

// Register
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Registration failed due to unknown error");
  }
};

// Login
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, userData);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Login failed due to unknown error");
  }
};
