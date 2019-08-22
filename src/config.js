module.exports = ({ APP_CONFIG }) => {
    return {
        code: 'module.exports = ' + JSON.stringify(APP_CONFIG)
    };
};
