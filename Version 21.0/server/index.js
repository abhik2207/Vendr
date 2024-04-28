const express = require('express');
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');
const productRouter = require('./routes/Products');
const brandRouter = require('./routes/Brands');
const categoryRoutes = require('./routes/Categories');
const userRoutes = require('./routes/Users');
const authRoutes = require('./routes/Auth');
const cartRoutes = require('./routes/Cart');
const orderRoutes = require('./routes/Orders');

// Middlewares
server.use(express.json());
server.use(cors({
    exposedHeaders: ['X-Total-Count']
}));

// Routes
server.use('/products', productRouter.routes);
server.use('/brands', brandRouter.routes);
server.use('/categories', categoryRoutes.routes);
server.use('/users', userRoutes.routes);
server.use('/auth', authRoutes.routes);
server.use('/cart', cartRoutes.routes);
server.use('/orders', orderRoutes.routes);

async function dbConnect() {
    await mongoose.connect('mongodb://127.0.0.1:27017/vendr');
    console.log(`-- DATABASE CONNECTED SUCCESFULLY SUCCESSFULLY --`);
}
dbConnect().catch(err => console.log(err));

server.get('/', (req, res) => {
    res.json({ status: 'success' });
});

server.listen(8080, () => {
    console.log(`-- SERVER STARTED AT ${8080} PORT SUCCESSFULLY --`);
});