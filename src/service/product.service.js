class ProductService {

    /**
     * Calculate avaliable quantity of product - removing current quantity in basket
     */
    getProductAvaliableQuantity(product, basketState = null) {
        let productInfo = this._getProductInfoFromBasket(product.id, basketState);

        if (productInfo) {
            return product.quantity - productInfo.quantity;
        } else {
            return product.quantity;
        }
    }

    _getProductInfoFromBasket(productId, basketState = null) {
        let products = {};

        if (basketState === null) {
            const redux = require('./redux.store');
            products = redux.default.getState().basket.products;
        } else {
            products = basketState.products;
        }

        if (products.hasOwnProperty(productId)) {
            return products[productId];
        } else {
            return null;
        }
    }

}

export default new ProductService();
