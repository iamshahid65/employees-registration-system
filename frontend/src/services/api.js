import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'Something went wrong';
        console.error('API Error:', message);
        const err = new Error(message);
        err.status = error.response?.status;
        err.data = error.response?.data;
        err.original = error;
        return Promise.reject(err);
    }
);

export const employeeApi = {
    // Get all employees with optional filters
    getAll: async (filters = {}, signal) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const response = await api.get(`/employees?${params}`, { signal });
        return response.data;
    },

    // Get single employee
    getById: async (id, signal) => {
        const response = await api.get(`/employees/${id}`, { signal });
        return response.data;
    },

    // Create employee
    create: async (data) => {
        const response = await api.post('/employees', data);
        return response.data;
    },

    // Update employee
    update: async (id, data) => {
        const response = await api.put(`/employees/${id}`, data);
        return response.data;
    },

    // Delete employee
    delete: async (id) => {
        const response = await api.delete(`/employees/${id}`);
        return response.data;
    },

    // Get departments
    getDepartments: async (signal) => {
        const response = await api.get('/employees/departments', { signal });
        return response.data;
    },

    // Get statistics
    getStats: async (signal) => {
        const response = await api.get('/employees/stats', { signal });
        return response.data;
    }
};

export default api;
