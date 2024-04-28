const { User } = require("../model/User");
const crypto = require('crypto');
const { sanitizeUser } = require("../services/common");
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    // const user = new User(req.body);
    const SECRET_KEY = 'TOP_SECRET';

    try {
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(
            req.body.password,
            salt,
            310000,
            32,
            'sha256',
            async function (err, hashedPassword) {
                const user = new User({ ...req.body, password: hashedPassword, salt: salt });

                const document = await user.save();

                req.login(sanitizeUser(document), (err) => {
                    if (err) {
                        res.status(400).json(err);
                    }
                    else {
                        const token = jwt.sign(sanitizeUser(document), SECRET_KEY);
                        console.log("~ Created a user!");
                        res.status(201).json(token);
                    }
                });
            }
        );
    }
    catch (err) {
        res.status(400).json(err);
    }
};

exports.loginUser = async (req, res) => {
    // try {
    //     const user = await User.findOne({ email: req.body.email }).exec();

    //     if (!user) {
    //         console.log("~ No user found with provided email!");
    //         res.status(404).json({ message: 'User not found' });
    //     }
    //     else if (user.password === req.body.password) {
    //         console.log("~ Logged in a user!");
    //         res.status(200).json({ id: user.id, name: user.name, email: user.email, addresses: user.addresses, role: user.role });
    //         // res.status(200).json({ id: user.id, role: user.role });
    //     }
    //     else {
    //         console.log("~ Invalid login credentials!");
    //         res.status(401).json({ message: 'Invalid credentials' });
    //     }
    // }
    // catch (err) {
    //     res.status(400).json(err);
    // }

    // res.json({status: 'success'});
    res.json(req.user);
};

exports.checkUser = async (req, res) => {
    res.json({status: 'success', user: req.user});
};