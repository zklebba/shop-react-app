const PROD_CONF = require('./prod.config');

module.exports = {
    ...PROD_CONF,
    env: 'development',
    isDev: true,
    isProd: false,
    apiBaseUrl: 'http://127.0.0.1:8000/api',
    shopName: 'Shop Name Dev',
};
