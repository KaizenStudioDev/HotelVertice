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

// Handle 401 globally: try to refresh token, otherwise redirect to login
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const res = await api.post('/auth/refresh', { refresh_token: refreshToken });
                    const { session } = res.data.data;
                    localStorage.setItem('token', session.access_token);
                    localStorage.setItem('refresh_token', session.refresh_token);
                    originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
                    return api(originalRequest);
                } catch {
                    // refresh failed, fall through to logout
                }
            }
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data: { full_name: string }) => api.patch('/auth/profile', data),
    updatePassword: (data: { newPassword: string }) => api.patch('/auth/password', data),
};

export const roomService = {
    getAll: (params?: { check_in?: string; check_out?: string }) =>
        api.get('/rooms', { params }),
    getById: (id: number) => api.get(`/rooms/${id}`),
};

export const reservationService = {
    getAll: () => api.get('/reservations'),
    getAllForAdmin: () => api.get('/reservations/admin/all'),
    create: (data: any) => api.post('/reservations', data),
    cancel: (id: string) => api.patch(`/reservations/${id}/cancel`),
};

export default api;
