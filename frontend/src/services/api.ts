import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api');

const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data: { full_name: string }) => api.patch('/auth/profile', data),
    updatePassword: (data: { newPassword: string }) => api.patch('/auth/password', data),
};

export const roomService = {
    getAll: () => api.get('/rooms'),
    getById: (id: number) => api.get(`/rooms/${id}`),
};

export const reservationService = {
    getAll: () => api.get('/reservations'),
    getAllForAdmin: () => api.get('/reservations/admin/all'),
    create: (data: any) => api.post('/reservations', data),
    cancel: (id: string) => api.patch(`/reservations/${id}/cancel`),
};

export default api;
