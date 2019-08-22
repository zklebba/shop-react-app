import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import AlertMessageComponent from "./AlertMessageComponent";
import ProductTeaserComponent from "./ProductTeaserComponent";
import { Typography } from "@material-ui/core";
import { shopActions } from "../service/shop/duck";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'

const styles = theme => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(1100 + theme.spacing(3 * 2))]: {
            width: 1100,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    cardGrid: {
        padding: `${theme.spacing(2)}px 0`,
    },
});

class ListingComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
        };

        this.classes = props.classes;
        this.api = props.api;
        this.props = props;
        this.categoryId = props.match.params.id || null;
        this.shopStorageActions = props.shopStorageActions;

        this.renderProducts = this.renderProducts.bind(this);
        this.renderNoProducts = this.renderNoProducts.bind(this);
        this.renderLoading = this.renderLoading.bind(this);
        this.loadProducts = this.loadProducts.bind(this);
    }

    componentDidUpdate() {
        let id = this.props.match.params.id || null;
        if (id !== this.categoryId) {
            this.categoryId = id;

            this.setState({
                ...this.state,
                products: [],
            });

            this.loadProducts();
        }
    }

    loadProducts() {
        (async () => {
            if (this.categoryId) {
                let category = await this.api.getCategory(this.categoryId);
                this.shopStorageActions.changeCurrentPage(category.name);
            } else {
                this.shopStorageActions.changeCurrentPage('');
            }

            let products = await this.api.getProducts(this.categoryId);

            this.setState({
                ...this.state,
                products: products,
            });
        })();
    }

    componentDidMount() {
        this.loadProducts();
    }

    renderProducts() {
        return (
            <React.Fragment>
                <div className={classNames(this.classes.layout, this.classes.cardGrid)}>
                    <Grid container spacing={4}>
                        {this.state.products.map(product => {
                            return (
                                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                                    <ProductTeaserComponent product={product} />
                                </Grid>
                            );
                        })}
                    </Grid>
                </div>
            </React.Fragment>
        );
    }

    renderNoProducts() {
        return (
            <AlertMessageComponent variant="warning">
                <Typography>
                    Currently, the store have no goods.
                </Typography>
            </AlertMessageComponent>
        );
    }

    renderLoading() {
        return null;
    }

    render() {
        if (this.state.products) {
            if (this.state.products.length) {
                return this.renderProducts();
            } else {
                return this.renderLoading();
            }
        } else {
            return this.renderNoProducts();
        }
    }
}

ListingComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
    shopStorageActions: {
        changeCurrentPage: (name) => dispatch(shopActions.changeCurrentPage(name))
    }
});

export default withRouter(connect(null, mapDispatchToProps)(withStyles(styles)(ListingComponent)));

