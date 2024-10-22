import { Link } from "react-router-dom";
import "./banner.scss";

const Banner = () => {
    return (
        <div className="app__banner">
            <h2>Откройте для себя <br/> Нашу эксклюзивную коллекцию корзин!</h2>
            <p>Ручная работа с любовью и заботой. И с приятными бонусами!</p>
            <Link to="/about" className="btn">Подробнее</Link>
        </div>
    )
};

export default Banner;