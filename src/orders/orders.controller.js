const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function list(req, res) {
  res.status(200).json({ data: orders });
}

function create(req, res) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo: deliverTo,
    mobileNumber: mobileNumber,
    status: status,
    dishes: dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    res.status(400).json({ error: `Must include ${propertyName}` });
  };
}

function checkDishesEmpty(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  if (Array.isArray(dishes) && dishes.length != 0) {
    res.locals.dishes = dishes;
    return next();
  }
  res.status(400).json({ error: `Order must include at least one dish` });
}

function checkStatusEmpty(req, res, next) {
  const { data: { status } = {} } = req.body;
  if (status && status.length != 0 && status !== "invalid") {
    res.locals.status = status;
    return next();
  }
  res.status(400).json({
    error: `Order must have a status of pending, preparing, out-for-delivery, delivered`,
  });
}

function checkValidOrder(req, res, next) {
  const dishes = res.locals.dishes;
  for (let index = 0; index < dishes.length; index++) {
    const quantity = dishes[index].quantity;
    if (!quantity || !Number.isInteger(quantity) || quantity === 0) {
      next({
        status: 400,
        message: `dish ${index} must have a quantity that is an integer greater than 0`,
      });
    }
  }
  next();
}

function checkOrderStatus(req, res, next) {
  const foundOrder = res.locals.order;
  if (foundOrder.status !== "pending") {
    return next({
      status: 400,
      message: `An order cannot be deleted unless it is pending. Returns a 400 status code`,
    });
  }
  next();
}

function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);

  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }
  next({
    status: 404,
    message: `order id not found ${orderId}`,
  });
}

function read(req, res, next) {
  res.json({ data: res.locals.order });
}

function update(req, res, next) {
  const foundOrder = res.locals.order;
  const { data: { deliverTo, mobileNumber, status, dishes, id } = {} } =
    req.body;

  foundOrder.deliverTo = deliverTo;
  (foundOrder.mobileNumber = mobileNumber), (foundOrder.status = status);
  foundOrder.dishes = dishes;

  if (foundOrder.id === id || !id) {
    res.json({ data: foundOrder });
    return next();
  }
  next({
    status: 400,
    message: `orderId in the route ${id} not matched order id`,
  });
}

function destroy(req, res, next) {
  const { orderId: orderId } = req.params;
  const index = orders.findIndex((order) => order.id === orderId);
  if (index > -1) {
    orders.splice(index, 1);
  }
  res.sendStatus(204);
}

module.exports = {
  list,
  create: [
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    checkDishesEmpty,
    checkValidOrder,
    create,
  ],
  read: [orderExists, read],
  update: [
    orderExists,
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    checkDishesEmpty,
    checkStatusEmpty,
    checkValidOrder,
    update,
  ],
  delete: [orderExists, checkOrderStatus, destroy],
};
