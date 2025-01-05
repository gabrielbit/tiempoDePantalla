import { Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurar la URL base según la plataforma
const API_URL = 'http://localhost:3000';

console.log('Using API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Timeout de 10 segundos
});

// Interceptor para las requests
api.interceptors.request.use(
  async (config) => {
    console.log('🚀 Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para las respuestas
api.interceptors.response.use(
  response => {
    console.log('✅ Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  error => {
    console.error('❌ Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email, password });
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      await AsyncStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      console.error('Login error details:', error.response?.data || error.message);
      throw error;
    }
  },
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  },
  logout: async () => {
    await AsyncStorage.removeItem('token');
  }
};

export const schedulesService = {
  getAll: () => api.get('/schedules'),
  getOne: (id: string) => api.get(`/schedules/${id}`),
  getByChild: (childId: string) => api.get(`/schedules/child/${childId}`),
  create: (data: any) => api.post('/schedules', data),
};

export const tasksService = {
  getAll: () => api.get('/tasks'),
  getOne: (id: string) => api.get(`/tasks/${id}`),
  getBySchedule: (scheduleId: string) => api.get(`/tasks/schedule/${scheduleId}`),
  create: (data: any) => api.post('/tasks', data),
}; 