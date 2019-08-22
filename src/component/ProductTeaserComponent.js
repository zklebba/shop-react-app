import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import CardMedia from "@material-ui/core/CardMedia/CardMedia";
import Typography from "@material-ui/core/Typography/Typography";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Fab from '@material-ui/core/Fab';
import Box from '@material-ui/core/Box';
import { formatMoney } from '../service/localeFormat';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { basketActions } from '../service/basket/duck'
import { Link } from "react-router-dom";
import AlertMessageComponent from "./AlertMessageComponent";
import ProductService from "../service/product.service";
import WarningIcon from '@material-ui/icons/Warning';
import Chip from "@material-ui/core/Chip";
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

const styles = theme => {
    return {
        card: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        },
        cardMedia: {
            paddingTop: '56.25%', // 16:9
        },
        cardContent: {
            flexGrow: 1,
        },

        productName: {
            fontSize: theme.spacing(3),
        },

        productHeader: {
            marginBottom: theme.spacing(2),
        },

        productTitle: {
            fontSize: theme.spacing(2),
            color: theme.palette.text.secondary
        },

        productPrice: {
            fontSize: theme.spacing(3),
            marginBottom: theme.spacing(2),
        },

        footer: {
            width: '100%'
        },

        category: {
            flexGrow: 1,
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
    };
};

class ProductTeaserComponent extends Component {
    constructor(props) {
        super(props);

        this.product = this.props.product;
        this.classes = this.props.classes;

        this.addToBasket = this.addToBasket.bind(this);
        this.renderSuccessMessage = this.renderSuccessMessage.bind(this);

        this.state = {
            addToBasketMessage: false,
        }
    }

    addToBasket(product) {
        return () => {
            this.props.basketStorageActions.add(product);
            this.setState({
                ...this.state,
                addToBasketMessage: true,
            });
        }
    }

    renderImage() {
        return (
            <Link to={"/product/" + this.product.id}>
                <CardMedia
                    className={this.classes.cardMedia}
                    image={this.product.picture}
                />
            </Link>
        );
    }

    renderSuccessMessage() {
        let hideMessage = () => {
            this.setState({
                ...this.state,
                addToBasketMessage: false,
            });
        };

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={this.state.addToBasketMessage}
                onClose={hideMessage}
                autoHideDuration={3000}
            >
                <AlertMessageComponent variant="success">
                    <strong>{this.product.name}&nbsp;</strong> has been added to the basket
                </AlertMessageComponent>
            </Snackbar>
        );
    }

    renderHeader() {
        let name = (
            <Typography variant="h5" component="h2">
                {this.product.name}
            </Typography>
        );

        let title = '';

        if (this.product.title) {
            title = (
                <Typography variant="h5" component="h3" className={this.classes.productTitle}>
                    {this.product.title}
                </Typography>
            );
        }

        return (
            <div className={this.classes.productHeader}>
                <Link to={"/product/" + this.product.id}>
                    {name}

                    {title}
                </Link>
            </div>
        );
    };

    render() {
        return (
            <Card className={this.classes.card}>
                {this.renderImage()}

                <CardContent className={this.classes.cardContent}>
                    {this.renderHeader()}

                    <Typography align="center" component="h3" color="primary" className={this.classes.productPrice} >
                        {formatMoney(this.product.price)}
                    </Typography>

                    <Typography>
                        {this.product.description}
                    </Typography>

                </CardContent>

                <CardActions>
                    {ProductService.getProductAvaliableQuantity(this.product) > 0 ? (

                        <Box display="flex" justifyContent="flex-end" className={this.classes.footer}>
                            <Box className={this.classes.category}>
                                <Link to={"/category/" + this.product.category.id}>
                                    <Chip
                                        icon={<FolderOpenIcon />}
                                        label={this.product.category.name}
                                        className={this.classes.categoryName}
                                    />
                                </Link>
                            </Box>

                            <Fab size="small" color="primary" onClick={this.addToBasket(this.product)}>
                                <AddShoppingCartIcon />
                            </Fab>
                        </Box>

                    ) : (
                        <Typography>
                            <WarningIcon /> Product not avaliable
                        </Typography>
                    )}
                </CardActions>


                {this.renderSuccessMessage()}
            </Card>
        );
    }
}

ProductTeaserComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    product: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
    basketStorageActions: {
        add: (product) => dispatch(basketActions.add(product))
    }
});

export default withRouter(connect(null, mapDispatchToProps)(withStyles(styles)(ProductTeaserComponent)))
