import { Helmet } from "react-helmet";
import Banner from "../../banner/Banner";
import BasketList from "../../baskets_list/Baskets_List";
import Features from "../../features/Features";
import ContactForm from "../../form/contact_form/ContactForm";
import ContactList from "../../Contact_links/Contact_list";
import ErrorBoundary from "../../error_boundary/Error_Boundary";
import { FaShoppingBasket } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import "./main_page.scss";

const MainPage = () => {

    return (
        <>
            <ErrorBoundary>
                <Helmet>
                    <title>Soul House</title>
                    <meta
                        name="description"
                        content="Онлайн магазин корзин Бишкек, Большой выбор корзин для дома и дачи, доставка по всему городу."
                    />
                    <meta name="keywords" content="корзины, магазин корзин, корзины Бишкек, купить корзины Бишкек, корзины для дома, корзины Киргизия, снг, онлайн магазин"/>
                </Helmet>
                <ErrorBoundary>
                    <Banner />
                </ErrorBoundary>
                <ErrorBoundary>
                    <div className="app__content">
                        <h2>Широкий выбор корзин для дома и дачи</h2>
                        <FaShoppingBasket className="basket-icon" />
                        <p className="intro-info">В нашем магазине вы найдете корзины для любых задач:<br/> от хранения вещей до украшения интерьера.<br/> Выбирайте с удовольствием!</p>
                    </div>
                </ErrorBoundary>
                <ErrorBoundary>
                    <BasketList />
                </ErrorBoundary>
                <ErrorBoundary>
                    <Features/>
                </ErrorBoundary>
                <div className="app__feedback">
                    <h2>Доставка корзин по Бишкеку и всему СНГ</h2>
                    <p>Вы так же можете заказать корзину под свой вкус! <br/>Под любую форму, и под любой размер<br/> Для этого заполните форму ниже, чтобы мы могли с вами связаться и обсудить об этом</p>
                    <FaArrowDown className="feedback-icon" /> 
                </div>
                <ErrorBoundary>
                    <ContactForm/>
                </ErrorBoundary>
                <ErrorBoundary>
                    <ContactList/>
                </ErrorBoundary>
            </ErrorBoundary>
        </>
    );
};

export default MainPage;
