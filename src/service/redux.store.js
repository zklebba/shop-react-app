import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { shopReducer } from './shop/duck';
import { basketReducer } from './basket/duck';
import { checkoutReducer } from './checkout/duck';
import CONFIG from '../config';

const reducer = combineReducers({
    basket: basketReducer,
    shop: shopReducer,
    checkout: checkoutReducer,
});

const store = createStore(reducer, CONFIG.isDev ? composeWithDevTools() : undefined);

export default store;
