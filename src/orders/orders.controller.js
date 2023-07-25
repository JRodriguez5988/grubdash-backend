const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

// Validations
function orderExists(req, res, next) {
    const orderId = req.params.orderId;
    const foundOrder = orders.find(order => order.id == orderId);
    if(!foundOrder) {
        next({
            status: 404,
            message: `Order does not exist: ${orderId}.`
        });
    };
    res.locals.order = foundOrder;
    next();
};

function bodyDataHas(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if(data[propertyName]) {
            next();
        };
        next({
            status: 400,
            message: `Dish must include a ${propertyName}`,
        });
    };
};

function dishesIsValid(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    if(dishes.length == 0 || !Array.isArray(dishes)) {
        next({
            status: 400,
            message: "Order must include at least one dish",
        });
    };
    next();
};

function dishQuantityIsValidNumber(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    dishes.forEach((dish, index) => {
        if(dish.quantity <= 0 || !Number.isInteger(dish.quantity)) {
            next({
                status: 400,
                message: `Dish ${index} must have a quantity that is an integer greater than 0`,
            });
        };
    });
    next();
};

function orderIdMatches(req, res, next) {
    const orderId = req.params.orderId;
    const { data: { id } = {} } = req.body;
    if(id) {
        id === orderId ? next() 
        : next({ 
            status: 400, 
            message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`,
        });
    };
    next();
};

function statusIsValid(req, res, next) {
    const { data: { status } = {} } = req.body;
    if(status == "pending" || status == "preparing" 
    || status == "out-for-delivery" || status == "delivered") {
        next();
    };
    next({
        status: 400,
        message: "Order must have a status of pending, preparing, out-for-delivery, delivered",
    });
};

function statusIsNotDelivered(req, res, next) {
    const { data: { status } = {} } = req.body;
    if(status !== "delivered") {
        next();
    };
    next({
        status: 400,
        message: `A delivered order cannot be changed`
    });
};

function statusIsPending(req, res, next) {
    const order = res.locals.order;
    if(order.status !== "pending") {
        next({
            status: 400,
            message: "An order cannot be deleted unless it is pending.",
        });
    };
    next();
};

// /orders handlers
function list(req, res) {
    res.json({ data: orders });
};

function create(req, res) {
    const newId = nextId();
    const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;
    const newOrder = {
        id: newId,
        deliverTo,
        mobileNumber,
        dishes,
    };
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
};

function read(req, res) {
    res.json({ data: res.locals.order });
};

function update(req, res) {
    const order = res.locals.order;
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    order.deliverTo = deliverTo;
    order.mobileNumber = mobileNumber;
    order.status = status;
    order.dishes = dishes;
    res.json({ data: order })
};

function destroy(req, res) {
    const index = res.locals.order;
    const deletedOrders = orders.splice(index, 1);
    res.sendStatus(204);
};

module.exports = {
    create: [
        bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("dishes"),
        dishesIsValid,
        dishQuantityIsValidNumber,
        create
    ],
    read: [
        orderExists,
        read,
    ],
    update: [
        orderExists,
        orderIdMatches,
        bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("dishes"),
        statusIsValid,
        statusIsNotDelivered,
        dishesIsValid,
        dishQuantityIsValidNumber,
        update,
    ],
    delete: [
        orderExists,
        statusIsPending,
        destroy,
    ],
    list,
}