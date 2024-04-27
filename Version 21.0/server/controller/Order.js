const { Order } = require("../model/Order");

exports.fetchOrdersByUser = async (req, res) => {
    const user = req.query.user;
    try {
        const orders = await Order.find({ user: user });
        console.log("~ Fetched an user's orders!");
        res.status(200).json(orders);
    }
    catch (err) {
        res.status(400).json(err);
    }
}

exports.createOrder = async (req, res) => {
    const order = new Order(req.body);

    order.save()
        .then(savedDocument => {
            console.log("~ Created an order!");
            res.status(201).json(savedDocument);
        })
        .catch(err => {
            res.status(400).json(err);
        });
}

exports.deleteOrder = async (req, res) => {
    const orderId = req.params.id;

    try {
        const removedOrder = await Order.findByIdAndDelete(orderId).exec();
        console.log("~ Removed an order!");
        res.status(200).json(removedOrder);
    }
    catch (err) {
        res.status(400).json(err);
    }
}

exports.updateOrder = async (req, res) => {
    const orderId = req.params.id;

    try {
        const order = await Order.findByIdAndUpdate(orderId, req.body, {new: true}).exec();
        console.log("~ Updated an order!");
        res.status(200).json(order);
    }
    catch (err) {
        res.status(400).json(err);
    }
}
