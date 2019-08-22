import Product from "../entity/Product";

class SessionStorageService {
    save(key, data, serialize = true) {

        if (serialize) {
            let serializedData = JSON.stringify(data);
            window.sessionStorage.setItem(key, serializedData);
        } else {
            window.sessionStorage.setItem(key, data);
        }

        return data;
    }

    async saveAsync(key, data, serialize = true) {
        return new Promise((resolve) => {
            let result = this.save(key, data, serialize);
            resolve(result);
        });
    }

    load(key, isSerialized = true) {
        let data = window.sessionStorage.getItem(key);

        if (data) {
            if (isSerialized) {
                try {
                    return JSON.parse(data) || null;
                } catch (e) {
                    return null;
                }
            } else {
                return data;
            }
        } else {
            return null;
        }
    }

    _mapToObject(data, targetObject) {
        let properties = Object.getOwnPropertyDescriptors(targetObject);

        for (let propKey in properties) {
            properties[propKey].value = data[propKey];
        }

        return Object.defineProperties(targetObject, properties);
    }

    loadBasketState(key) {
        let data = this.load(key);

        if (data) {
            let newProducts = {};
            let products = data.products;

            for (let id in products) {
                if (products.hasOwnProperty(id)) {
                    let productInfo = products[id];

                    newProducts[id] = {
                        product: this._mapToObject(productInfo.product, new Product()),
                        quantity: productInfo.quantity
                    };
                }
            }

            data.products = newProducts;

            return data;
        } else {
            return null;
        }
    }
}

export default new SessionStorageService();
