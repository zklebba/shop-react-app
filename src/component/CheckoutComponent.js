import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import AlertMessageComponent from "./AlertMessageComponent";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import PaymentIcon from '@material-ui/icons/Payment';
import Divider from '@material-ui/core/Divider';
import { formatMoney } from '../service/localeFormat';
import { Link, withRouter } from 'react-router-dom'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from "@material-ui/core/Box";
import TableFooter from '@material-ui/core/TableFooter';
import DelayedRedirect from "./DelayedRedirect";
import { basketActions } from "../service/basket/duck";
import { shopActions } from "../service/shop/duck";
import { checkoutActions } from "../service/checkout/duck";
import AdressDetailsFormComponent from "./AdressDetailsFormComponent";
import Grid from "@material-ui/core/Grid";
import CheckoutDetailsFormComponent from "./CheckoutDetailsFormComponent";
import { Redirect } from "react-router-dom";
import CustomerBillingAddress from "../entity/CustomerBillingAddress";
import CustomerShippingAddress from "../entity/CustomerShippingAddress";
import Customer from "../entity/Customer";
import OrderDetail from "../entity/OrderDetail";
import Order from "../entity/Order";

const styles = theme => {
    return {
        root: {
            width: '100%',
            marginTop: theme.spacing(3),
            overflowX: 'auto',
        },

        titleText: {
            marginBottom: theme.spacing(3),
            width: '100%',
        },

        productNameContainer: {
            display: 'flex'
        },

        productName: {
            flexGrow: 1,
            lineHeight: '40px',
        },

        total: {
            fontWeight: 'bold',
            color: theme.palette.text.primary,
            fontSize: theme.typography.fontSize * 1.2 + 'px',
        },

        productPic: {
            width: '40px',
            height: '40px',
            marginRight: theme.spacing(2),
            'border-radius': '3px',
        },

        paper: {
            padding: theme.spacing(3, 2),
            display: 'flex',
        },

        addressContainer: {
            padding: theme.spacing(3, 2),
            marginBottom: theme.spacing(3),
        },

        totalActionBar: {
            fontWeight: 'bold',
            color: theme.palette.text.primary,
            fontSize: theme.typography.fontSize * 1.2 + 'px',
            flexGrow: 1,
        },

        checkoutButton: {
            float: 'right',
        },

        rightIcon: {
            marginLeft: theme.spacing(1),
        },

        rootOrderDetails: {
            width: '100%',
            marginTop: theme.spacing(3),
            padding: theme.spacing(2),
            overflowX: 'auto',
        },

        textField: {
            width: '100%',
        },

        totalcolumn: {
            display: 'flex'
        }
    };
};

class CheckoutComponent extends Component {
    constructor(props) {
        super(props);

        this.classes = props.classes;

        this.state = {
            total: this.props.basketStorage.total,
            count: this.props.basketStorage.count,
            basketProducts: this.props.basketStorage.products,

            form: {
                isValid: {
                    billing: false,
                    details: false,
                    shipping: false,
                },

                data: {
                    billing: {},
                    details: {},
                    shipping: {},
                },

                validate: {
                    billing: false,
                    details: false,
                    shipping: false,
                }
            }
        };

        this.basketStorageActions = props.basketStorageActions;
        this.shopStorageActions = props.shopStorageActions;
        this.checkoutStorageActions = props.checkoutStorageActions;

        this.paymentReturn = props.match.params.paymentReturn || null;
        this.orderNumber = props.match.params.orderNumber || null;

        this.isPayment = false;

        this.checkoutFormDefaultData = props.checkoutData;

        this.renderSuccess = this.renderSuccess.bind(this);
        this.renderFail = this.renderFail.bind(this);
        this.renderProducts = this.renderProducts.bind(this);
        this.renderFailPayment = this.renderFailPayment.bind(this);
        this.handleCheckoutDetailsChange = this.handleCheckoutDetailsChange.bind(this);
        this.onPayNowClick = this.onPayNowClick.bind(this);
        this.onSetFormDetails = this.onSetFormDetails.bind(this);
        this.prepareOrderDataAndGoToPayment = this.prepareOrderDataAndGoToPayment.bind(this);
    }

