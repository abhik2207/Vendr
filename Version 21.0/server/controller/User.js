const { User } = require("../model/User");

exports.fetchUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId).exec();
        console.log("~ Fetched a user by ID!");
        res.status(200).json(user);
    }
    catch (err) {
        res.status(400).json(err);
    }
}

exports.updateUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByIdAndUpdate(userId, req.body, {new: true}).exec();
        console.log("~ Updated a user!");
        res.status(200).json(user);
    }
    catch (err) {
        res.status(400).json(err);
    }
}