
const ORDER_STATUS_ID = {
    ORDER_STATUS_OPEN: 1,
    ORDER_STATUS_PROCESSING: 2,
    ORDER_STATUS_COMPLETE: 3,
    ORDER_STATUS_CANCELED: 4,
};

const ORDER_STATUS = {
    [ORDER_STATUS_ID.ORDER_STATUS_OPEN]: 'waiting for payment',
    [ORDER_STATUS_ID.ORDER_STATUS_PROCESSING]: 'payment processing',
    [ORDER_STATUS_ID.ORDER_STATUS_COMPLETE]: 'order complete',
    [ORDER_STATUS_ID.ORDER_STATUS_CANCELED]: 'order canceled',
};

class OrdersService {
    getOrderTotal(order) {
        let total = 0;

        for (let detail of order.details) {
            total += detail.price * detail.quantity;
        }

        return total;
    }

    getStatusText(statusId) {
        return ORDER_STATUS[statusId];
    }
}

const OrderService = new OrdersService();

export {
    OrderService,
    ORDER_STATUS_ID,
    ORDER_STATUS
};
