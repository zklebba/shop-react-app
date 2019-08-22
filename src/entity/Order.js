
export default class Order {
    constructor(data = {}) {
        this._id = data.id || 0;
        this._number = data.number || 0;
        this._date = data.date || '';
        this._status = data.status || '';
        this._customer = data.customer || {};
        this._comment = data.comment || '';
        this._details = data.details || [];
    }

    get number() {
        return this._number;
    }

    set number(value) {
        this._number = value;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get status() {
        return this._status;
    }

    set status(value) {
        this._status = value;
    }

    get customer() {
        return this._customer;
    }

    set customer(value) {
        this._customer = value;
    }

    get comment() {
        return this._comment;
    }

    set comment(value) {
        this._comment = value;
    }

    get details() {
        return this._details;
    }

    set details(value) {
        this._details = value;
    }
}
