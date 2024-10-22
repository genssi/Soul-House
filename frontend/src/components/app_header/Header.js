import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../pages/cart/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import "./header.scss";

const Header = () => {
    const { cartItems } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleClickOutside = (event) => {
        const menu = document.querySelector('.app__menu');
        if (menu && !menu.contains(event.target) && !event.target.closest('.burger')) {
            closeMenu();
        }
    };

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.body.style.overflow = 'auto';
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.body.style.overflow = 'auto';
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <header className="app__header">
            <h1 className="app__title">
                <Link to="/">
                    <span>Soul</span> House
                </Link>
            </h1>
            <div className="burger" onClick={toggleMenu}>
                <div className={`burger-icon ${isMenuOpen ? 'active' : ''}`}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                {/* Количество товаров в корзине в бургер-меню */}
                {cartItems.length > 0 && (
                    <span className="cart-count">{cartItems.length}</span>
                )}
            </div>
            {isMenuOpen && <div className="overlay" onClick={closeMenu}></div>}
            <nav className={`app__menu ${isMenuOpen ? 'active' : ''}`}>
                <ul className="navbar-nav">
                    <li className="nav-item" onClick={closeMenu}>
                        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Главная</NavLink>
                    </li>
                    <li className="nav-item" onClick={closeMenu}>
                        <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>О нас</NavLink>
                    </li>
                    <li className="nav-item" onClick={closeMenu}>
                        <NavLink to="/contacts" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Контакты</NavLink>
                    </li>
                    <li className="nav-item" onClick={closeMenu}>
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
    );
}

export default Header;