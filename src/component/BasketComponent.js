import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import AlertMessageComponent from "./AlertMessageComponent";
import {Typography} from "@material-ui/core";
import {basketActions} from "../service/basket/duck";
import {connect} from "react-redux";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PaymentIcon from '@material-ui/icons/Payment';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Divider from '@material-ui/core/Divider';
import { formatMoney } from '../service/localeFormat';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ProductQuantityComponent from "./ProductQuantityComponent";
import Box from "@material-ui/core/Box";
import TableFooter from '@material-ui/core/TableFooter';
import {shopActions} from "../service/shop/duck";

const styles = theme => {
    return {
        root: {
            width: '100%',
            marginTop: theme.spacing(3),
            overflowX: 'auto',
        },

        pageTitle: {
            marginBottom: theme.spacing(3)
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

        actionsBar: {
            padding: theme.spacing(3, 2)
        },

        checkoutButton: {
            float: 'right',
        },

        rightIcon: {
            marginLeft: theme.spacing(1),
        },
    };
};

class BasketComponent extends Component {
    constructor(props) {
        super(props);

        this.classes = props.classes;

        this.state = {
            total: this.props.basketStorage.total,
            count: this.props.basketStorage.count,
            basketProducts: this.props.basketStorage.products,
        };

        this.basketStorageActions = this.props.basketStorageActions;
        this.shopStorageActions = this.props.shopStorageActions;

        this.renderProducts = this.renderProducts.bind(this);
    }

    componentDidMount() {
        this.shopStorageActions.changeCurrentPage('Basket');
    }

    componentDidUpdate() {
        if (this.state.count !== this.props.basketStorage.count) {
            this.setState({
                ...this.state,
                total: this.props.basketStorage.total,
                count: this.props.basketStorage.count,
                basketProducts: this.props.basketStorage.products,
            });
        }
    }

    handleChangeQuantity(product) {
        return (quantity) => {
            this.basketStorageActions.changeQuantity(product.id, quantity);
        }
    }

    removeFromBasket(productId) {
        return () => {
            this.props.basketStorageActions.remove(productId);
        }
    }

    renderProducts() {
        return (
            <TableBody>
                {this.state.basketProducts.map(productInfo => {
                    return (
                        <TableRow key={productInfo.product.id}>

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
                                <ProductQuantityComponent
                                    product={productInfo.product}
                                    quantity={productInfo.quantity}
                                    onChange={this.handleChangeQuantity(productInfo.product)}
                                    restart={false}
                                />
                            </TableCell>

                            <TableCell align="right">
                                {formatMoney(productInfo.product.price * productInfo.quantity)}
                            </TableCell>

                            <TableCell align="right">
                                <IconButton
                                    edge="end"
                                    aria-label="Delete"
                                    className={this.classes.removeFromBasketButton}
                                    onClick={this.removeFromBasket(productInfo.product.id)}
                                >
                                    <HighlightOffIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        );
    }

    render() {
        return (
            <React.Fragment>
                <Typography variant="h5" component="h2" className={this.classes.pageTitle}>
                    Basket
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
                                        <TableCell align="right">&nbsp;</TableCell>
                                    </TableRow>
                                </TableHead>

                                {this.renderProducts()}

                                <TableFooter>
                                    <TableRow>
                                        <TableCell align="right" colSpan={3} className={this.classes.total}>Total: {formatMoney(this.state.total)}</TableCell>
                                        <TableCell align="left">
                                            &nbsp;
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </Paper>

                        <Divider />

                        <Paper className={classNames(this.classes.root, this.classes.actionsBar)}>
                            <Link to={"/checkout"}>
                                <Button variant="contained" color="primary" className={this.classes.checkoutButton} >
                                    Checkout
                                    <PaymentIcon className={this.classes.rightIcon} />
                                </Button>
                            </Link>
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

BasketComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    basketStorageActions: PropTypes.object.isRequired,
    basketStorage: PropTypes.object.isRequired,
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
        }
    };
};

const mapDispatchToProps = dispatch => ({
    basketStorageActions: {
        changeQuantity: (id, quantity) => dispatch(basketActions.changeQuantity(id, quantity)),
        remove: (id) => dispatch(basketActions.remove(id))
    },

    shopStorageActions: {
        changeCurrentPage: (name) => dispatch(shopActions.changeCurrentPage(name))
    }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BasketComponent)))

