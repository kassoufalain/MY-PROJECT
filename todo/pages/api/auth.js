import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Replace with your backend API URL

export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/signup`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};
