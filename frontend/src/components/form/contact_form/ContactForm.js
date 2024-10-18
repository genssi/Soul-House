import React, {useState, useEffect} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useBasketService from '../../../service/BasketService';
import "./contactForm.scss";
import formDecor from "../../../resource/paul-hanaoka-0Qar87UXlGA-unsplash.jpg";

const ContactForm = () => {
    const initValues = {
        name: '',
        phone: ''
    };

    const countryCode = {'KG':'+996'};
    const { sendToTelegram } = useBasketService();
    const [statusType, setstatusType] = useState('');

    useEffect(() => {
        const phoneInput = document.querySelector('.phone');

        if (phoneInput) {
            phoneInput.addEventListener('focus', function () {
                if (this.value === '') {
                    this.value = countryCode['KG'];
                }
            });

            phoneInput.addEventListener('blur', function () {
                if (this.value === countryCode['KG']) {
                    this.value = '';
                }
            });
        }

        return () => {
            if (phoneInput) {
                phoneInput.removeEventListener('focus', () => {});
                phoneInput.removeEventListener('blur', () => {});
            }
        };
    }, []);

    const validationSchema = Yup.object({
        name: Yup.string()
           .min(2, 'Имя должно быть не меньше 2 символов!')
           .max(50, 'Имя не должно превышать 50 символов!')
           .required('Поле "Имя" обязательно для заполнения'),
        phone: Yup.string()
           .matches(/^\+996[0-9]{9}$/, 'Телефон должен содержать только цифры, без пробелов (не меньше и не больше 9 цифр)')
           .required('Поле "Телефон" обязательно для заполнения')
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            await sendToTelegram(values.name, values.phone);
            setstatusType('success');
            resetForm();
        } catch (error){
            setstatusType('error');
        }
        resetForm();
    };

    return (
        <section className="contact-form-section">
            <div className="contact-form-container">
                <div className="form-block">
                    <h2>Свяжитесь с нами</h2>
                    <Formik
                        initialValues={initValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name">Имя</label>
                                    <Field
                                        type="text"
                                        name="name"
                                        placeholder="Введите ваше имя"
                                        className="form-input"
                                    />
                                    <ErrorMessage name="name" component="div" className="error" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Телефон</label>
                                    <Field
                                        type="text"
                                        name="phone"
                                        placeholder="Введите ваш номер телефона"
                                        className="form-input phone"
                                    />
                                    <ErrorMessage name="phone" component="div" className="error" />
                                </div>

                                <button type="submit" className="button button__form" disabled={isSubmitting}>
                                    Отправить
                                </button>

                                {statusType && (
                                    <div className={`status-message ${statusType}`}>
                                        {statusType === 'success' ? 'Готово! Мы с вами скоро свяжемся!' : 'Произошла ошибка при отправке данных. Попробуйте еще раз.'}
                                    </div>
                                )}
                            </Form>
                        )}
                    </Formik>
                </div>

                <div className="image-block">
                    <img src={formDecor} alt="Декорация" className="decorative-image" />
                </div>
            </div>
        </section>
    );
}

export default ContactForm;