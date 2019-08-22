import types from './types';

const CLEAN_STATE = {
    order: {},
};

const reducer = (state = CLEAN_STATE, action) => {
    switch (action.type) {
        case types.SET_ORDER_TO_CHECKOUT: {
            return {
                ...state,
                order: action.order,
            }
        }

        case types.RESET: {
            return CLEAN_STATE;
        }

        default:
            return state
    }
};

export default reducer;
