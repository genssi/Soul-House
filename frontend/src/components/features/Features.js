import { FaShippingFast, FaHandHoldingHeart, FaHeadset } from "react-icons/fa";
import "./features.scss";

const Features = () => {
    return (
        <section className="app__features">
            <div className="feature">
                <FaShippingFast className="feature__icon" />
                <h3>Бесплатная доставка</h3>
                <p>При заказе на сумму свыше $50</p>
            </div>
            <div className="feature">
                <FaHandHoldingHeart className="feature__icon" />
                <h3>100% ручная работа</h3>
                <p>Каждая корзина изготовлена с заботой</p>
            </div>
            <div className="feature">
                <FaHeadset className="feature__icon" />
                <h3>Поддержка 24/7</h3>
                <p>Мы здесь, чтобы помочь вам в любое время</p>
            </div>
        </section>
    )
}

export default Features;