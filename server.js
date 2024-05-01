// NOTE: list of all tasks

'use strict';

// Global
const _ = require(`lodash`);
// Local
const tasks = require(`./tasks`);
// Var


// console.info(`Time to understand the RPCServer`);

const {PeerRPCServer} = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');


const link = new Link({
	grape: 'http://127.0.0.1:30001',
	// grape: 'http://127.0.0.1:40001',
});

// console.log(`link > %j`, link);

link.start();

const peer = new PeerRPCServer(link, {
	timeout: 300000
});

// console.log(`peer > %j`, peer);
// console.log(`peer > `, peer);

peer.init();

const port = 1024 + Math.floor(Math.random() * 1000);
const service = peer.transport('server');

// console.log(`service > %j`, service);
// console.log(`service > `, service);

service.listen(port);

console.log(`TransportServer listening on port ${port}`);

const HEART_BEAT = 1000;
const Order = tasks?.Order;
const OrderBook = tasks?.OrderBook;
let orderBook = new OrderBook();

// console.log(`orderBook > `, orderBook);

setInterval(function () {
	let servicePort = service?.port;
	// console.log(`Time for announcing ; servicePort: ${servicePort} ---> `);

	link.announce('add_orders', servicePort, {}, (err, data) => {
		if (err) {
			console.error(`Error while announcing (add_orders) > `, err);
		}
		// console.log(`data > `, data);
		// console.log(`orderBook-status > `, orderBook);
	});

	link.announce('fibonacci_worker', servicePort, {}, (err, data) => {
		if (err) {
			console.error(`Error while announcing at (fibonacci_worker) > `, err);
		}
		// console.log(`data > `, data);
	});

	link.announce('rpc_test', servicePort, {}, (err, data) => {
		if (err) {
			console.error(`Error while announcing (rpc_test) > `, err);
		}
		// console.log(`data > `, data);
	});

}, HEART_BEAT);




service.on('request', async (rid, key, payload, handler) => {
	console.log(`request details ; rid: ${rid}, key: ${key}, handler: `, handler);
	console.log(`payload > %j`, payload);

	if (key === `add_orders`) {
		let orders = payload?.orders;
		if (_.isEmpty(orders)) {
			handler.reply({msg: `Empty orders`});
			return;
		}
		// We can filter orders using clientId to have separate OrderBook
		orders = orders.map((order = {}) => {
			if (_.isEmpty(order)) return;

			// if (_.isNil(order?.id)) {
			// 	order.id = orderBook.counter++;
			// } else if (order?.id <= orderBook.counter) {
			// 	return;
			// }

			let {id, type, price, quantity, clientId} = order;
			// id, type, price, quantity, clientId
			return new Order(id, type, price, quantity, clientId);
			// return new Order(...order);
		});
		let _orders = orders.map((order) => {
			if (_.isEmpty(order)) return;
			orderBook.addOrder(order);
			return order;
		});

		handler.reply(null, {_orders});
		return;
	} else if (key === `fibonacci_worker`) {
		const result = tasks.fibonacciTask(payload?.number);
		handler.reply(null, result);
		return;
	} else if (key === `rpc_test`) {
		handler.reply(null, {msg: 'world'});
		return;
	}

	handler.reply({msg: 'Unknown task found!'});
});

