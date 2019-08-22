import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AlertMessageComponent from "./AlertMessageComponent";
import { Typography } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import { Link } from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from "@material-ui/core/Box";
import TableFooter from '@material-ui/core/TableFooter';
import { formatDate, formatMoney } from '../service/localeFormat';
import { OrderService } from '../service/order.service';
import Collapse from '@material-ui/core/Collapse';
import Switch from '@material-ui/core/Switch';
import OrderStatusChipComponent from "./OrderStatusChipComponent";
import { shopActions } from "../service/shop/duck";
import {connect} from "react-redux";
import { withRouter } from 'react-router-dom'
import AskForOrdersAccessFormComponent from "./AskForOrdersAccessFormComponent";

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
            padding: theme.spacing(3, 2),
            display: 'flex',
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

        renderOrderDetailsFooter: {
            '& td': {
                border: 0,
            }
        },

        detailsTable: {
            width: '100%',
        },

        detailsRowVisible: {
            display: 'table-row',
        },

        detailsRowHidden: {
            display: 'none',
        },

        askForOrdersInfo: {
            marginBottom: theme.spacing(2),
        },
    };
};

class OrdersComponent extends Component {
    constructor(props) {
        super(props);

        this.classes = props.classes;
        this.api = props.api;

        this.props = props;

        this.state = {
            orders: [],
            detailsOpen: {},
            tableDetailsRowClass: {},
            askForOrdersIsSent: false,
            accessCodeInvalid: false,
        };

        this.shopStorageActions = props.shopStorageActions;

        this.renderOrders = this.renderOrders.bind(this);
        this.renderLoading = this.renderLoading.bind(this);
        this.renderOrdersTable = this.renderOrdersTable.bind(this);
        this.renderNoOrders = this.renderNoOrders.bind(this);
        this.renderOrderDetailsTable = this.renderOrderDetailsTable.bind(this);
        this.handleDetailsSwitchChange = this.handleDetailsSwitchChange.bind(this);
        this.handleOnCollapse = this.handleOnCollapse.bind(this);
        this.renderAskForOrdersAccessForm = this.renderAskForOrdersAccessForm.bind(this);
        this.handleOnAskForAccess = this.handleOnAskForAccess.bind(this);
    }

    componentDidMount() {
        this.shopStorageActions.changeCurrentPage('Orders');

        let paramAccessCode = this.props.match.params.accessCode;

        if (paramAccessCode && paramAccessCode !== this.props.accessCode) {
            this.shopStorageActions.setOrdersAccessCode(this.props.match.params.accessCode);
        }

        let accessCode = this.props.accessCode || paramAccessCode;

        if (accessCode) {
            (async () => {
                let orders = await this.api.getOrders(accessCode);

                if (orders === 401) {
                    this.shopStorageActions.setOrdersAccessCode('');

                    this.setState({
                        ...this.state,
                        accessCodeInvalid: true,
                    });
                } else {
                    this.setState({
                        ...this.state,
                        orders: orders,
                    });
                }
            })();
        }
    }

