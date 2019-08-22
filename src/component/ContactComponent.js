import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AlertMessageComponent from "./AlertMessageComponent";
import MarkdownComponent from "./MarkdownComponent";
import { Typography } from "@material-ui/core";
import { shopActions } from "../service/shop/duck";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'
import CONFIG from "../config";
import * as markdown from 'showdown';
import ContactFormComponent from "./ContactFormComponent";

const styles = theme => ({
    mapContainer: {
        display: 'flex',
    },

    googleMap: {
        width: '100%',
        minHeight: '317px',
    },

    logoContainer: {
        width: '100%',
    },

    logo: {
        width: '85%',
        height: 'auto',
    },

    title: {
        marginBottom: theme.spacing(3),
        fontSize: theme.spacing(3),
    }
});

const GOOGLE_MAP_NODE_ID = 'google_map';

class ContactComponent extends Component {
    constructor(props) {
        super(props);

        this.classes = props.classes;

        this.markdown = new markdown.Converter();

        this.state = {
            isContactFormSubmitted: false,
        };

        this.shopStorageActions = props.shopStorageActions;
        this.api = props.api;

        this.onSubmitContactForm = this.onSubmitContactForm.bind(this);
    }

    componentDidMount() {
        this.shopStorageActions.changeCurrentPage('Contact us');

        // Load google maps
        window.initGoogleMaps = () => {
            let map = new google.maps.Map(document.getElementById(GOOGLE_MAP_NODE_ID), {
                center: CONFIG.contactDetails.mapPosition,
                zoom: CONFIG.contactDetails.mapZoom,
            });

            new google.maps.Marker({
                position: CONFIG.contactDetails.mapPosition,
                map: map,
                title: CONFIG.contactDetails.companyName,
            });
        };

        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = CONFIG.googleMapsScript
            .replace('{%API_KEY%}', CONFIG.googleMapsApiKey)
            .replace('{%CALLBACK%}', 'initGoogleMaps');
        script.async = true;
        script.defer = true;

        document.getElementsByTagName('head')[0].appendChild(script);
    }

    onSubmitContactForm(isValid, values) {
        if (isValid) {
            this.api.sendContactMessage(values);

            this.setState({
                ...this.state,
                isContactFormSubmitted: true,
            })
        }
    }

    render() {
        return (
            <React.Fragment>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Typography component="h1" variant="h2" className={this.classes.title}>
                            Contact with us
                        </Typography>

                        {this.state.isContactFormSubmitted ? (
                            <AlertMessageComponent variant="success">
                                Thank you for sending a message. We will contact you shortly.
                            </AlertMessageComponent>
                        ) : (
                            <ContactFormComponent setFormValues={this.onSubmitContactForm} />
                        )}
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <div className={this.classes.logoContainer}>
                                    <img src={CONFIG.logoUrl} className={this.classes.logo} />
                                </div>
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <MarkdownComponent>
                                    {CONFIG.contactDetails.address}
                                </MarkdownComponent>
                            </Grid>
                        </Grid>

                        <div className={this.classes.mapContainer}>
                            <div id={GOOGLE_MAP_NODE_ID} className={this.classes.googleMap} />
                        </div>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

ContactComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
    shopStorageActions: {
        changeCurrentPage: (name) => dispatch(shopActions.changeCurrentPage(name))
    }
});

export default withRouter(connect(null, mapDispatchToProps)(withStyles(styles)(ContactComponent)))

