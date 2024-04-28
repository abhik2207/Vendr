const express = require('express');
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');

var session = require('express-session');
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const productRouter = require('./routes/Products');
const brandRouter = require('./routes/Brands');
const categoryRoutes = require('./routes/Categories');
const userRoutes = require('./routes/Users');
const authRoutes = require('./routes/Auth');
const cartRoutes = require('./routes/Cart');
const orderRoutes = require('./routes/Orders');
const { User } = require('./model/User');
const { isAuth, sanitizeUser } = require('./services/common');


const SECRET_KEY = 'TOP_SECRET';

// JWT Token authentication
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;


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
    'local',
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        async function (email, password, done) {
            try {
                const user = await User.findOne({ email: email }).exec();

                if (!user) {
                    console.log("~ No user found with provided email!");
                    return done(null, false, { message: 'User not found' });
                    // res.status(404).json({ message: 'User not found' });
                }

                crypto.pbkdf2(
                    password,
                    user.salt,
                    310000,
                    32,
                    'sha256',
                    async function (err, hashedPassword) {

                        if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                            console.log("~ Invalid login credentials!");
                            return done(null, false, { message: 'Invalid credentials' });
                            // res.status(401).json({ message: 'Invalid credentials' });
                        }
                        else {
                            console.log("~ Logged in a user!");
                            const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
                            return done(null, token);
                            // res.status(200).json({ id: user.id, name: user.name, email: user.email, addresses: user.addresses, role: user.role });
                            // res.status(200).json({ id: user.id, role: user.role });
                        }
                    }
                );
            }
            catch (err) {
                return done(err);
            }
        }
    )
);


// Passport middleware for JWT
passport.use(
    'jwt',
    new JwtStrategy(opts, async function (jwt_payload, done) {
        console.log({ jwt_payload });

        try {
            const user = await User.findOne({ id: jwt_payload.sub });
            if (user) {
                return done(null, sanitizeUser(user));
            } else {
                return done(null, false);
            }
        }
        catch (err) {
            return done(err, false);
        }

    })
);


// Serialized and Deserialized User
passport.serializeUser(function (user, cb) {
    console.log('SERIALIZE', user);
    process.nextTick(function () {
        return cb(null, { id: user.id, role: user.role });
    });
});
passport.deserializeUser(function (user, cb) {
    console.log('DESERIALIZE', user);
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
server.use('/products', isAuth(), productRouter.routes);
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