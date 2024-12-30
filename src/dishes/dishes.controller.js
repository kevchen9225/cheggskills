const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function list(req, res) {
  res.status(200).json({ data: dishes });
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

function checkPositivePrice() {
  return function (req, res, next) {
    const { data: { price } = {} } = req.body;
    if (typeof price === "number" && price > 0) {
      return next();
    }
    res.status(400).json({ error: `price ${price} is not positive` });
  };
}

function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId(),
    name: name,
    description: description,
    price: price,
    image_url: image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  //   console.log("dishId", dishId, "dataId", foundDish.id);

  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `dish id not found ${dishId}`,
  });
}

function read(req, res, next) {
  res.json({ data: res.locals.dish });
}

function update(req, res, next) {
  const foundDish = res.locals.dish;
  const { data: { name, description, price, image_url, id } = {} } = req.body;

  foundDish.name = name;
  (foundDish.description = description), (foundDish.price = price);
  foundDish.image_url = image_url;

  if (foundDish.id === id || !id) {
    res.json({ data: foundDish });
    return next();
  }
  next({
    status: 400,
    message: `dishId in the route ${id} not matched dish id`,
  });
}

module.exports = {
  create: [
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    checkPositivePrice(),
    create,
  ],
  read: [dishExists, read],
  update: [
    dishExists,
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    checkPositivePrice(),
    update,
  ],
  list,
};
