import { useState } from "react";
import { Helmet } from "react-helmet";
import Banner from "../../banner/Banner";
import ErrorBoundary from "../../error_boundary/Error_Boundary";

const MainPage = () => {
    const [basket, setBasket] = useState(null);

    const onBasketSelected = (id) => {
        setBasket(id);
    };

    return (
        <>
            <ErrorBoundary>
                <Helmet>
                    <title>Nuray Baskets</title>
                    <meta
                        name="description"
                        content="Marvel information portal"
                    />
                </Helmet>
                <ErrorBoundary>
                    <Banner />
                </ErrorBoundary>
                <div className="app__content">
                    {/* Контент страницы */}
                    <h2>Select Your Favorite Basket</h2>
                    <ul className="baskets-list">
                        <li onClick={() => onBasketSelected(1)}>Basket 1</li>
                        <li onClick={() => onBasketSelected(2)}>Basket 2</li>
                        <li onClick={() => onBasketSelected(3)}>Basket 3</li>
                    </ul>
                    {basket && (
                        <div className="basket-info">
                            {/* Описание выбранного корзины */}
                            <h3>Basket {basket}</h3>
                            <p>Description of the basket goes here...</p>
                        </div>
                    )}
                </div>
            </ErrorBoundary>
        </>
    );
};

export default MainPage;
