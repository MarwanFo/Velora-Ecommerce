import api from './api';

/**
 * Order Service
 * Handles checkout and order-related API calls
 */

const orderService = {
    /**
     * Submit checkout and create order
     */
    async checkout(orderData) {
        const response = await api.post('/checkout', orderData);
        return response.data;
    },

    /**
     * Get user's order history
     */
    async getOrders(params = {}) {
        const response = await api.get('/orders', { params });
        return response.data;
    },

    /**
     * Get order details by order number
     */
    async getOrder(orderNumber) {
        const response = await api.get(`/orders/${orderNumber}`);
        return response.data;
    },
};

export default orderService;
