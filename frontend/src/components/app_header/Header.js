import { Link, NavLink } from "react-router-dom";
import { useCart } from "../pages/cart/CartContext";
import { FaShoppingCart } from "react-icons/fa";

import "./header.scss";

const Header = () => {
    const { cartItems } = useCart();
    return (
        <header className="app__header">
            <h1 className="app__title">
                <Link to="/">
                    <span>Nuray</span> baskets
                </Link>
            </h1>
            <nav className="app__menu">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Главная</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>О нас</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/contacts" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Контакты</NavLink>
                    </li>
                    {/* Иконка корзины с количеством товаров */}
                    <li className="nav-item">
                        <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            <FaShoppingCart size={24} />
                            {cartItems.length > 0 && (
                                <span className="cart-count">{cartItems.length}</span>
                            )}
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;