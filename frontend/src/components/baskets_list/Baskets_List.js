import React, { useState, useRef, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../error_message/Error_message";
import useBasketService from "../../service/BasketService";
import Spinner from "../spinner/Spinner";
import "./baskets_list.scss";

const BasketList = () => {
    const myRef = useRef([]);
    const [basketList, setBasketList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [basketEnded, setBasketEnded] = useState(false);

    const { loading, error, getBaskets, clearError } = useBasketService();
    const navigate = useNavigate(); // Инициализируем navigate

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = async (offset, initial) => {
        setNewItemLoading(!initial);
        clearError();

        try {
            const data = await getBaskets(offset, 5);
            if (data.length < 5) {
                setBasketEnded(true);
            }

            setBasketList((prevList) => [...prevList, ...data]);
            setOffset((prevOffset) => prevOffset + 5);
        } catch (err) {
            throw new Error(err);
        } finally {
            setNewItemLoading(false);
        }
    };

    const focusBasketItem = (i) => {
        if (myRef[i].current) {
            myRef[i].current.style.boxShadow = "0 5px 20px";
            myRef[i].current.style.transform = "translateY(-8px)";
        }
    };

    const unFocusBasketItem = (i) => {
        if (myRef[i].current) {
            myRef[i].current.style.boxShadow = "none";
            myRef[i].current.style.transform = "none";
        }
    };

    const handleClick = (item, i) => {
        navigate(`/baskets/${item.id}`);
        focusBasketItem(i);
    };

    function renderItems(arr) {
        return (
            <TransitionGroup component="ul" className="basket__grid">
                {arr.map((item, i) => {
                    let imgStyle = { objectFit: 'cover' };

                    if (!myRef[i]) {
                        myRef[i] = React.createRef();
                    }

                    return (
                        <CSSTransition
                            nodeRef={myRef[i]}
                            key={item.id}
                            timeout={500}
                            classNames="fade"
                        >
                            <li
                                className="basket__item"
                                key={item.id}
                                ref={myRef[i]}
                                tabIndex={0}
                                onClick={() => handleClick(item, i)}
                                onFocus={() => focusBasketItem(i)}
                                onBlur={() => unFocusBasketItem(i)}
                            >
                                <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                                <h3 className="basket__name">{item.name}</h3>
                                <p className="basket__price">{item.price} сом</p>
                            </li>
                        </CSSTransition>
                    )
                })}
            </TransitionGroup>
        )
    }

    const items = renderItems(basketList);
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading || newItemLoading ? <Spinner /> : null;

    return (
        <div className="basket__list">
            {errorMessage}
            {items}
            {spinner}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ display: basketEnded ? "none" : "block" }}
                onClick={() => onRequest(offset)}
            >
                <div className="inner">Загрузить еще</div>
            </button>
        </div>
    )
}

export default BasketList;