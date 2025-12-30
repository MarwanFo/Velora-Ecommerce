import api from './api';

/**
 * Admin Service
 * Handles all admin API calls
 */
const adminService = {
    // Dashboard
    async getDashboard() {
        const response = await api.get('/admin/dashboard');
        return response.data;
    },

    // Products
    async getProducts(params = {}) {
        const response = await api.get('/admin/products', { params });
        return response.data;
    },

    async getProduct(id) {
        const response = await api.get(`/admin/products/${id}`);
        return response.data;
    },

    async createProduct(data) {
        const response = await api.post('/admin/products', data);
        return response.data;
    },

    async updateProduct(id, data) {
        const response = await api.put(`/admin/products/${id}`, data);
        return response.data;
    },

    async deleteProduct(id) {
        const response = await api.delete(`/admin/products/${id}`);
        return response.data;
    },

    async toggleProductStatus(id) {
        const response = await api.patch(`/admin/products/${id}/toggle-status`);
        return response.data;
    },

    // Orders
    async getOrders(params = {}) {
        const response = await api.get('/admin/orders', { params });
        return response.data;
    },

    async getOrder(id) {
        const response = await api.get(`/admin/orders/${id}`);
        return response.data;
    },

    async updateOrderStatus(id, status) {
        const response = await api.patch(`/admin/orders/${id}/status`, { status });
        return response.data;
    },

    async updatePaymentStatus(id, payment_status) {
        const response = await api.patch(`/admin/orders/${id}/payment-status`, { payment_status });
        return response.data;
    },

    // Users
    async getUsers(params = {}) {
        const response = await api.get('/admin/users', { params });
        return response.data;
    },

    async getUser(id) {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    },

    async updateUser(id, data) {
        const response = await api.put(`/admin/users/${id}`, data);
        return response.data;
    },

    async toggleUserAdmin(id) {
        const response = await api.patch(`/admin/users/${id}/toggle-admin`);
        return response.data;
    },

    // Categories
    async getCategories(params = {}) {
        const response = await api.get('/admin/categories', { params });
        return response.data;
    },

    async createCategory(data) {
        const response = await api.post('/admin/categories', data);
        return response.data;
    },

    async updateCategory(id, data) {
        const response = await api.put(`/admin/categories/${id}`, data);
        return response.data;
    },

    async deleteCategory(id) {
        const response = await api.delete(`/admin/categories/${id}`);
        return response.data;
    },
};

export default adminService;
