import types from './types';
import ProductService from '../../product.service';
import SessionStorageService from '../../session.storage.service';
import CONFIG from '../../../config';

const CLEAN_STATE = {
    total: 0,
    count: 0,
    products: {},
};

const INIT_STATE = SessionStorageService.loadBasketState(CONFIG.sessionStorageBasketKey) || CLEAN_STATE;

const reducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case types.ADD: {
            let product = action.product;
            let id = product.id;
            let quantity = action.quantity || 1;
            let avilQuantity = ProductService.getProductAvaliableQuantity(product, state);

            if (quantity > avilQuantity) {
                quantity = avilQuantity;
            }

            if (state.products.hasOwnProperty(id)) {
                let productInfo = state.products[id];

                quantity = productInfo.quantity + action.quantity;
            }

            let total = state.total + (product.price * action.quantity);
            let count = state.count + action.quantity;

            let newState = {
                ...state,
                total: total,
                count: count,
                products: {
                    ...state.products,
                    [action.product.id]: {
                        quantity: quantity,
                        product: product,
                    },
                }
            };

            SessionStorageService.saveAsync(CONFIG.sessionStorageBasketKey, newState);

            return newState;
        }

        case types.CHANGE_QUANTITY: {
            let id = action.id;
            let productInfo = state.products[id];
            let product = productInfo.product;
            let currentQuantity = productInfo.quantity;
            let currentTotal = state.total;
            let currentCount = state.count;
            let quantity = action.quantity;

            let avilQuantity = ProductService.getProductAvaliableQuantity(product, state);

            if (quantity > avilQuantity) {
                quantity = avilQuantity;
            }

            let newProductInfo = {
                quantity: quantity,
                product: product
            };

            let newCount = currentCount - currentQuantity + quantity;
            let newTotal = currentTotal - (currentQuantity * product.price) + (quantity * product.price);

            if (newTotal < 0) {
                newTotal = 0;
            }

            productInfo.quantity = quantity;

            let newState = {
                ...state,
                total: newTotal,
                count: newCount,
                products: {
                    ...state.products,
                    [id]: newProductInfo
                }
            };

            SessionStorageService.saveAsync(CONFIG.sessionStorageBasketKey, newState);

            return newState;
        }

        case types.REMOVE: {
            let productInfo = state.products[action.id];
            let product = productInfo.product;
            let currentQuantity = productInfo.quantity;
            let currentTotal = state.total;
            let currentCount = state.count;

            let newCount = currentCount - currentQuantity;
            let newTotal = currentTotal - (currentQuantity * product.price);

            if (newTotal < 0) {
                newTotal = 0;
            }

            let products = state.products;
            delete products[action.id];

            let newState = {
                ...state,
                total: newTotal,
                count: newCount,
                products: products
            };

            SessionStorageService.saveAsync(CONFIG.sessionStorageBasketKey, newState);

            return newState;
        }

        case types.RESET: {
            SessionStorageService.saveAsync(CONFIG.sessionStorageBasketKey, CLEAN_STATE);
            return CLEAN_STATE;
        }

        default:
            return state
    }
};

export default reducer;
