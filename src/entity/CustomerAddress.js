
export default class CustomerAddress {
    constructor(data = {}) {
        this._first_name = data.first_name || '';
        this._last_name = data.last_name || '';
        this._address = data.address || '';
        this._address_line_1 = data.address_line_1 || '';
        this._phone = data.phone || '';
        this._country = data.country || '';
        this._city = data.city || '';
        this._post_code = data.post_code || '';
    }

    get first_name() {
        return this._first_name;
    }

    set first_name(value) {
        this._first_name = value;
    }

    get last_name() {
        return this._last_name;
    }

    set last_name(value) {
        this._last_name = value;
    }

    get address() {
        return this._address;
    }

    set address(value) {
        this._address = value;
    }

    get address_line_1() {
        return this._address_line_1;
    }

    set address_line_1(value) {
        this._address_line_1 = value;
    }

    get phone() {
        return this._phone;
    }

    set phone(value) {
        this._phone = value;
    }

    get country() {
        return this._country;
    }

    set country(value) {
        this._country = value;
    }

    get city() {
        return this._city;
    }

    set city(value) {
        this._city = value;
    }

    get post_code() {
        return this._post_code;
    }

    set post_code(value) {
        this._post_code = value;
    }
}