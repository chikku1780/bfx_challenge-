// NOTE: list of all tasks

'use strict';

// Global
// Local
// Var


// console.info(`Time to understand the RPCClient`);

const {PeerRPCClient} = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');

const link = new Link({
	grape: 'http://127.0.0.1:30001',
	// grape: 'http://127.0.0.1:40001',
});
console.log(`link > %j`, link);
link.start();

const peer = new PeerRPCClient(link, {});

// console.log(`peer > %j`, peer);
// console.log(`peer > `, peer);

peer.init();

doTheWork().then(() => {
	console.log(`All the tasks were completed`);
});

async function doTheWork() {
	try {
		// let rpcTestStatus = await rpcTest();
		// let fibonacciTestStatus = await fibonacciTest();

		let clientDetails = {
			clientId: `client_id_1`,
			clientName: `client_name_1`,
		};
		// id, type, price, quantity, clientId
		let orders1 = [
			{id: 1, type: 'BUY', price: 100, quantity: 10},
			{id: 2, type: 'BUY', price: 90, quantity: 5},
			{id: 3, type: 'BUY', price: 60, quantity: 2},
		];
		let orderBookStatus1 = await addOrdersToOrderBook(clientDetails, orders1);

		let orders2 = [
			{id: 4, type: 'SELL', price: 95, quantity: 7},
			{id: 5, type: 'SELL', price: 100, quantity: 2},
			{id: 6, type: 'SELL', price: 20, quantity: 40},
		];
		let orderBookStatus2 = await addOrdersToOrderBook(clientDetails, orders2);

		// let rpcTestStatus = await rpcTest();
		// let fibonacciTestStatus = await fibonacciTest();
	} catch (err) {
		console.error(`===========================> Error-doTheWork > `, err);
		throw err;
		// return;
	}
}

async function addOrdersToOrderBook(clientDetails, orders) {
	return new Promise((resolve, reject) => {
		orders = orders?.map((order = {}) => {
			order.clientId = clientDetails?.clientId;
			return order;
		});
		let payload = {
			orders,
		};
		peer.request('add_orders', payload, {timeout: 100000}, (err, result) => {
			if (err) {
				console.error(`--------------------> Error-add_orders > `, err);
				return reject(err);
				// process.exit(-1);
			}
			console.log(`add_orders - result > %j`, result);
			return resolve(result);
		});
	});
}

async function fibonacciTest() {
	return new Promise((resolve, reject) => {
		let payload = {number: 10};
		peer.request('fibonacci_worker', payload, {timeout: 100000}, (err, result) => {
			if (err) {
				console.error(`--------------------> Error-fibonacciTest > `, err);
				return reject(err);
				// throw err;
			}
			console.log(`Fibonacci number at place number: ${payload?.number} in the sequence: ${result}`);
			return resolve(result);
		});
	});

}


async function rpcTest() {
	return new Promise((resolve, reject) => {
		let payload = {msg: 'hello'};
		peer.request('rpc_test', payload, {timeout: 10000}, (err, data) => {
			if (err) {
				console.error(`--------------------> Error-rpcTest > `, err);
				return reject(err);
				// process.exit(-1);
			}
			console.log(data); // { msg: 'world' }
			return resolve(data);
		});
	});
}



