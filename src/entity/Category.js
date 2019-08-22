export default class Category {
    constructor(data = {}) {
        this._id = data.id || 0;
        this._name = data.name || '';
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }
}
