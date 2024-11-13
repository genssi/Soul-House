import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useBasketService from "../../service/BasketService";
import Spinner from "../spinner/Spinner";
import { Helmet } from "react-helmet";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./adminPanel.scss";

const AdminPanel = () => {
    const { loading, request, error, clearError, getBaskets, deleteProduct } = useBasketService();
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        } else {
            fetchProducts();
        }
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            clearError();
            const data = await getBaskets(0, Infinity);
            setProducts(data);
        } catch (error) {
            toast.error("Ошибка загрузки данных продуктов", {position: "bottom-center"});
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleAddProduct = async () => {
        if (!name || !price || !image) {
            return toast.error("Пожалуйста заполните все поля", {position: "bottom-center"});
        }
    
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('image', image);
        const token = localStorage.getItem('token');
    
        try {
            clearError();
            await request("https://www.mybaskets.online/api/products", "POST", formData, {
                'Authorization': `Bearer ${token}`
            });
            setName("");
            setPrice("");
            setImage(null);
            fetchProducts(); 
            toast.success("Продукт успешно добавлен", {position: "bottom-center"});
        } catch (error) {
            toast.error("Failed to add product.", {position: "bottom-center"});
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Вы точно хотите удалить этот продукт?")) {
            try {
                setIsDeleting(true);
                clearError();
                await deleteProduct(id);
                fetchProducts();
                toast.success("Продукт успешно удален", {position: "bottom-center"});
            } catch (error) {
                toast.error("Ошибка с удалением продукта. Пожалуйста попробуйте снова", {position: "bottom-center"});
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <>
            <Helmet>
                <title>Админ панель</title>
                <meta name="description" content="admin panel" />
            </Helmet>
            <div className="admin-panel">
                <h2>Admin Panel</h2>

                {error && (
                    <div className="error">
                        <p>Ошибка!</p>
                        <button onClick={clearError}>Очистить ошибку</button>
                    </div>
                )}
                
                {loading && <Spinner />}

                <div className="add-product-form">
                    <input
                        type="text"
                        placeholder="Название"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Цена"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <button onClick={handleAddProduct} disabled={loading}>
                        Добавить продукт
                    </button>
                </div>

                <div className="product-list">
                    <h3>Список продуктов</h3>
                    {loading && !products.length ? (
                        <Spinner />
                    ) : products.length === 0 ? (
                        <p>Список продуктов пуст.</p>
                    ) : (
                        <ul>
                            {products.map((product) => (
                                <li key={product.id}>
                                    <img src={product.thumbnail} alt={product.name} width="50" />
                                    <span>{product.name}</span>
                                    <span>{product.price} сом</span>
                                    <button onClick={() => handleDeleteProduct(product.id)} disabled={loading || isDeleting}>
                                        Удалить
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <ToastContainer />
            </div>
        </>
    );
};

export default AdminPanel;