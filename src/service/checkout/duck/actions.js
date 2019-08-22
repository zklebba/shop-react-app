import types from './types';

const setOrderToCheckout = (order) => ({
    type: types.SET_ORDER_TO_CHECKOUT,
    order: order
});

const reset = () => ({
    type: types.RESET,
});

export default {
    setOrderToCheckout, reset
}

