const { Order } = require("../model/Order");

exports.fetchOrdersByUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const orders = await Order.find({ user: userId });
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

exports.fetchALlOrders = async (req, res) => {
    let query = Order.find({ deleted: { $ne: true } });
    let totalOrdersQuery = Order.find({ deleted: { $ne: true } });

    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
    }
    if (req.query._page && req.query._limit) {
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    const totalDocs = await totalOrdersQuery.count().exec();
    console.log('~ TOTAL ORDER DOCS: ', totalDocs);

    try {
        const docs = await query.exec();
        res.set('X-Total-Count', totalDocs);
        console.log("~ Fetched all orders!");
        res.status(200).json(docs);
    }
    catch (err) {
        res.status(400).json(err);
    }
};
