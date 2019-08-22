
class Product {
    constructor(data = {}) {
        this._id = data.id || 0;
        this._name = data.name || '';
        this._description = data.description || '';
        this._price = data.price || 0;
        this._picture = data.picture || '';
        this._quantity = data.quantity || 0;
        this._title = data.title || '';
        this._longDescription = data.longDescription || '';
        this._category = data.category || null;
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

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }

    get picture() {
        return this._picture;
    }

    set picture(value) {
        this._picture = value;
    }

    get quantity() {
        return this._quantity;
    }

    set quantity(value) {
        this._quantity = value;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get longDescription() {
        return this._longDescription;
    }

    set longDescription(value) {
        this._longDescription = value;
    }

    get category() {
        return this._category;
    }

    set category(value) {
        this._category = value;
    }
}

export default Product;
