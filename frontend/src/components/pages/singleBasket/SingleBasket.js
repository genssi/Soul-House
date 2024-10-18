import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useCart } from "../cart/CartContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useBasketService from "../../../service/BasketService";
import ErrorMessage from "../../error_message/Error_message";
import Spinner from "../../spinner/Spinner";
import "./singleBasket.scss";

const SingleBasket = () => {
    const { basketID } = useParams();
    const [basket, setBasket] = useState(null);
    const { loading, error, clearError, getBasketByID } = useBasketService();
    const { addToCart } = useCart(); // Получаем функцию addToCart из контекста

    useEffect(() => {
        updateBasketPage();
    }, [basketID]);

    const updateBasketPage = async () => {
        clearError();
        try {
            const data = await getBasketByID(basketID);
            onBasketLoaded(data);
        } catch (error) {
            throw new Error(error);
        }
    };

    const onBasketLoaded = (basket) => {
        setBasket(basket);
    };

    const handleAddToCart = () => {
        if (basket) {
            addToCart(basket);
            toast.success(`добавлен в корзину!`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !basket) ? (
        <View basket={basket} onAddToCart={handleAddToCart} />
    ) : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
            <ToastContainer /> {/* Контейнер для отображения уведомлений */}
        </>
    );
};

const View = ({ basket, onAddToCart }) => {
    const { name, thumbnail, price } = basket;
    return (
        <>
            <Helmet>
                <title>{name}</title>
                <meta name="description" content={`${name} information`} />
            </Helmet>
            <div className="single-basket">
                <img src={thumbnail} alt={name} className="single-basket__img" />
                <div className="single-basket__info">
                    <h2 className="single-basket__name">{name}</h2>
                    <div className="single-basket__price">{price} сом</div>
                    <button className="button__add" onClick={onAddToCart}>
                        Добавить в корзину
                    </button>
                </div>
                <Link to="/" className="button__back">
                    Назад
                </Link>
            </div>
        </>
    );
};

export default SingleBasket;