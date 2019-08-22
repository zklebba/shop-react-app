import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";
import FormComponentBuilder from "./FormComponent";

class AdressDetailsFormComponent extends FormComponentBuilder {
    constructor(props) {
        super(props);

        const defaults = props.defaults;

        this.fields = {
            first_name: {
                required: true,
                default: defaults.first_name || '',
            },
            last_name: {
                required: true,
                default: defaults.last_name || '',
            },
            address: {
                required: true,
                default: defaults.address || '',
            },
            address_line_1: {
                required: false,
                default: defaults.address_line_1 || '',
            },
            phone: {
                required: true,
                default: defaults.phone || '',
            },
            country: {
                required: true,
                default: defaults.country || '',
            },
            city: {
                required: true,
                default: defaults.city || '',
            },
            post_code: {
                required: true,
                default: defaults.post_code || '',
            },
        };
    }

    renderForm(form) {
        return (
            <React.Fragment>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <TextField
                            label="First name"
                            margin="normal"
                            variant="outlined"
                            {...form.bindHandlers('first_name')}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <TextField
                            label="Last name"
                            margin="normal"
                            variant="outlined"
                            {...form.bindHandlers('last_name')}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField
                            label="Address"
                            margin="normal"
                            variant="outlined"
                            {...form.bindHandlers('address')}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <TextField
                            label="Apartament, suite, etc. (optional)"
                            margin="normal"
                            variant="outlined"
                            {...form.bindHandlers('address_line_1')}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <TextField
                            label="Phone number *"
                            margin="normal"
                            variant="outlined"
                            {...form.bindHandlers('phone')}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={4} sm={4} md={4} lg={4}>
                        <TextField
                            label="Country"
                            margin="normal"
                            variant="outlined"
                            {...form.bindHandlers('country')}
                        />
                    </Grid>

                    <Grid item xs={4} sm={4} md={4} lg={4}>
                        <TextField
                            label="Town / City"
                            margin="normal"
                            variant="outlined"
                            {...form.bindHandlers('city')}
                        />
                    </Grid>

                    <Grid item xs={4} sm={4} md={4} lg={4}>
                        <TextField
                            label="Postal code"
                            margin="normal"
                            variant="outlined"
                            {...form.bindHandlers('post_code')}
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

AdressDetailsFormComponent.propTypes = {
    setFormValues: PropTypes.func.isRequired,
    validateNow: PropTypes.bool.isRequired,
};

export default AdressDetailsFormComponent;

