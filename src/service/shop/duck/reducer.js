import types from './types';
import SessionStorageService from '../../session.storage.service';
import CONFIG from "../../../config";

const CLEAN_STATE = {
    currentPageName: '',
    ordersAccessCode: '',
};

const INIT_STATE = {
    ...CLEAN_STATE,
    ordersAccessCode: SessionStorageService.load(CONFIG.sessionStorageOrdersAccessKey, false) || '',
};

const reducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case types.CHANGE_CURRENT_PAGE: {
            let name = action.currentPageName;

            return {
                ...state,
                currentPageName: name,
            }
        }

        case types.SET_ORDERS_ACCESS_CODE: {
            let code = action.ordersAccessCode;

            SessionStorageService.saveAsync(CONFIG.sessionStorageOrdersAccessKey, code, false);

            return {
                ...state,
                ordersAccessCode: code,
            }
        }

        default:
            return state
    }
};

export default reducer;
