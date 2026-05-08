import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadImage = async (file: File): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/api/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const createGenerationJob = async (payload: {
  userId: string;
  imageUrl: string;
  productName: string;
  productDescription: string;
  price: number;
  category: string;
}) => {
  const response = await api.post('/api/generate/create', payload);
  return response.data;
};

export const getJobStatus = async (jobId: number) => {
  const response = await api.get(`/api/generate/status/${jobId}`);
  return response.data;
};

export const createShopifyProduct = async (payload: {
  jobId: number;
  shopId: string;
  title: string;
  description: string;
  images: string[];
}) => {
  const response = await api.post('/api/shopify/products/create', payload);
  return response.data;
};

export default api;
