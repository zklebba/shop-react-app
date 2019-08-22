import types from './types';

const add = (product, quantity = 1) => ({
    type: types.ADD,
    quantity: quantity,
    product: product,
});

const changeQuantity = (id, quantity) => ({
    type: types.CHANGE_QUANTITY,
    id: id,
    quantity: quantity
});

const remove = id => ({
    type: types.REMOVE,
    id: id,
});

const reset = () => ({
    type: types.RESET,
});

export default {
    add, changeQuantity, remove, reset
}

