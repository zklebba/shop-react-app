import React, { Component } from 'react';
import { withStyles } from "@material-ui/core";
import AlertMessageComponent from "./AlertMessageComponent";
import PropTypes from "prop-types";
import classNames from 'classnames';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },

    textField: {
        width: '100%',
    },

    error: {
        width: '100%',
        marginBottom: theme.spacing(1),
    }
});

class FormComponent extends Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.classes = props.classes;
        this.setFormValues = props.setFormValues;
        this.isRequired = {};

        this.isUnmonted = false;

        this.state = {
            fields: {

            },

            hasError: {

            },

            isValid: true,
        };

        let fields = this.props.fields;

        for (let name in fields) {
            let field = fields[name];

            this.state.fields[name] = field.default || '';
            this.state.hasError[name] = false;
            this.isRequired[name] = field.required || false;
        }

        this.handleChange = this.handleChange.bind(this);
        this.bindHandlers = this.bindHandlers.bind(this);
        this.validate = this.validate.bind(this);
        this.bindSubmit = this.bindSubmit.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            isMounted: true,
        })
    }

    bindHandlers(name, classes = null) {
        let styleClasses = this.classes.textField;

        if (classes) {
            styleClasses = classNames(styleClasses, classes);
        }

        return {
            id: name,
            className: styleClasses,
            value: this.state.fields[name],
            onChange: this.handleChange(name),
            error: this.state.hasError[name],
            required: this.isRequired[name],
        };
    }

    submit() {
        let isValid = this.validate();
        this.setFormValues(isValid, Object.assign({}, this.state.fields));
    }

    bindSubmit() {
        return {
            onClick: this.submit
        }
    }

    componentDidUpdate() {
        if (this.isUnmonted) {
            return;
        }

        if (this.props.validateNow) {
            this.submit();
        }
    }

    componentWillUnmount() {
        this.isUnmonted = true;
    }

    validate() {
        let isValid = true;

        for (let field in this.state.fields) {
            if (this.state.fields.hasOwnProperty(field)) {
                let value = this.state.fields[field];
                if (this.isRequired[field] && !value.length) {
                    isValid = false;

                    setTimeout(() => {
                        this.setState({
                            ...this.state,
                            isValid: false,
                        }, () => {
                            setTimeout(() => {
                                this.setState({
                                    ...this.state,
                                    hasError: {
                                        ...this.state.hasError,
                                        [field]: true,
                                    }
                                })
                            });
                        });
                    });
                }
            }
        }

        if (isValid !== this.state.isValid) {
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    isValid: isValid,
                });
            });
        }

        return isValid;
    }

    handleChange(name) {
        if (this.isUnmonted) {
            return;
        }

        return event => {
            event.preventDefault();
            let value = event.target.value;

            if (this.state.hasError[name] && value.length > 0) {
                setTimeout(() => {
                    this.setState({
                        ...this.state,
                        hasError: {
                            ...this.state.hasError,
                            [name]: false,
                        }
                    });
                });
            }

            setTimeout(() => {
                this.setState({
                    ...this.state,
                    fields: {
                        ...this.state.fields,
                        [name]: value
                    }
                });
            });
        }
    };

    render() {
        return (
            <form className={this.classes.container}>
                {!this.state.isValid ? (
                    <AlertMessageComponent variant="warning" className={this.classes.error}>
                        Please complete all fields marked *.
                    </AlertMessageComponent>
                ) : (
                    <React.Fragment />
                )}

                {this.props.render(this)}

            </form>
        );
    }
}

FormComponent = withStyles(styles)(FormComponent);

class FormComponentBuilder extends Component {
    constructor(props) {
        super(props);

        this.setFormValues = props.setFormValues;

        this.props = props;

        this.state = {
            ...this.state || {},
            validateNow: props.validateNow,
        };

        this.fields = {}
    }

    componentDidUpdate() {
        if (this.props.validateNow !== this.state.validateNow) {
            this.setState({
                ...this.state,
                validateNow: this.props.validateNow
            });
        }
    }

    renderForm(form) {
        return null;
    }

    render() {
        const props = {
            setFormValues: this.setFormValues,
            validateNow: this.state.validateNow,
            fields: this.fields,
            render: this.renderForm
        };

        return (
            <FormComponent {...props} />
        );
    }
}

const PropTypesSetting = {
    setFormValues: PropTypes.func.isRequired,
    validateNow: PropTypes.bool.isRequired,
};

const DefaultProps = {
    validateNow: false,
};

FormComponent.propTypes = PropTypesSetting;
FormComponent.defaultProps = DefaultProps;
FormComponentBuilder.propTypes = PropTypesSetting;
FormComponentBuilder.defaultProps = DefaultProps;

export default FormComponentBuilder;
