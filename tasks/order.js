class Order {
	constructor(id, type, price, quantity, clientId) {
		this.id = id;
		this.type = type; // "BUY" or "SELL"
		this.price = price;
		this.quantity = quantity;
		this.clientId = clientId;
	}
}

class OrderBook {
	constructor() {
		// this.orders = [];
		this.buyOrders = [];
		this.sellOrders = [];
		this.counter = 0;
	}

	// Add a new order to the order book
	addOrder(order) {
		let orderType = order?.type;
		if (orderType === 'BUY') {
			this.buyOrders.push(order);
		} else if (orderType === 'SELL') {
			this.sellOrders.push(order);
		} else {
			console.error('Invalid order type');
		}
		console.log(`Order ${order?.id} added to the [order-book]: ${orderType} - ${order?.quantity} @ ${order?.price}`);
		console.log(`================ matchOrders: BEGIN ================ `);
		this.matchOrders();
		console.log(`================ matchOrders: END ================ `);
	}

	// Match buy and sell orders
	matchOrders() {
		while (this.buyOrders.length > 0 && this.sellOrders.length > 0) {
			const buyOrder = this.buyOrders?.[0];
			const sellOrder = this.sellOrders?.[0];

			// Check if there is a match
			if (buyOrder?.price >= sellOrder?.price) {
				this.trade(buyOrder, sellOrder);
				// Remove orders if fully matched
				if (buyOrder?.quantity === 0) {
					console.log(`Order ${buyOrder?.id} filled`);
					this.buyOrders.shift();
				}
				if (sellOrder?.quantity === 0) {
					console.log(`Order ${sellOrder?.id} filled`);
					this.sellOrders.shift();
				}
			} else {
				// No match found
				break;
			}
		}
	}

	// Execute a trade between two orders
	trade(buyOrder, sellOrder) {

		console.log(`buyOrder-0 > %j`, buyOrder);
		console.log(`sellOrder-0 > %j`, sellOrder);

		// Calculate matched quantity
		const matchedQuantity = Math.min(buyOrder?.quantity, sellOrder?.quantity);

		// Log the matched trade
		console.log(`Matched trade: ${buyOrder?.type} ${matchedQuantity} @ ${buyOrder?.price}`);

		// Update order quantities
		buyOrder.quantity -= matchedQuantity;
		sellOrder.quantity -= matchedQuantity;

		console.log(`buyOrder > %j`, buyOrder);
		console.log(`sellOrder > %j`, sellOrder);
	}
}

module.exports = {
	Order,
	OrderBook,
};
