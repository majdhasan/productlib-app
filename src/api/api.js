import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api"; // Replace with your backend URL

export const getAllProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/products`);
  return response.data;
};

export const getAllCalendarEvents = async () => {
    const response = await axios.get(`${API_BASE_URL}/calendar-events`);
    return response.data;
  };

export const createUser = async (user) => {
  const response = await axios.post(`${API_BASE_URL}/users`, user);
  return response.data;
};
