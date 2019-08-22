import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import ChevronRight from '@material-ui/icons/ChevronRight';
import CONFIG from '../config';
import { connect } from "react-redux";
import { Link } from "react-router-dom"

const styles = theme => ({
    shopTitle: {
        flexGrow: 1,
    },
    icon: {
        position: 'relative',
        top: '5px',
        color: theme.palette.grey.A100,
    }
});

class ShopTitleBarComponent extends Component {
    render() {
        const title = CONFIG.shopName;

        return (
            <Typography variant="h6" noWrap className={this.props.classes.shopTitle}>
                <Link to="/">
                    {title}
                </Link>

                {this.props.pageTitle ? (
                    <React.Fragment>
                        <ChevronRight className={this.props.classes.icon} />
                        {this.props.pageTitle}
                    </React.Fragment>
                ) : (
                    <React.Fragment />
                )}
            </Typography>
        );
    }
}

ShopTitleBarComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    pageTitle: PropTypes.string,
};

const mapStateToProps = (state) => {
    return {
        pageTitle: state.shop.currentPageName,
    };
};

export default connect(mapStateToProps)(withStyles(styles)(ShopTitleBarComponent));

