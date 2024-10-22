import { useCallback } from "react";
import useHttp from "../hooks/http.hook";

const useBasketService = () => {
    const { loading, request, error, clearError } = useHttp();

    const getBaskets = useCallback(async (offset=0, limit=5) => {
        try {
            const data = await request(`http://localhost:3001/api/products?_start=${offset}&_limit=${limit}`);
            return data;
        } catch (error) {
            throw error;
        }
    }, [request]);

    const getBasketByID = useCallback(async (id) => {
        try {
            const data = await request(`http://localhost:3001/api/products/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }, [request]);

    const sendToTelegram = useCallback(async (name, phone) => {
        try {
            await request('http://localhost:3001/api/sendMessage', 'POST', { name, phone });
        } catch (error) {
            throw error;
        }
    }, [request]);

    const sendOrderToTelegram = useCallback(async (orderData) => {
        try {
            await request('http://localhost:3001/api/sendOrder', 'POST', orderData);
        } catch (error) {
            throw error;
        }
    }, [request]);

    const login = useCallback(async (username, password) => {
        try {
            const data = await request('http://localhost:3001/api/login', 'POST', { username, password });
            if (data && data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('isAuthenticated', true);
            } else {
                throw new Error(data?.message || 'Login failed');
            }
            return data;
        } catch (error) {
            throw error;
        }
    }, [request]);

    const deleteProduct = useCallback(async (id) => {
        try {
            await request(`http://localhost:3001/api/products/${id}`, 'DELETE');
        } catch (error) {
            throw error;
        }
    }, [request]);

    return {
        loading,
        request,
        error,
        clearError,
        getBaskets,
        getBasketByID,
        sendToTelegram,
        sendOrderToTelegram,
        login,
        deleteProduct
    };
};

export default useBasketService;