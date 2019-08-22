import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import StoreIcon from '@material-ui/icons/Store';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import { Link } from "react-router-dom";

const styles = theme => ({

});

class CategoriesListComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
        };

        this.classes = props.classes;
        this.api = props.api;

        this.renderLoading = this.renderLoading.bind(this);
        this.renderCategoriesList = this.renderCategoriesList.bind(this);
    }

    componentDidMount() {
        (async () => {
            let categories = await this.api.getCategories();

            this.setState({
                ...this.state,
                categories: categories,
            });
        })();
    }

    renderLoading() {
        return null;
    }

    renderCategoriesList() {
        return (
            <List>
                <Link to="/">
                    <ListItem button key="listing">
                        <ListItemIcon>
                            <StoreIcon />
                        </ListItemIcon>
                        <ListItemText primary="All products" />
                    </ListItem>
                </Link>

                {this.state.categories.map(category => {
                    return (
                        <Link to={"/category/" + category.id} key={"category-list-" + category.id}>
                            <ListItem button>
                                <ListItemIcon>
                                    <FolderOpenIcon />
                                </ListItemIcon>
                                <ListItemText primary={category.name} />
                            </ListItem>
                        </Link>
                    );
                })}
            </List>
        );
    }

    render() {
        if (this.state.categories && this.state.categories.length) {
            return this.renderCategoriesList();
        } else {
            return this.renderLoading();
        }
    }
}

CategoriesListComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
};

export default withStyles(styles)(CategoriesListComponent);

