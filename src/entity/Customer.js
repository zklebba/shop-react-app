
export default class Customer {
    constructor(data = {}) {
        this._billing_address = data.billing_address || {};
        this._shipping_address = data.shipping_address || {};
        this._email = data.email || '';
    }

    get billing_address() {
        return this._billing_address;
    }

    set billing_address(value) {
        this._billing_address = value;
    }

    get shipping_address() {
        return this._shipping_address;
    }

    set shipping_address(value) {
        this._shipping_address = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }
}