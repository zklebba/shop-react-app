import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DelayedRedirect from "./DelayedRedirect";
import { Redirect } from "react-router-dom";
import CONFIG from '../config';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'

class PaymentComponent extends Component {
    constructor(props) {
        super(props);

        this.api = props.api;
        this.order = props.order;

        this.state = {
            checkoutResponseData: {},
        };

        this.renderLoading = this.renderLoading.bind(this);
        this.renderOrderState = this.renderOrderState.bind(this);
        this.loadPayment = this.loadPayment.bind(this);
    }

    componentDidMount() {
        // Loading stripe
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = CONFIG.stripe_script_url;

        document.getElementsByTagName('head')[0].appendChild(script);

        if (this.order && this.order.details.length) {
            (async () => {
                let checkoutResponseData = await this.api.checkout(this.order);

                this.setState({
                    ...this.state,
                    checkoutResponseData: checkoutResponseData,
                });
            })();
        }
    }

    loadPayment(sessionId) {
        let stripe = Stripe(CONFIG.stripe_pk);

        stripe.redirectToCheckout({
            // Make the id field from the Checkout Session creation API response
            // available to this file, so you can provide it as parameter here
            // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
            sessionId: sessionId
        }).then(function (result) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
        });

        return null;
    }

    renderLoading() {
        return (
            <React.Fragment>
                Your order is being processed. Rest, relax and wait a moment.
            </React.Fragment>
        );
    }

    renderOrderState() {
        if (this.state.checkoutResponseData) {
            if (this.state.checkoutResponseData.payment && this.state.checkoutResponseData.payment.sessionId) {
                return this.loadPayment(this.state.checkoutResponseData.payment.sessionId);
            } else {
                return this.renderLoading();
            }
        } else {
            return (
                <DelayedRedirect from="/payment" to="/checkout/error" />
            );
        }
    }

    render() {
        if (this.order && this.order.details.length) {
            return this.renderOrderState();
        } else {
            return (
                <Redirect from="/payment" to="/checkout" />
            );
        }
    }
}

PaymentComponent.propTypes = {
    order: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    // Prepare order object to be api friendly

    let order = state.checkout.order;

    let billing_address = order.customer.billing_address;
    let shipping_address = order.customer.shipping_address;

    let data = {
        customer: {
            email: order.customer.email,
            billing_address: {
                first_name: billing_address.first_name,
                last_name: billing_address.last_name,
                address: billing_address.address,
                address_line_1: billing_address.address_line_1,
                phone: billing_address.phone,
                country: billing_address.country,
                city: billing_address.city,
                post_code: billing_address.post_code,
            },
            shipping_address: {
                first_name: shipping_address.first_name,
                last_name: shipping_address.last_name,
                address: shipping_address.address,
                address_line_1: shipping_address.address_line_1,
                phone: shipping_address.phone,
                country: shipping_address.country,
                city: shipping_address.city,
                post_code: shipping_address.post_code,
            }
        },
        comment: order.comment,
        details: []
    };

    for (let detail of order.details) {
        data.details.push({
            product: detail.product.id,
            quantity: detail.quantity,
            price: detail.price,
        });
    }

    return {
        order: data,
    };
};

export default withRouter(connect(mapStateToProps)(PaymentComponent))

