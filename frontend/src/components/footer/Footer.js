import { Link } from "react-router-dom";
import "./footer.scss";

const Footer = () => {
    return (
        <footer className="app__footer">
            <p>&copy; 2024 Nuray Baskets. All rights reserved.</p>
            <nav className="footer__menu">
                <a href="https://www.freeprivacypolicy.com/live/500f3f97-1099-4cfe-9f8c-1b1d6888cb6b">Privacy Policy</a>
                <Link to="">Terms of Service</Link>
                <Link to="/contacts">Contact Us</Link>
            </nav>
        </footer>
    )
}

export default Footer;