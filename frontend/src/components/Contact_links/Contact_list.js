import React, { useState, useEffect } from "react";
import "./contact_list.scss";

const ContactList = () => {
    const [showContacts, setShowContacts] = useState(false);

    const scrollEnded = () => {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 50) {
            setShowContacts(true);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", scrollEnded);
        return () => window.removeEventListener("scroll", scrollEnded);
    }, []);

    return (
        <div>
            <ContactLinks visible={showContacts}/>
        </div>
    )
}

const ContactLinks = ({ visible }) => {
    return (
        <div className={`contact-links ${visible ? 'visible' : ''}`}>
            <a href="https://t.me/soul_housee" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn-icons-png.flaticon.com/128/2111/2111646.png" alt="Telegram" />
            </a>
            <a href="https://wa.me/996501880180" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn-icons-png.flaticon.com/128/15707/15707820.png" alt="WhatsApp" />
            </a>
            <a href="https://www.instagram.com/soul_house_kg?igsh=MTBtOTRhOTRhMWF2Mg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn-icons-png.flaticon.com/128/15707/15707749.png" alt="Instagram" />
            </a>
        </div>
    );
};

export default ContactList;