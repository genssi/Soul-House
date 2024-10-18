import React, { useState } from "react";
import { useCart } from "./CartContext";
import { Helmet } from "react-helmet";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./cartPage.scss";
import useBasketService from "../../../service/BasketService";

Modal.setAppElement('#root');

const CartPage = () => {
    const { cartItems, removeFromCart, setCartItems } = useCart();
    const { sendOrderToTelegram } = useBasketService();
    const [modalOpen, setModalOpen] = useState(false);

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const validationSchema = Yup.object({
        name: Yup.string()
            .min(2, 'Имя должно быть не меньше 2 символов!')
            .max(50, 'Имя не должно превышать 50 символов!')
            .required('Поле "Имя" обязательно для заполнения'),
        phone: Yup.string()
            .matches(/^\+996[0-9]{9}$/, 'Телефон должен содержать только цифры, без пробелов (не меньше и не больше 9 цифр)')
            .required('Поле "Телефон" обязательно для заполнения'),
        address: Yup.string()
            .min(5, 'Адрес должен быть не меньше 5 символов!')
            .required('Поле "Адрес" обязательно для заполнения'),
    });

    const handleOrderSubmit = async (values) => {
        const orderData = {
            ...values,
            total: getTotalPrice(),
            items: cartItems
        };

        try {
            await sendOrderToTelegram(orderData);
            toast.success("Заказ успешно оформлен! Мы с вами скоро свяжемся", {position: "top-center"});
            setCartItems([]); // Очистка корзины
            setModalOpen(false);
        } catch (error) {
            toast.error("Ошибка при оформлении заказа. Попробуйте еще раз.", {position: "top-center"});
        }
    };

    return (
        <>
            <Helmet>
                <title>Корзина</title>
                <meta name="description" content="Корзина покупок" />
            </Helmet>
            <div className="cart-page">
                <h2>Ваша корзина</h2>
                {cartItems.length === 0 ? (
                    <p>Корзина пуста</p>
                ) : (
                    <>
                        <ul className="cart-list">
                            {cartItems.map((item) => (
                                <li key={item.id} className="cart-item">
                                    <span>{item.name}</span>
                                    <span>Количество: {item.quantity}</span>
                                    <span>Цена: {item.price} сом</span>
                                    <button onClick={() => removeFromCart(item.id)}>Удалить</button>
                                </li>
                            ))}
                        </ul>
                        <div className="total-price">
                            <strong>Итоговая сумма: {getTotalPrice()} сом</strong>
                        </div>
                        <button 
                            onClick={() => setModalOpen(true)} 
                            className="order-button order-button-main"
                        >
                            Оформить заказ
                        </button>
                    </>
                )}

                <Modal 
                    isOpen={modalOpen} 
                    onRequestClose={() => setModalOpen(false)}
                    className="order-modal"
                    overlayClassName="modal-overlay"
                >
                    <h2>Оформление заказа</h2>
                    <Formik
                        initialValues={{ name: '', phone: '+996', address: '', paymentMethod: 'card' }}
                        validationSchema={validationSchema}
                        onSubmit={handleOrderSubmit}
                    >
                        {({ values, setFieldValue, isSubmitting }) => (
                            <Form>
                                <div>
                                    <label>Имя:</label>
                                    <Field type="text" name="name" placeholder="Введите ваше имя" />
                                    <ErrorMessage name="name" component="div" className="error" />
                                </div>
                                <div>
                                    <label>Телефон:</label>
                                    <Field 
                                        type="text" 
                                        name="phone" 
                                        placeholder="Введите ваш номер телефона"
                                        value={values.phone}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            // Автоматически добавляем "+996", если пользователь удаляет его
                                            if (input === '' || input === '+996') {
                                                setFieldValue('phone', '+996');
                                            } else {
                                                setFieldValue('phone', input);
                                            }
                                        }}
                                    />
                                    <ErrorMessage name="phone" component="div" className="error" />
                                </div>
                                <div>
                                    <label>Адрес доставки:</label>
                                    <Field type="text" name="address" placeholder="Введите ваш адрес" />
                                    <ErrorMessage name="address" component="div" className="error" />
                                </div>
                                <button type="submit" className="order-button" disabled={isSubmitting}>
                                    Подтвердить заказ
                                </button>
                                <button onClick={() => setModalOpen(false)} className="cancel-button">Отмена</button>
                            </Form>
                        )}
                    </Formik>
                </Modal>

                <ToastContainer />
            </div>
        </>
    );
};

export default CartPage;