import React from 'react';
import TextField from '@material-ui/core/TextField';
import FormComponentBuilder from "./FormComponent";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core";

const styles = theme => ({
    submitButton: {
        marginTop: theme.spacing(1)
    }
});

class AskForOrdersAccessFormComponent extends FormComponentBuilder {
    constructor(props) {
        super(props);

        this.fields = {
            email: {
                required: true,
            },
        }
    }

    renderForm(form) {
        return (
            <React.Fragment>
                <TextField
                    label="E-mail"
                    margin="normal"
                    variant="outlined"
                    {...form.bindHandlers('email')}
                />

                <Button variant="contained" color="primary" className={this.classes.submitButton} {...form.bindSubmit()}>
                    Submit
                </Button>
            </React.Fragment>
        );
    }
}

AskForOrdersAccessFormComponent.propTypes = {
    ...FormComponentBuilder.propTypes
};

export default withStyles(styles)(AskForOrdersAccessFormComponent);

