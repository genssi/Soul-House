import React, {useState, useRef, useEffect} from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ErrorMessage from "../error_message/Error_message";
import "./bastes_list.scss";

const BasketList = () => {
    const myRef = useRef([]);
    const [basketList, setBasketList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);

    function renderItems(arr) {
        return (
            <TransitionGroup component="ul" className="basket__grid">
                {arr.map((item, i) => {
                    let imgStyle = { objectFit: 'cover'};

                    if (!myRef[i]) {
                        myRef[i] = React.createRef(null);
                    }

                    return (
                        <CSSTransition
                            key={item.id}
                            timeout={500}
                            classNames="fade"
                        >
                            <li 
                            className="basket__item"
                            key={item.id}
                            ref={myRef[i]}
                            tabIndex={0}

                            >
                                <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                                <h3 className="basket__name">{item.name}</h3>
                                <p className="basket__desc">{item.description}</p>
                            </li>
                        </CSSTransition>
                    )
                })}
            </TransitionGroup>
        )
    }

    const items = renderItems(basketList);
    // const errorMessage = error ? <ErrorMessage/> : null;
    // const spinner = loading ? 

    return (
        <div className="basket__list">
            {/* {errorMessage} */}
            {items}
            {/* {loading} */}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                // style={{ display: basketEnded ? "none" : "block" }}
                // onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default BasketList;