import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'

class DelayedRedirect extends Component {

    constructor(props) {
        super(props);

        this.timeout = null;

        this.props = props;

        this.state = {
            timeToRedirect: false,
        };
    }

    componentDidMount() {
        this.timeout = setTimeout(() => {
            this.setState({
                timeToRedirect: true,
            })
        }, this.props.delay)
    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
    }

    render() {
        const { delay, ...props } = this.props;
        const { timeToRedirect } = this.state;

        if (timeToRedirect) {
            return <Redirect {...props} />
        }

        return null
    }
}

export default DelayedRedirect