    renderOrderDetailsTable(order) {
        let details = order.details;

        return (
            <Table className={this.classes.detailsTable}>
                <TableHead>
                    <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Total</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {details.map(detail => {
                        return (
                            <TableRow key={"order-detail-" + detail.id}>
                                <TableCell component="th" scope="row">
                                    <Box className={this.classes.productNameContainer}>
                                        <Link to={"/product/" + detail.product.id}>
                                            <Avatar alt={detail.product.id.name} src={detail.product.picture} className={this.classes.productPic} />
                                        </Link>
                                        <Link to={"/product/" + detail.product.id}>
                                            <Typography className={this.classes.productName} color="primary">
                                                {detail.product.name}
                                            </Typography>
                                        </Link>
                                    </Box>
                                </TableCell>

                                <TableCell align="center">
                                    {detail.quantity}
                                </TableCell>

                                <TableCell align="right">
                                    {formatMoney(detail.price * detail.quantity)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>

                <TableFooter className={this.classes.renderOrderDetailsFooter}>
                    <TableRow>
                        <TableCell align="right" colSpan={3} className={this.classes.total}>Total: {formatMoney(OrderService.getOrderTotal(order))}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        );
    }

    handleDetailsSwitchChange(order) {
        return () => {
            this.setState({
                ...this.state,
                detailsOpen: {
                    ...this.state.detailsOpen,
                    [order.number]: !!!this.state.detailsOpen[order.number]
                }
            });
        };
    }

    handleOnCollapse(order) {
        return () => {
            this.setState({
                ...this.state,
                tableDetailsRowClass: {
                    ...this.state.tableDetailsRowClass,
                    [order.number]: this.state.detailsOpen[order.number] ? this.classes.detailsRowVisible : this.classes.detailsRowHidden
                }
            });
        };
    }

    renderOrders() {
        return (
            <TableBody>
                {this.state.orders.map(order => {
                    return (
                        <React.Fragment key={order.number}>
                            <TableRow key={"order-" + order.number}>
                                <TableCell component="th" scope="row">
                                    {order.number}
                                </TableCell>

                                <TableCell align="right">
                                    <OrderStatusChipComponent status={order.status} />
                                </TableCell>

                                <TableCell align="right">
                                    {formatMoney(OrderService.getOrderTotal(order))}
                                </TableCell>

                                <TableCell align="left">
                                    {formatDate(order.date)}
                                </TableCell>

                                <TableCell align="center">
                                    <Switch checked={this.state.detailsOpen[order.number]} onChange={this.handleDetailsSwitchChange(order)} />
                                </TableCell>
                            </TableRow>

                            <TableRow key={order.number + '-details'} className={this.state.tableDetailsRowClass[order.number] ? this.state.tableDetailsRowClass[order.number] : this.classes.detailsRowHidden}>
                                <TableCell colSpan={5}>
                                    <Collapse in={this.state.detailsOpen[order.number]} onEnter={this.handleOnCollapse(order)} onExited={this.handleOnCollapse(order)}>
                                        {this.renderOrderDetailsTable(order)}
                                    </Collapse>
                                </TableCell>
                            </TableRow>

                        </React.Fragment>
                    );
                })}
            </TableBody>
        );
    }

    renderLoading() {
        return null;
    }

    renderOrdersTable() {
        return (
            <React.Fragment>
                <Typography variant="h5" component="h2" className={this.classes.pageTitle}>
                    Orders
                </Typography>

                <Paper className={this.classes.root}>
                    <Table className={this.classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order number</TableCell>
                                <TableCell align="center">Order Status</TableCell>
                                <TableCell align="right">Order Total</TableCell>
                                <TableCell align="left">Order Date</TableCell>
                                <TableCell align="center">Details</TableCell>
                            </TableRow>
                        </TableHead>

                        {this.renderOrders()}
                    </Table>
                </Paper>
            </React.Fragment>
        );
    }

    renderNoOrders() {
        return (
            <AlertMessageComponent variant="info">
                <Typography>
                    You don't have any orders
                </Typography>
            </AlertMessageComponent>
        );
    }

    handleOnAskForAccess(isValid, {email: email}) {
        if (isValid) {
            this.api.askForOrdersAccess(email);

            this.setState({
                ...this.state,
                askForOrdersIsSent: true,
            });
        }
    }

    renderAskForOrdersAccessForm() {
        if (this.state.askForOrdersIsSent) {
            return (
                <AlertMessageComponent variant="success">
                    Check your e-mail inbox and follow the given instructions
                </AlertMessageComponent>
            );
        } else {
            return (
                <React.Fragment>
                    <AlertMessageComponent variant="info" className={this.classes.askForOrdersInfo}>
                        Enter your e-mail address to send the generated link with access to your orders.
                    </AlertMessageComponent>

                    <AskForOrdersAccessFormComponent setFormValues={this.handleOnAskForAccess} />
                </React.Fragment>
            );
        }
    }

    render() {
        let accessCode = this.props.accessCode || this.props.match.params.accessCode;

        if (accessCode) {
            if (this.state.accessCodeInvalid) {
                return this.renderAskForOrdersAccessForm();
            }

            if (this.state.orders) {
                if (this.state.orders.length) {
                    return this.renderOrdersTable();
                } else {
                    return this.renderLoading();
                }
            } else {
                return this.renderNoOrders();
            }
        } else {
            return this.renderAskForOrdersAccessForm();
        }
    }
}

OrdersComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        accessCode: state.shop.ordersAccessCode,
    };
};

const mapDispatchToProps = dispatch => ({
    shopStorageActions: {
        changeCurrentPage: (name) => dispatch(shopActions.changeCurrentPage(name)),
        setOrdersAccessCode: (code) => dispatch(shopActions.setOrdersAccessCode(code))
    }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(OrdersComponent)))

