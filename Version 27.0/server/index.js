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
const cookieParser = require('cookie-parser');

const productRouter = require('./routes/Products');
const brandRouter = require('./routes/Brands');
const categoryRoutes = require('./routes/Categories');
const userRoutes = require('./routes/Users');
const authRoutes = require('./routes/Auth');
const cartRoutes = require('./routes/Cart');
const orderRoutes = require('./routes/Orders');
const { User } = require('./model/User');
const { isAuth, sanitizeUser, cookieExtractor } = require('./services/common');


const SECRET_KEY = 'TOP_SECRET';

// JWT Token authentication
var opts = {}
opts.jwtFromRequest = cookieExtractor;
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
                            const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
                            console.log("~ Logged in a user!");
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
            const user = await User.findById(jwt_payload.id);
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
// server.use(express.raw({ type: 'application/json' }));
server.use(express.static('build'));
server.use(cookieParser());
server.use(cors({
    exposedHeaders: ['X-Total-Count']
}));
server.use(express.json());


// Routes
server.use('/products', isAuth(), productRouter.routes);
server.use('/brands', isAuth(), brandRouter.routes);
server.use('/categories', isAuth(), categoryRoutes.routes);
server.use('/users', isAuth(), userRoutes.routes);
server.use('/auth', authRoutes.routes);
server.use('/cart', isAuth(), cartRoutes.routes);
server.use('/orders', isAuth(), orderRoutes.routes);































// PAYMENTS
const stripe = require("stripe")('sk_test_51PBYfMSG1m7bvcI2xtvlBqWwatEPNHXlYVr9j119g0jEsmQerF04aZeEegfxQ98ziOLrLLe2lQYgariBo3d2d0in00jQCZUHpU');

server.post("/create-payment-intent", async (req, res) => {
    const { totalAmount } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        // amount: totalAmount * 100,
        currency: "inr",
        automatic_payment_methods: {
            enabled: true,
        },
        // payment_method: 'pm_card_visa',
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

































// WEBHOOK
const endpointSecret = "whsec_f5e41c70f23ef25f324f33e6c35f2dc736e9f4bac35cd7a6ef7184073141ef2c";
server.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            // Then define and call a function to handle the event payment_intent.succeeded
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});







































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