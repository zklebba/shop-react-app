import Product from "../entity/Product";
import Order from "../entity/Order";
import OrderDetail from "../entity/OrderDetail";

const axios = require('axios');

import CONFIG from '../config';
import Category from "../entity/Category";
import Page from "../entity/Page";

export default class ShopApiService
{
    constructor() {
        this.baseUrl = CONFIG.apiBaseUrl;
    }

    async getProducts(categoryId = null) {
        try {
            let response = null;

            if (categoryId) {
                response = await axios.get(this.baseUrl + '/products/category/' + categoryId);
            } else {
                response = await axios.get(this.baseUrl + '/products/list');
            }

            let products = [];

            for (let productData of response.data) {
                productData['category'] = new Category({
                    id: productData.category_id,
                    name: productData.category_name,
                });

                products.push(new Product(productData));
            }

            if (products.length) {
                return products;
            } else {
                return false;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async getProduct(id) {
        try {
            let response = await axios.get(this.baseUrl + '/product/' + id);

            let title = '';
            if (response.data.details && response.data.details.title) {
                title = response.data.details.title;
            }

            let longDescription = '';
            if (response.data.details && response.data.details.long_description) {
                longDescription = response.data.details.long_description;
            }

            let category = new Category({
                id: response.data.category.id,
                name: response.data.category.name,
            });

            return new Product({
                id: response.data.id,
                name: response.data.name,
                description: response.data.description,
                price: response.data.price,
                picture: response.data.picture,
                quantity: response.data.stock.quantity,
                title: title,
                longDescription: longDescription,
                category: category,
            });
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async getOrders(accessCode) {
        try {
            let response = await axios.get(this.baseUrl + '/orders/' + accessCode);
            let ordersData = response.data;
            let orders = [];

            for (let data of ordersData) {

                let order = new Order({
                    number: data.number,
                    date: Date.parse(data.order_date),
                    status: data.status,
                });

                let details = [];

                for (let detail of data.order_details) {
                    let title = '';
                    if (detail.product.details && detail.product.details.title) {
                        title = detail.product.details.title;
                    }

                    let longDescription = '';
                    if (detail.product.details && detail.product.details.long_description) {
                        longDescription = detail.product.details.long_description;
                    }

                    let product = new Product({
                        id: detail.product.id,
                        name: detail.product.name,
                        description: detail.product.description,
                        price: detail.product.price,
                        picture: detail.product.picture,
                        quantity: detail.product.stock.quantity,
                        title: title,
                        longDescription: longDescription,
                    });


                    details.push(new OrderDetail({
                        id: detail.id,
                        price: detail.price,
                        quantity: detail.quantity,
                        product: product
                    }));
                }

                order.details = details;

                orders.push(order);
            }

            if (orders.length) {
                return orders;
            } else {
                return false;
            }
        } catch (e) {
            if (e.isAxiosError && e.response.status === 401) {
                return 401;
            }

            return false;
        }
    }

    async checkout(order, config) {
        try {
            let response = await axios.post(this.baseUrl + '/checkout', {
                order: order,
                paymentConfig: config,
            });

            order.id = response.data.orderId;
            order.payment = response.data.payment;

            return order;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async getCategories() {
        try {
            let response = await axios.get(this.baseUrl + '/category');
            let categories = [];

            for (let categoryData of response.data) {
                categories.push(new Category({
                    id: categoryData.id,
                    name: categoryData.name,
                }));
            }

            return categories;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async getCategory(categoryId) {
        try {
            let response = await axios.get(this.baseUrl + '/category/' + categoryId);

            return new Category({
                id: response.data.id,
                name: response.data.name,
            })
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async sendContactMessage(data) {
        try {
            let response = await axios.post(this.baseUrl + '/contact/send', data);

            if (response.data.status) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async getPagesList() {
        try {
            let response = await axios.get(this.baseUrl + '/page/list');

            let pages = [];

            for (let pageData of response.data) {
                pages.push(new Page({
                    id: pageData.id,
                    name: pageData.name,
                }));
            }

            return pages;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async getPage(pageId) {
        try {
            let response = await axios.get(this.baseUrl + '/page/' + pageId);

            return new Page({
                id: response.data.id,
                name: response.data.name,
                content: response.data.content,
            })
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async askForOrdersAccess(email) {
        try {
            let response = await axios.post(this.baseUrl + '/orders/access-ask', {
                email: email
            });

            return response.data;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}
