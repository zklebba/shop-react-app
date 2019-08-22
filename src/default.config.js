module.exports = {
    env: 'development',
    isDev: true,
    isProd: false,
    apiBaseUrl: 'http://127.0.0.1:8000/api',
    shopName: 'Shop Name',
    locale: 'en-GB',
    currency: 'GBP',
    timezone: 'Europe/London',
    sessionStorageBasketKey: 'shop_basket_status',
    sessionStorageOrdersAccessKey: 'shop_orders_key',
    stripe_script_url: 'https://js.stripe.com/v3/',
    stripe_pk: '',
    sentry_dsn: '',
    googleMapsScript: 'https://maps.googleapis.com/maps/api/js?key={%API_KEY%}&callback={%CALLBACK%}&language=en&region=GB',
    googleMapsApiKey: '',
    contactDetails: {
        address: "**My company Ltd**\n" +
            "Lorem ipsum\n" +
            "22 Dolor sit amet\n" +
            "Lorem ipsum, UK\n\n" +
            "[www.my-company.co.uk](http://www.my-company.co.uk/ \"Go to my company website\")",
        email: 'sales@my-company.co.uk',
        phone: '01234 567890',
        mapPosition: {lat: 0, lng: 0},
        mapZoom: 14,
        companyName: 'My company Ltd',
    },
    logoUrl: 'https://via.placeholder.com/350x150',
};
