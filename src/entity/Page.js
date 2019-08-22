export default class Page {
    constructor(data = {}) {
        this._id = data.id || 0;
        this._name = data.name || '';
        this._content = data.content || '';
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

    get content() {
        return this._content;
    }

    set content(value) {
        this._content = value;
    }
}
