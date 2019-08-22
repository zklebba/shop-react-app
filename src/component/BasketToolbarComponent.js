import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import PaymentIcon from '@material-ui/icons/Payment';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import Popover from "@material-ui/core/Popover";
import Divider from '@material-ui/core/Divider';
import { formatMoney } from '../service/localeFormat';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'
import { Link } from "react-router-dom";
import { basketActions } from "../service/basket/duck";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'
import { Typography } from "@material-ui/core";

const styles = theme => {
    return {
        card: {
            flexGrow: 1,
        },

        productsList: {
            padding: 0
        },

        productListItem: {
            padding: 0
        },

        productListItemText: {
            paddingRight: '55px'
        },

        productPic: {
            'border-radius': '3px',
        },

        removeFromBasketButton: {
            paddingRight: 0,
            color: theme.palette.error.light,
            '&:hover': {
                color: theme.palette.error.dark,
                backgroundColor: 'transparent',
            }
        },

        cardActions: {

        },

        rightIcon: {
            marginLeft: theme.spacing(1),
        },

        button: {
            margin: theme.spacing(1),
        },
    }
};

class BasketToolbarComponent extends Component {
    constructor(props) {
        super(props);

        this.classes = props.classes;

        this.renderProductsList = this.renderProductsList.bind(this);
        this.removeFromBasket = this.removeFromBasket.bind(this);

        this.props = props;

        this.state = {
            total: this.props.basketStorage.total,
            count: this.props.basketStorage.count,
            products: this.props.basketStorage.products,
        };
    }

    componentDidUpdate() {
        if (this.state.count !== this.props.basketStorage.count) {
            this.setState({
                ...this.state,
                total: this.props.basketStorage.total,
                count: this.props.basketStorage.count,
                products: this.props.basketStorage.products,
            });
        }
    }

    removeFromBasket(productId) {
        return () => {
            this.props.basketStorageActions.remove(productId);
        }
    }

    renderProductsList() {
        if (this.state.products.length) {
            return (
                <List className={this.classes.productsList}>
                    {this.state.products.map(data => {
                        return (
                            <ListItem className={this.classes.productListItem} key={"basket-toolbar-item-" + data.product.id}>
                                <ListItemAvatar>
                                    <Link to={"/product/" + data.product.id}>
                                        <Avatar alt={data.product.name} src={data.product.picture} className={this.classes.productPic} />
                                    </Link>
                                </ListItemAvatar>

                                <Link to={"/product/" + data.product.id}>
                                    <ListItemText
                                        primary={data.quantity > 1 ? data.product.name + " × " + data.quantity : data.product.name}
                                        secondary={data.product.title}
                                        className={this.classes.productListItemText}
                                    />
                                </Link>
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        aria-label="Delete"
                                        className={this.classes.removeFromBasketButton}
                                        onClick={this.removeFromBasket(data.product.id)}
                                    >
                                        <HighlightOffIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
            );
        } else {
            return (
                <Typography>
                    Cart is empty
                </Typography>
            );
        }
    }

    render() {
        return (<PopupState variant="popover" popupId="basket-toolbar">
            {popupState => (
                <div>
                    <IconButton color="inherit" {...bindTrigger(popupState)}>
                        <Badge badgeContent={this.state.count} color="secondary">
                            <ShoppingBasketIcon />
                        </Badge>
                    </IconButton>

                    <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >

                        <Card id="basket-toolbar" className={this.classes.card}>
                            <CardHeader
                                avatar={
                                    <Avatar>
                                        <ShoppingBasketIcon />
                                    </Avatar>
                                }
                                title="Cart"
                                subheader={this.state.total ? "Total: " + formatMoney(this.state.total) : ''}
                            />

                            <Divider />

                            {this.state.products.length ? (
                                <React.Fragment>
                                    <CardContent>
                                        {this.renderProductsList()}
                                    </CardContent>

                                    <Divider />

                                    <CardActions disableSpacing className={this.classes.cardActions}>
                                        <Link to={"/basket"}>
                                            <Button variant="contained" color="default" className={this.classes.button} >
                                                View cart
                                                <ShoppingBasketIcon className={this.classes.rightIcon} />
                                            </Button>
                                        </Link>

                                        <Link to={"/checkout"}>
                                            <Button variant="contained" color="primary" className={this.classes.button} >
                                                Checkout
                                                <PaymentIcon className={this.classes.rightIcon} />
                                            </Button>
                                        </Link>
                                    </CardActions>
                                </React.Fragment>
                            ) : (
                                <CardContent>
                                    <Typography>
                                        Cart is empty. Feel free to add some products.
                                    </Typography>
                                </CardContent>
                            )}
                        </Card>
                    </Popover>
                </div>
            )}
        </PopupState>);
    }
}

BasketToolbarComponent.propTypes = {
    classes: PropTypes.object.isRequired,
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
        remove: (id) => dispatch(basketActions.remove(id))
    }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BasketToolbarComponent)))
