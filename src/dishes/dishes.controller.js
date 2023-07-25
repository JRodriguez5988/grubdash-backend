const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

// Validations
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

function priceIsAValidNumber(req, res, next) {
        const { data: { price } = {} } = req.body;
        if(price <= 0 || !Number.isInteger(price)) {
            next({
                status: 400,
                message: "Dish must have a price that is an integer greater than 0"
            });
        };
        next();
};

function dishExists(req, res, next) {
    const dishId = req.params.dishId;
    const foundDish = dishes.find(dish => dish.id == dishId);
    if(!foundDish) {
        next({
            status: 404,
            message: `Dish does not exist: ${dishId}.`,
        });
    };
    res.locals.dish = foundDish;
    next();
};

function dishIdMatches(req, res, next) {
    const dishId = req.params.dishId;
    const { data: { id } = {} } = req.body;
    if(id) {
        id === dishId ? next() 
        : next({ 
            status: 400, 
            message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
        });
    };
    next();
};


// /dishes handlers
function list(req, res) {
    res.json({ data: dishes })
};

function create(req, res) {
    const newId = nextId();
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        id: newId,
        name,
        description,
        price,
        image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
};

function read(req, res) {
    res.json({ data: res.locals.dish })
};

function update(req, res) {
    const dish = res.locals.dish;
    const { data: { name, description, price, image_url } = {} } = req.body;
    dish.name = name;
    dish.description = description;
    dish.price = Number(price);
    dish.image_url = image_url;
    res.json({ data: dish });
};

module.exports = {
    create: [
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        priceIsAValidNumber,
        create,
    ],
    read: [
        dishExists,
        read,
    ],
    update: [
        dishExists,
        dishIdMatches,
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        priceIsAValidNumber,
        update,
    ],
    list,
};
