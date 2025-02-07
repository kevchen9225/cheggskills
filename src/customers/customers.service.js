const knex = require("../db/connection");

const tableName = "customer";

function read(customer_id) {
  // Complete the implementation of this method.
  // TIP: Remember to use the .first() method to retrieve the first value.
  return knex(tableName).where({ id: customer_id }).first();
}

function create(newCustomer) {
  // Complete the implementation of this method.
  // TIP: Remember to add .then((createdData) =>s createdData[0]) at the end of your knex query.
  return knex(tableName)
    .insert(newCustomer, "*")
    .then((createdRecords) => createdRecords[0]);
}

module.exports = {
  create,
  read,
};
