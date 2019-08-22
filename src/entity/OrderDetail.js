
export default class OrderDetail {
    constructor(data = {}) {
        this._id = data.id || 0;
        this._price = data.price || '';
        this._product = data.product || '';
        this._quantity = data.quantity || [];
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }

    get product() {
        return this._product;
    }

    set product(value) {
        this._product = value;
    }

    get quantity() {
        return this._quantity;
    }

    set quantity(value) {
        this._quantity = value;
    }
}