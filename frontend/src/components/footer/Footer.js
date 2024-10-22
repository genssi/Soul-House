import { Link } from "react-router-dom";
import "./footer.scss";

const Footer = () => {
    return (
        <footer className="app__footer">
            <p>&copy; 2024 Soul House. All rights reserved.</p>
            <nav className="footer__menu">
                <a href="https://www.freeprivacypolicy.com/live/2270dd9a-f435-4e0e-82db-104fb5763571">Privacy Policy</a>
                <Link to="">Terms of Service</Link>
                <Link to="/contacts">Contact Us</Link>
            </nav>
        </footer>
    )
}

export default Footer;