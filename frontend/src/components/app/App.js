import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../app_header/Header";
import { MainPage, SingleBasket, About, ContactsPage } from "../pages";
import AdminPanel from '../adminPanel/AdminPanel';
import Login from '../adminPanel/Login';
import CartPage from '../pages/cart/CartPage';
import { CartProvider } from '../pages/cart/CartContext';
import Footer from "../footer/Footer";

const App = () => {
    return (
        <CartProvider>
            <Router>
                <div className="app">
                    <Header/>
                    <main>
                        <Routes>
                            <Route path="/" element={<MainPage/>}/>
                            <Route path="/login" element={<Login />} />
                            <Route path="/admin" element={<AdminPanel />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contacts" element={<ContactsPage />} />
                            <Route path="/cart" element={<CartPage/>}/>
                            <Route path="/baskets/:basketID" element={<SingleBasket />} />
                        </Routes>
                    </main>
                </div>
                <Footer/>
            </Router>
        </CartProvider>
    )
}

export default App;