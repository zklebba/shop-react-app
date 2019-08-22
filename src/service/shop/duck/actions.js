import types from './types';

const changeCurrentPage = name => ({
    type: types.CHANGE_CURRENT_PAGE,
    currentPageName: name
});

const setOrdersAccessCode = code => ({
    type: types.SET_ORDERS_ACCESS_CODE,
    ordersAccessCode: code,
});

export default {
    changeCurrentPage,
    setOrdersAccessCode,
}

