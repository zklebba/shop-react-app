import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DescriptionIcon from '@material-ui/icons/Description';
import { Link } from "react-router-dom";
import MailOutlineIcon from '@material-ui/icons/MailOutline';

const styles = theme => ({

});

class PagesListComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pages: [],
        };

        this.classes = props.classes;
        this.api = props.api;

        this.renderLoading = this.renderLoading.bind(this);
        this.renderPagesList = this.renderPagesList.bind(this);
    }

    componentDidMount() {
        (async () => {
            let pages = await this.api.getPagesList();

            this.setState({
                ...this.state,
                pages: pages,
            });
        })();
    }

    renderLoading() {
        return null;
    }

    renderPagesList() {
        return (
            <List>
                {this.state.pages.map(page => {
                    return (
                        <Link to={"/page/" + page.id} key={"page-list-" + page.id}>
                            <ListItem button>
                                <ListItemIcon>
                                    <DescriptionIcon />
                                </ListItemIcon>
                                <ListItemText primary={page.name} />
                            </ListItem>
                        </Link>
                    );
                })}

                <Link to="/contact">
                    <ListItem button key="contact">
                        <ListItemIcon>
                            <MailOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary="Contact us" />
                    </ListItem>
                </Link>
            </List>
        );
    }

    render() {
        if (this.state.pages && this.state.pages.length) {
            return this.renderPagesList();
        } else {
            return this.renderLoading();
        }
    }
}

PagesListComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
};

export default withStyles(styles)(PagesListComponent);

