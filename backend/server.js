const express = require('express');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Указываем папку для хранения файлов
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Генерируем уникальное имя файла
    }
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true
}));

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const JWT_SECRET = process.env.JWT_SECRET;
const adminLogin = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

// Генерация JWT токена
const generateToken = (username) => {
    return jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' }); // Токен истекает через 1 час
};

// Маршрут для добавления продукта с изображением
app.post('/api/products', upload.single('image'), (req, res) => {
    const { name, price } = req.body;
    const image = req.file ? `http://localhost:3001/uploads/${req.file.filename}` : null;

    if (!image) {
        return res.status(400).send('Image is required');
    }

    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        const jsonData = JSON.parse(data);
        const newProduct = {
            id: jsonData.baskets.length + 1,
            name,
            price,
            thumbnail: image
        };
        jsonData.baskets.push(newProduct);

        fs.writeFile('db.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи файла');
            }
            res.status(201).json(newProduct);
        });
    });
});

// Маршрут для отправки сообщения в Telegram при запросе на обратную связь
app.post('/api/sendMessage', async (req, res) => {
    const { name, phone } = req.body;
    const URL_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

    const message = `Клиент хочет связаться с вами!\nИмя: ${name}\nТелефон: ${phone}`;

    try {
        await axios.post(URL_API, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send message' });
    }
});

// Маршрут для отправки данных заказа в Telegram
app.post('/api/sendOrder', async (req, res) => {
    const { name, phone, address, paymentMethod, total, items } = req.body;
    const URL_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

    const orderDetails = items.map(item => 
        `\n${item.name}\n Количество: ${item.quantity}\n Цена за шт.: ${item.price} сом`).join('\n');

    const message = `
        Новый заказ!\n
        Имя: ${name}
        Телефон: ${phone}
        Адрес: ${address}
        Итоговая сумма: ${total} сом

        Детали заказа:
        ${orderDetails}
    `;

    try {
        await axios.post(URL_API, {
            chat_id: CHAT_ID,
            text: message.trim(),
            parse_mode: 'HTML'
        });
        res.status(200).json({ message: 'Order sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send order' });
    }
});

// маршрут для проверки логина и пароля
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === adminLogin && password === adminPassword) {
        const token = generateToken(username); // Генерация токена
        res.status(200).json({ success: true, token }); // Отправка токена
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Получить все продукты
app.get('/api/products', (req, res) => {
    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }

        const products = JSON.parse(data).baskets;
        const { _start, _limit } = req.query;

        if (!_start && !_limit) {
            return res.json(products); // Возвращаем все продукты
        }

        // Преобразуем _start и _limit в числа
        const start = parseInt(_start, 10) || 0; // По умолчанию 0
        const limit = parseInt(_limit, 10) || products.length; // По умолчанию возвращаем все продукты

        // Обрезаем массив с учетом start и limit
        const slicedProducts = products.slice(start, start + limit);

        res.json(slicedProducts);
    });
});

// Получить продукт по ID
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        const products = JSON.parse(data).baskets;
        const product = products.find(p => p.id === parseInt(id));

        if (!product) {
            return res.status(404).send('Продукт не найден');
        }

        res.json(product);
    });
});

// Добавить новый продукт
app.post('/api/products', (req, res) => {
    const newProduct = req.body;

    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        const jsonData = JSON.parse(data);
        newProduct.id = jsonData.baskets.length + 1; // Генерация ID
        jsonData.baskets.push(newProduct);

        fs.writeFile('db.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи файла');
            }
            res.status(201).json(newProduct);
        });
    });
});

// Удалить продукт
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        const jsonData = JSON.parse(data);
        const initialLength = jsonData.baskets.length; // Для проверки, был ли продукт удален
        jsonData.baskets = jsonData.baskets.filter(product => product.id !== parseInt(id));

        // Проверка, был ли удален продукт
        if (jsonData.baskets.length === initialLength) {
            return res.status(400).json({ message: 'Ошибка при удалении продукта: продукт не найден.' });
        }

        fs.writeFile('db.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи файла');
            }
            res.status(204).send();
        });
    });
});

// Путь для доступа к загруженным изображениям
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});