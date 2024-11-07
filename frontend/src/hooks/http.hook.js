import { useState, useCallback } from "react";

const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method = "GET", body = null, headers = {}) => {
        setLoading(true);
        setError(null); // Сбрасываем ошибку при новом запросе

        try {
            // Если есть токен, добавляем его в заголовок
            const token = localStorage.getItem('token');  // или из cookie
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            if (!(body instanceof FormData)) {
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(url, {
                method,
                body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
                headers,
                credentials: 'include'
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // Если метод не GET (например, DELETE), то не ожидаем JSON-ответ
            const data = method === "GET" ? await response.json() : null;

            setLoading(false);
            console.log('Token:', token);
            return data;
        } catch (error) {
            setLoading(false);
            setError(error.message);
            throw error;
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);
    return { loading, request, error, clearError };
};

export default useHttp;