    componentDidMount() {
        this.shopStorageActions.changeCurrentPage('Checkout');
    }

    componentDidUpdate() {
        if (this.isPayment) {
            return;
        }

        if (this.state.count !== this.props.basketStorage.count) {
            this.setState({
                ...this.state,
                total: this.props.basketStorage.total,
                count: this.props.basketStorage.count,
                basketProducts: this.props.basketStorage.products,
            });
        }
    }

    renderProducts() {
        return (
            <TableBody>
                {this.state.basketProducts.map(productInfo => {
                    return (
                        <TableRow key={"checkout-product-row-" + productInfo.product.id}>
                            <TableCell component="th" scope="row">
                                <Box className={this.classes.productNameContainer}>
                                    <Link to={"/product/" + productInfo.product.id}>
                                        <Avatar alt={productInfo.product.name} src={productInfo.product.picture} className={this.classes.productPic} />
                                    </Link>
                                    <Link to={"/product/" + productInfo.product.id}>
                                        <Typography className={this.classes.productName} color="primary">
                                            {productInfo.product.name}
                                        </Typography>
                                    </Link>
                                </Box>
                            </TableCell>

                            <TableCell align="left">
                                {productInfo.quantity}
                            </TableCell>

                            <TableCell align="right">
                                {formatMoney(productInfo.product.price * productInfo.quantity)}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        );
    }

    renderSuccess() {
        return (
            <React.Fragment>
                <AlertMessageComponent variant="success">
                    <Typography>
                        Your order has been successfully accepted by us and now is processed. Thank you for shopping!!!
                    </Typography>
                </AlertMessageComponent>

                <Paper className={this.classes.rootOrderDetails}>
                    <Typography>
                        Your order number: <strong>{this.orderNumber}</strong>
                    </Typography>
                </Paper>
            </React.Fragment>
        );
    }

    renderFail() {
        return (
            <React.Fragment>
                <DelayedRedirect from={"/checkout/" + this.paymentReturn ? this.paymentReturn : ''} to="/checkout" delay={5000} />

                <AlertMessageComponent variant="error">
                    <Typography>
                        Something went wrong, try again.
                    </Typography>
                </AlertMessageComponent>
            </React.Fragment>
        );
    }

    renderFailPayment() {
        return (
            <React.Fragment>
                <DelayedRedirect from={"/checkout/" + this.paymentReturn ? this.paymentReturn : ''} to="/checkout" delay={5000} />

                <AlertMessageComponent variant="error">
                    <Typography>
                        We were unable to process your order payment. Try again.
                    </Typography>
                </AlertMessageComponent>
            </React.Fragment>
        );
    }

    handleCheckoutDetailsChange(name) {
        return event => {
            this.setState({
                ...this.state,
                [name]: event.target.value
            });
        }
    };

    onPayNowClick() {
        this.setState({
            ...this.state,
            form: {
                ...this.state.form,
                validate: {
                    ...this.state.form.validate,
                    billing: true,
                    shipping: true,
                    details: true,
                }
            },
        });
    }

    onSetFormDetails(formName) {
        return (isValid, formData) => {
            if (isValid) {
                this.setState({
                    ...this.state,
                    form: {
                        ...this.state.form,

                        isValid: {
                            ...this.state.form.isValid,
                            [formName]: true,
                        },

                        data: {
                            ...this.state.form.data,
                            [formName]: formData,
                        },

                        validate: {
                            ...this.state.form.validate,
                            [formName]: false,
                        }
                    },
                });
            } else {
                this.setState({
                    ...this.state,
                    form: {
                        ...this.state.form,
                        validate: {
                            ...this.state.form.validate,
                            [formName]: false,
                        }
                    },
                });
            }
        }
    }

    prepareOrderDataAndGoToPayment() {
        this.isPayment = true;

        let forms = Object.assign({}, this.state.form);

        let orderDetails = [];

        for (let productInfoData of this.props.basketStorage.products) {
            orderDetails.push(new OrderDetail({
                product: productInfoData.product,
                price: productInfoData.product.price,
                quantity: productInfoData.quantity,
            }));
        }

        let order = new Order({
            customer: new Customer({
                billing_address: new CustomerBillingAddress(forms.data.billing),
                shipping_address: new CustomerShippingAddress(forms.data.shipping),
                email: forms.data.details.email,
            }),
            comment: forms.data.details.comment,
            details: orderDetails
        });

        this.checkoutStorageActions.setOrderToCheckout(order);

        return (
            <Redirect from="/checkout" to="/payment" />
        );
    };

    render() {
        if (this.paymentReturn) {
            if (this.paymentReturn === 'error') {
                return this.renderFail();
            }

            if (this.paymentReturn === 'cancel') {
                return this.renderFailPayment();
            }

            if (this.paymentReturn === 'success' && this.orderNumber) {
                this.basketStorageActions.reset();

                return this.renderSuccess();
            } else {
                return this.renderFail();
            }
        }

        if (this.isPayment) {
            return;
        }

        return (
            <React.Fragment>
                {(this.state.form.isValid.billing && this.state.form.isValid.shipping && this.state.form.isValid.details) ? (
                    this.prepareOrderDataAndGoToPayment()
                ) : (
                    null
                )}

                <Typography variant="h5" component="h2" className={this.classes.titleText}>
                    Checkout
                </Typography>

                {this.state.basketProducts.length ? (
                    <React.Fragment>
                        <Paper className={this.classes.root}>
                            <Table className={this.classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product</TableCell>
                                        <TableCell align="left">Quantity</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>

                                {this.renderProducts()}

                                <TableFooter>
                                    <TableRow>
                                        <TableCell align="right" colSpan={3} className={this.classes.total}>Total: {formatMoney(this.state.total)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </Paper>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Paper className={classNames(this.classes.root, this.classes.addressContainer)}>
                                    <Typography variant="h5" component="h2" className={this.classes.titleText}>
                                        Billing Address
                                    </Typography>

                                    <AdressDetailsFormComponent
                                        validateNow={this.state.form.validate.billing}
                                        setFormValues={this.onSetFormDetails('billing')}
                                        defaults={{}}
                                    />
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Paper className={classNames(this.classes.root, this.classes.addressContainer)}>
                                    <Typography variant="h5" component="h2" className={this.classes.titleText}>
                                        Shipping Address
                                    </Typography>

                                    <AdressDetailsFormComponent
                                        validateNow={this.state.form.validate.shipping}
                                        setFormValues={this.onSetFormDetails('shipping')}
                                        defaults={{}}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>

                        <Divider />

                        <Paper className={classNames(this.classes.root, this.classes.addressContainer)}>
                            <CheckoutDetailsFormComponent
                                setFormValues={this.onSetFormDetails('details')}
                                validateNow={this.state.form.validate.details}
                            />
                        </Paper>

                        <Paper className={classNames(this.classes.root, this.classes.paper)}>
                            <Typography className={this.classes.totalActionBar}>
                                Total to pay: {formatMoney(this.state.total)}
                            </Typography>

                            <Button variant="contained" color="secondary" className={this.classes.checkoutButton} onClick={this.onPayNowClick} >
                                Pay now
                                <PaymentIcon className={this.classes.rightIcon} />
                            </Button>
                        </Paper>

                    </React.Fragment>
                ) : (
                    <AlertMessageComponent variant="warning">
                        <Typography>
                            Basket is empty
                        </Typography>
                    </AlertMessageComponent>
                )}
            </React.Fragment>
        );
    }
}

CheckoutComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    basketStorage: PropTypes.object.isRequired,
    basketStorageActions: PropTypes.object.isRequired,
    shopStorageActions: PropTypes.object.isRequired,
    checkoutStorageActions: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    let products = [];

    for (let id in state.basket.products) {
        if (state.basket.products.hasOwnProperty(id)) {
            products.push(state.basket.products[id]);
        }
    }

    return {
        basketStorage: {
            count: state.basket.count,
            total: state.basket.total,
            products: products,
        },
    };
};

const mapDispatchToProps = dispatch => ({
    basketStorageActions: {
        reset: () => dispatch(basketActions.reset())
    },

    shopStorageActions: {
        changeCurrentPage: (name) => dispatch(shopActions.changeCurrentPage(name))
    },

    checkoutStorageActions: {
        setOrderToCheckout: (order) => dispatch(checkoutActions.setOrderToCheckout(order))
    }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CheckoutComponent)))

