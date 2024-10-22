import { Helmet } from "react-helmet";
import "./contactsPage.scss";

const ContactsPage = () => {
    return (
        <>
            <Helmet>
                <title>Контакты</title>
                <meta name="description" content="contacts information" />
            </Helmet>
            <div className="contacts">
                <h2>Свяжитесь с нами</h2>
                <p className="contacts__info">
                    Если у вас есть вопросы или предложения, свяжитесь с нами по контактным данным.
                    Мы всегда готовы помочь вам!
                </p>

                <div className="contacts__details">
                    <div className="contacts__item">
                    <h3>Мы в социальных сетях:</h3>
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
                    <div className="contacts__item">
                        <h3>Телефон:</h3>
                        <p>+996 501880180</p>
                    </div>
                    <div className="contacts__item">
                        <h3>Email:</h3>
                        <p>2001shermurzaev@gmail.com</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactsPage;