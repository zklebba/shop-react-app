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
    paper: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(3),
    },

    title: {
        marginBottom: theme.spacing(3),
        fontSize: theme.spacing(4),
    }
});

class PageComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: false,
        };

        this.classes = props.classes;

        this.pageId = props.match.params.id;
        this.api = props.api;
        this.shopStorageActions = props.shopStorageActions;
        this.page = null;

        this.renderLoading = this.renderLoading.bind(this);
        this.renderPage = this.renderPage.bind(this);
    }

    componentDidMount() {
        (async () => {
            let page = await this.api.getPage(this.pageId);
            this.shopStorageActions.changeCurrentPage(page.name);

            this.page = page;

            this.setState({
                ...this.state,
                page: page,
            });
        })();
    }

    renderLoading() {
        return null;
    }

    renderPage() {
        return (
            <React.Fragment>
                <Typography component="h1" variant="h2" className={this.classes.title}>
                    {this.page.name}
                </Typography>

                <Paper className={this.classes.paper}>
                    <MarkdownComponent>
                        {this.page.content}
                    </MarkdownComponent>
                </Paper>

            </React.Fragment>
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.state.page ? this.renderPage() : this.renderLoading()}
            </React.Fragment>
        );
    }
}

PageComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
    shopStorageActions: {
        changeCurrentPage: (name) => dispatch(shopActions.changeCurrentPage(name))
    }
});

export default withRouter(connect(null, mapDispatchToProps)(withStyles(styles)(PageComponent)))

