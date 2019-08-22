import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Button from "@material-ui/core/Button";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ProductService from '../service/product.service';

const styles = theme => ({
    quantityField: {
        color: theme.palette.primary
    }
});

class ProductQuantityComponent extends Component {
    constructor(props) {
        super(props);

        this.classes = props.classes;

        this.min = this.props.min || 1;
        this.max = ProductService.getProductAvaliableQuantity(this.props.product);
        this.onChange = this.props.onChange;
        this.onRestart = this.props.onRestart;

        this.props = props;

        this.state = {
            quantity: this.props.quantity || this.min,
        };

        this.prevQuantity = this.props.quantity || this.min;

        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handlePlusClick = this.handlePlusClick.bind(this);
        this.handleMinusClick = this.handleMinusClick.bind(this);
    }

    componentDidUpdate() {
        if (this.props.restart === true) {
            this.max = ProductService.getProductAvaliableQuantity(this.props.product);

            this.handleQuantityChange(this.min);

            this.onRestart();
        }
    }

    handlePlusClick() {
        let newQuantity = this.prevQuantity + 1;

        if (newQuantity > this.max) {
            newQuantity = this.max;
        }

        this.handleQuantityChange(newQuantity)
    }

    handleMinusClick() {
        let newQuantity = this.prevQuantity - 1;

        if (newQuantity < this.min) {
            newQuantity = this.min;
        }

        this.handleQuantityChange(newQuantity);
    }

    handleQuantityChange(newQuantity) {
        if (this.prevQuantity !== newQuantity) {
            let prevQuantity = this.prevQuantity;
            this.prevQuantity = newQuantity;

            this.setState({
                ...this.state,
                quantity: newQuantity,
            });

            this.onChange(newQuantity, prevQuantity);
        }
    }

    render() {
        return (
            <ButtonGroup size="medium">
                <Button variant="contained" color="primary" onClick={this.handlePlusClick}>
                    <AddIcon />
                </Button>

                <Button disabled={true} color="primary" className={this.classes.quantityField}>
                    {this.state.quantity}
                </Button>

                <Button variant="contained" color="primary" onClick={this.handleMinusClick}>
                    <RemoveIcon />
                </Button>
            </ButtonGroup>
        );
    }
}

ProductQuantityComponent.propTypes = {
    product: PropTypes.object,
    min: PropTypes.number,
    quantity: PropTypes.number,
    onChange: PropTypes.func,
    restart: PropTypes.bool,
    onRestart: PropTypes.func
};

export default withStyles(styles)(ProductQuantityComponent);

