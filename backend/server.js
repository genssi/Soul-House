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
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

const corsOptions = {
    origin: ['https://mybaskets.online', 'https://www.mybaskets.online'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
};

app.use(express.json());
app.use(cors(corsOptions));

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const JWT_SECRET = process.env.JWT_SECRET;
const adminLogin = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

const generateToken = (username) => {
    return jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
};

app.options('*', cors());

app.post('/api/products', upload.single('image'), (req, res) => {
    const { name, price } = req.body;
    const image = req.file ? `https://mybaskets.online/api/uploads/${req.file.filename}` : null;

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

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === adminLogin && password === adminPassword) {
        const token = generateToken(username);
        if (!token) {
            console.log("Ошибка создания токена");
            return res.status(500).json({ success: false, message: 'Error generating token' });
        }
        console.log("Токен успешно создан:", token);
        res.status(200).json({ success: true, token });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.get('/api/products', (req, res) => {
    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }

        const products = JSON.parse(data).baskets;
        const { _start, _limit } = req.query;

        if (!_start && !_limit) {
            return res.json(products);
        }

        const start = parseInt(_start, 10) || 0;
        const limit = parseInt(_limit, 10) || products.length;

        const slicedProducts = products.slice(start, start + limit);

        res.json(slicedProducts);
    });
});

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

app.post('/api/products', (req, res) => {
    const newProduct = req.body;

    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        const jsonData = JSON.parse(data);
        newProduct.id = jsonData.baskets.length + 1;
        jsonData.baskets.push(newProduct);

        fs.writeFile('db.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи файла');
            }
            res.status(201).json(newProduct);
        });
    });
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        const jsonData = JSON.parse(data);
        const initialLength = jsonData.baskets.length;
        jsonData.baskets = jsonData.baskets.filter(product => product.id !== parseInt(id));

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

app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Server is running on https://mybaskets.online`);
});