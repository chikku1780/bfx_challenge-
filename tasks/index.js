// NOTE: list of all tasks

'use strict';

// Global
// Local
const testTasks = require(`./testTasks`);
const order = require(`./order`);
// Var
const fibonacciTask = testTasks.fibonacci;
const Order = order.Order;
const OrderBook = order.OrderBook;


module.exports = {
	Order,
	OrderBook,
	fibonacciTask,
};
