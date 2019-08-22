import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";
import FormComponentBuilder from "./FormComponent";

class CheckoutDetailsFormComponent extends FormComponentBuilder {
    constructor(props) {
        super(props);

        this.fields = {
            email: {
                required: true,
            },
            comment: {
                required: false,
            },
        }
    }

    renderForm(form) {
        return (
            <React.Fragment>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <TextField
                            label="E-mail"
                            margin="normal"
                            variant="outlined"
                            {...form.bindHandlers('email')}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <TextField
                            label="Order comment"
                            margin="normal"
                            variant="outlined"
                            multiline
                            rowsMax="4"
                            {...form.bindHandlers('comment')}
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

CheckoutDetailsFormComponent.propTypes = {
    setFormValues: PropTypes.func.isRequired,
    validateNow: PropTypes.bool.isRequired,
};

export default CheckoutDetailsFormComponent;

