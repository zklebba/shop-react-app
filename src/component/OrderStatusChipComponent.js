import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CancelIcon from '@material-ui/icons/Cancel';
import Chip from '@material-ui/core/Chip';
import { OrderService, ORDER_STATUS_ID } from '../service/order.service';

const styles = theme => ({
    chipComplete: {
        backgroundColor: '#43a047',
        color: '#fff'
    },

    chipProcessing: {
        backgroundColor: '#4721a0',
        color: '#fff'
    },

    chipCanceled: {
        backgroundColor: '#a00f20',
        color: '#fff'
    },

    iconWhite: {
        color: '#fff'
    }
});

class OrderStatusChipComponent extends Component {
    constructor(props) {
        super(props);

        this.classes = props.classes;

        this.status = props.status;
    }

    render() {
        const icons = {
            [ORDER_STATUS_ID.ORDER_STATUS_COMPLETE]: (
                <DoneIcon className={this.classes.iconWhite} />
            ),

            [ORDER_STATUS_ID.ORDER_STATUS_PROCESSING]: (
                <HourglassEmptyIcon className={this.classes.iconWhite} />
            ),

            [ORDER_STATUS_ID.ORDER_STATUS_CANCELED]: (
                <CancelIcon className={this.classes.iconWhite} />
            ),
        };

        const classes = {
            [ORDER_STATUS_ID.ORDER_STATUS_COMPLETE]: this.classes.chipComplete,
            [ORDER_STATUS_ID.ORDER_STATUS_PROCESSING]: this.classes.chipProcessing,
            [ORDER_STATUS_ID.ORDER_STATUS_CANCELED]: this.classes.chipCanceled,
        };

        return (
            <Chip
                icon={icons[this.status]}
                label={OrderService.getStatusText(this.status)}
                className={classes[this.status]}
            />
        );
    }
}

OrderStatusChipComponent.propTypes = {
    status: PropTypes.number
};

export default withStyles(styles)(OrderStatusChipComponent);

