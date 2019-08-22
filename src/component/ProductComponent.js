import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {Typography} from "@material-ui/core";
import CardMedia from "@material-ui/core/CardMedia";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { basketActions } from "../service/basket/duck";
import { shopActions } from "../service/shop/duck";
import {connect} from "react-redux";
import { Link, withRouter } from 'react-router-dom';
import { formatMoney } from '../service/localeFormat';
import AddToBasketSuccessMessageComponent from "./AddToBasketSuccessMessageComponent";
import ProductQuantityComponent from "./ProductQuantityComponent";
import Button from "@material-ui/core/Button";
import AlertMessageComponent from "./AlertMessageComponent";
import ProductService from '../service/product.service';
import Chip from "@material-ui/core/Chip";
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import MarkdownComponent from "./MarkdownComponent";

const styles = theme => ({
    cardMedia: {
        paddingTop: '100%'
    },

    productHeader: {
        marginBottom: theme.spacing(3),
        display: 'flex',
    },

    productHeaderTitle: {
        flexGrow: 1
    },

    categoryName: {
        '&:hover': {
            cursor: 'pointer',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.getContrastText(theme.palette.primary.main),

            '& svg': {
                color: theme.palette.getContrastText(theme.palette.primary.main),
            }
        },
    },

    productName: {
        marginBottom: theme.spacing(1)
    },

    productTitle: {
        fontSize: theme.spacing(2),
        color: theme.palette.text.secondary
    },

    productPrice: {
        fontSize: theme.spacing(4),
        marginBottom: theme.spacing(2),
        fontWeight: 'bold',
    },

    productDescription: {
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2),
    },

    paper: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(3),
    },

    longDescriptionContainer: {
        marginTop: theme.spacing(3),
    }
});

class ProductComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            product: false,
            addToBasketMessage: false,
            resetQuantityChooser: false,
        };

        this.classes = props.classes;

        this.productId = props.match.params.id;
        this.product = null;
        this.api = props.api;
        this.addToCartQuantity = 1;
        this.shopStorageActions = props.shopStorageActions;

        this.renderProduct = this.renderProduct.bind(this);
        this.renderLoading = this.renderLoading.bind(this);
        this.handleChangeQuantity = this.handleChangeQuantity.bind(this);
        this.addToBasket = this.addToBasket.bind(this);
        this.handleOnRestartQuantityChooser = this.handleOnRestartQuantityChooser.bind(this);
    }

    componentDidMount() {
        (async () => {
            let product = await this.api.getProduct(this.productId);

            this.shopStorageActions.changeCurrentPage(product.name);

            this.setState({
                ...this.state,
                product: product,
            });
        })();
    }

    handleChangeQuantity(quantity) {
        this.addToCartQuantity = quantity;
    }

    handleOnRestartQuantityChooser() {
        this.setState({
            ...this.state,
            resetQuantityChooser: false,
        });
    }

    addToBasket() {
        if (this.addToCartQuantity > 0) {
            this.props.basketStorageActions.add(this.state.product, this.addToCartQuantity);
            this.setState({
                ...this.state,
                addToBasketMessage: true,
                resetQuantityChooser: true, // set quantity chooser to default quantity -> 1
            });
        }
    }

    renderProduct() {
        let product = this.state.product;

        let renderIfExist = (value, component) => {
            if (value) {
                return component;
            } else {
                return null;
            }
        };

        return (
            <React.Fragment>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={5} lg={5}>
                        <CardMedia
                            image={product.picture}
                            className={this.classes.cardMedia}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={5} lg={5}>
                        <Box className={this.classes.productHeader}>
                            <Box className={this.classes.productHeaderTitle}>
                                <Typography component="h1" variant="h2" className={this.classes.productName}>
                                    {product.name}
                                </Typography>

                                {renderIfExist(product.title, (
                                    <Typography component="h2" variant="h3" className={this.classes.productTitle}>
                                        {product.title}
                                    </Typography>
                                ))}
                            </Box>

                            <Link to={"/category/" + product.category.id}>
                                <Chip
                                    icon={<FolderOpenIcon />}
                                    label={product.category.name}
                                    className={this.classes.categoryName}
                                />
                            </Link>
                        </Box>

                        <Typography color="primary" className={this.classes.productPrice}>
                            {formatMoney(product.price)}
                        </Typography>

                        {renderIfExist(product.description, (
                            <Paper className={this.classes.paper}>
                                <Typography className={this.classes.productDescription}>
                                    {product.description}
                                </Typography>
                            </Paper>
                        ))}

                        <Paper className={this.classes.paper}>
                            {ProductService.getProductAvaliableQuantity(product) > 0 ? (
                                <React.Fragment>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={12} lg={6}>
                                            <ProductQuantityComponent
                                                product={product}
                                                onChange={this.handleChangeQuantity}
                                                restart={this.state.resetQuantityChooser}
                                                onRestart={this.handleOnRestartQuantityChooser}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <Button variant="contained" color="primary" className={this.classes.addToCartButton} onClick={this.addToBasket} >
                                                <AddShoppingCartIcon fontSize="inherit" className={this.classes.addToCartButtonIcon} />
                                                Add to cart
                                            </Button>
                                        </Grid>
                                    </Grid>

                                    <AddToBasketSuccessMessageComponent productName={product.name} isOpen={this.state.addToBasketMessage}  />
                                </React.Fragment>
                            ) : (
                                <AlertMessageComponent variant="warning">
                                    <Typography>
                                        Currently, we don't have this product in stock
                                    </Typography>
                                </AlertMessageComponent>
                            )}
                        </Paper>

                    </Grid>
                </Grid>

                {renderIfExist(product.longDescription, (
                    <Box className={this.classes.longDescriptionContainer}>
                        <Paper className={this.classes.paper}>
                            <MarkdownComponent>
                                {product.longDescription}
                            </MarkdownComponent>
                        </Paper>
                    </Box>
                ))}

            </React.Fragment>
        );
    }

    renderLoading() {
        return null;
    }

    render() {
        return (
            <React.Fragment>
                {this.state.product ? this.renderProduct() : this.renderLoading()}
            </React.Fragment>
        );
    }
}

ProductComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
    basketStorageActions: {
        add: (product, quantity = 1) => dispatch(basketActions.add(product, quantity))
    },

    shopStorageActions: {
        changeCurrentPage: (name) => dispatch(shopActions.changeCurrentPage(name))
    }
});

export default withRouter(connect(null, mapDispatchToProps)(withStyles(styles)(ProductComponent)))

