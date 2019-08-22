import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Snackbar from "@material-ui/core/Snackbar";
import AlertMessageComponent from "./AlertMessageComponent";

class AddToBasketSuccessMessageComponent extends Component {
    constructor(props) {
        super(props);

        this.classes = props.classes;
        this.productName = props.productName;

        this.props = props;

        this.state = {
            isOpen: props.isOpen,
        };

        this.handleOnClose = this.handleOnClose.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.state.isOpen !== this.props.isOpen) {
            this.setState({
                ...this.state,
                isOpen: this.props.isOpen,
            });
        }
    }

    handleOnClose() {
        this.setState({
            ...this.state,
            isOpen: false,
        });
    }

    render() {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={this.state.isOpen}
                onClose={this.handleOnClose}
                autoHideDuration={3000}
            >
                <AlertMessageComponent variant="success">
                    <strong>{this.productName}&nbsp;</strong> has been added to the basket
                </AlertMessageComponent>
            </Snackbar>
        );
    }
}

AddToBasketSuccessMessageComponent.propTypes = {
    productName: PropTypes.string,
    isOpen: PropTypes.bool,
};

export default AddToBasketSuccessMessageComponent;

