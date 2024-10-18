import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useBasketService from "../../service/BasketService";
import Spinner from "../spinner/Spinner";
import "./login.scss";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const { login, error, clearError, loading } = useBasketService();

    const handleLogin = async (e) => {
        e.preventDefault();
        clearError();

        try {
            const response = await login(username, password);

            if (response.success) {
                localStorage.setItem('isAuthenticated', 'true'); // сохраняем статус авторизации
                navigate("/admin");
            } else {
                setNotification("Неверный логин или пароль");
            }
        } catch (error) {
            setNotification("Ошибка при входе. Пожалуйста, попробуйте снова.");
        }
    };

    const closeNotification = () => {
        setNotification(null);
    };

    return (
        <div className="login">
            <h2>Вход</h2>
            {notification && (
                <div className="notification">
                    <p>{notification}</p>
                    <button onClick={closeNotification}>Закрыть</button>
                </div>
            )}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? <Spinner /> : "Войти"}
                </button>
            </form>
        </div>
    );
};

export default Login;