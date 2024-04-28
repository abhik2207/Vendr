const express = require('express');
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');

var session = require('express-session');
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const productRouter = require('./routes/Products');
const brandRouter = require('./routes/Brands');
const categoryRoutes = require('./routes/Categories');
const userRoutes = require('./routes/Users');
const authRoutes = require('./routes/Auth');
const cartRoutes = require('./routes/Cart');
const orderRoutes = require('./routes/Orders');
const { User } = require('./model/User');


// Using express session middleware
server.use(session({
    secret: 'abhik2207',
    resave: false,
    saveUninitialized: false
}));
server.use(passport.authenticate('session'));


// Initializing passport
// server.use(passport.initialize());
// server.use(passport.session());


// Passport middleware for LocalStrategy
passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        async function (email, password, done) {
            console.log('LocalStrategy ME AA GAYE');
            try {
                const user = await User.findOne({ email: email }).exec();

                if (!user) {
                    console.log("~ No user found with provided email!");
                    return done(null, false, { message: 'User not found' });
                    // res.status(404).json({ message: 'User not found' });
                }
                else if (user.password === password) {
                    console.log("~ Logged in a user!");
                    return done(null, user);
                    // res.status(200).json({ id: user.id, name: user.name, email: user.email, addresses: user.addresses, role: user.role });
                    // res.status(200).json({ id: user.id, role: user.role });
                }
                else {
                    console.log("~ Invalid login credentials!");
                    return done(null, false, { message: 'Invalid credentials' });
                    // res.status(401).json({ message: 'Invalid credentials' });
                }
            }
            catch (err) {
                return done(err);
            }
        }
    )
);


// Serialized and Deserialized User
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, { id: user.id, role: user.role });
    });
});
passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});


// Express Middlewares
server.use(cors({
    exposedHeaders: ['X-Total-Count']
}));
server.use(express.json());


// Routes
server.use('/products', productRouter.routes);
server.use('/brands', brandRouter.routes);
server.use('/categories', categoryRoutes.routes);
server.use('/users', userRoutes.routes);
server.use('/auth', authRoutes.routes);
server.use('/cart', cartRoutes.routes);
server.use('/orders', orderRoutes.routes);


// DB CONNECT
async function dbConnect() {
    await mongoose.connect('mongodb://127.0.0.1:27017/vendr');
    console.log(`-- DATABASE CONNECTED SUCCESFULLY  --`);
}
dbConnect().catch(err => console.log(err));


// Default route
server.get('/', (req, res) => {
    res.json({ status: 'API IS WORKING :)' });
});


// Listening at a port
server.listen(8080, () => {
    console.log(`-- SERVER STARTED AT ${8080} PORT SUCCESSFULLY --`);
});