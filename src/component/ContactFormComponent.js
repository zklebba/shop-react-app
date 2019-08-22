import React from 'react';
import TextField from '@material-ui/core/TextField';
import FormComponentBuilder from "./FormComponent";
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core";

const styles = theme => ({
    submitButton: {
        width: '100%',
        marginTop: theme.spacing(1)
    }
});

class ContactFormComponent extends FormComponentBuilder {
    constructor(props) {
        super(props);

        this.fields = {
            name: {
                required: true,
            },
            email: {
                required: true,
            },
            subject: {
                required: true,
            },
            message: {
                required: true,
            },
        };

        this.classes = props.classes;
        this.renderForm = this.renderForm.bind(this);
    }

    renderForm(form) {
        return (
            <React.Fragment>
                <TextField
                    label="Name"
                    margin="normal"
                    variant="outlined"
                    {...form.bindHandlers('name')}
                />

                <TextField
                    label="E-mail"
                    margin="normal"
                    variant="outlined"
                    type="email"
                    {...form.bindHandlers('email')}
                />

                <TextField
                    label="Subject"
                    margin="normal"
                    variant="outlined"
                    {...form.bindHandlers('subject')}
                />

                <TextField
                    label="Message"
                    margin="normal"
                    variant="outlined"
                    multiline
                    rowsMax="5"
                    rows="5"
                    {...form.bindHandlers('message')}
                />

                <Button variant="contained" color="primary" className={this.classes.submitButton} {...form.bindSubmit()}>
                    Submit
                </Button>
            </React.Fragment>
        );
    }
}

ContactFormComponent.propTypes = {
    ...FormComponentBuilder.propTypes
};

export default withStyles(styles)(ContactFormComponent);

