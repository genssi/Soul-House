import { Link, NavLink } from "react-router-dom";
import "./header.scss";

const Header = () => {
    return (
        <header className="header">
            <h1 className="header__title">
                <Link to="/">
                    <span>Nuray</span> baskets
                </Link>
            </h1>
            <nav className="navbar">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink exact to="/" className="nav-link" activeClassName="active">Home</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/about" className="nav-link" activeClassName="active">About</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/contact" className="nav-link" activeClassName="active">Contact</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;