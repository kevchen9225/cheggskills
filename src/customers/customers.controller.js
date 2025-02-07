const service = require("./customers.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function customerExists(req, res, next) {
  const { customerId } = req.params;

  const customer = await service.read(customerId);

  if (customer) {
    res.locals.customer = customer;
    return next();
  }
  next({ status: 404, message: `Customer id not found: ${customerId}` });
}

function read(req, res) {
  // Complete the implementation of this method.
  const { customer } = res.locals;
  res.json({ data: customer });
}

async function create(req, res) {
  // Complete the implementation of this method.
  console.log(req.body);
  const {
    data: { name, address, date_joined, contact_name, contact_number } = {},
  } = req.body;
  const newCustomer = {
    id: 3,
    name: name,
    address: address,
    date_joined: date_joined,
    contact_name: contact_name,
    contact_number: contact_number,
  };
  res.status(201).json({ data: newCustomer });
}

// Make sure exports are correct.
module.exports = {
  rsead: [asyncErrorBoundary(customerExists), read],
  create,
};
