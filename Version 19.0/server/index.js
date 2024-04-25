const express = require('express');
const server = express();
const mongoose = require('mongoose');
const productRouter = require('./routes/Products');
const brandRouter = require('./routes/Brands');
const categoryRoutes = require('./routes/Categories');
const cors = require('cors');

// Middlewares
server.use(express.json());
server.use(cors({
    exposedHeaders: ['X-Total-Count']
}));

// Routes
server.use('/products', productRouter.routes);
server.use('/brands', brandRouter.routes);
server.use('/categories', categoryRoutes.routes);

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