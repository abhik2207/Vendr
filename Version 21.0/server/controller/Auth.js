const { User } = require("../model/User");

exports.createUser = (req, res) => {
    const user = new User(req.body);

    user.save()
        .then(savedDocument => {
            console.log("~ Created a user!");
            res.status(201).json(savedDocument);
        })
        .catch(err => {
            res.status(400).json(err);
        });
};

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).exec();

        if (!user) {
            console.log("~ No user found with provided email!");
            res.status(404).json({ message: 'User not found' });
        }
        else if (user.password === req.body.password) {
            console.log("~ Logged in a user!");
            res.status(200).json({ id: user.id, name: user.name, email: user.email, addresses: user.addresses, role: user.role });
        }
        else {
            console.log("~ Invalid login credentials!");
            res.status(401).json({ message: 'Invalid credentials' });
        }

    }
    catch (err) {
        res.status(400).json(err);
    }
};