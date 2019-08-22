import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as markdown from 'showdown';

class MarkdownComponent extends Component {
    render() {
        const converter = new markdown.Converter({
            simpleLineBreaks: true,
        });
        const type = this.props.type || 'div';

        let text = this.props.children;

        if (text instanceof Array) {
            console.error('Component accept only one children node');
            text = text[0];
        }

        text = text.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
            return '&#'+i.charCodeAt(0)+';';
        });

        const props = {
            className: 'markdown-content',
            dangerouslySetInnerHTML: {
                __html: converter.makeHtml(text)
            }
        };

        switch (type) {
            case 'span': {
                return (<span {...props}></span>)
            }

            case 'p': {
                return (<p {...props}></p>)
            }

            case 'div': {
                return (<div {...props}></div>)
            }
        }
    }
}

MarkdownComponent.propTypes = {
    type: PropTypes.oneOf(['span', 'div', 'p']),
    children: PropTypes.string.isRequired
};

export default MarkdownComponent

