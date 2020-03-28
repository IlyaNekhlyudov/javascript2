const add = (order, req) => {
    order.contents.push(req.body);
    return { name: req.body.order_name, newOrder: JSON.stringify(order, null, 4) }
};

module.exports = {
    add,
};