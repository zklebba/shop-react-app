const path = require('path');

const DEV = 'development';
const PROD = 'production';

module.exports = (env, argv) => {

    let mode = argv.mode || DEV;

    let config = {
        mode: mode,
        entry: {
            index: './src/index.js'
        },
        output: {
            path: mode === DEV ? path.resolve(__dirname, 'build') : path.resolve(__dirname, '../../../public/assets/app/build'),
            filename: 'index.js'
        },
        module: {
            rules: [
                {
                    test: require.resolve('./src/config.js'),
                    use: [
                        {
                            loader: 'val-loader',
                            options: {
                                APP_CONFIG: mode === DEV ? require('./src/dev.config.js') : require('./src/prod.config.js')
                            }
                        }
                    ]
                },
                {
                    test: /\.(js|jsx)$/,
                    include: path.resolve(__dirname, 'src'),
                    exclude: /(node_modules|bower_components|build)/,
                    use: {
                        loader: 'babel-loader',
                    }
                },
                {
                    test: /\.css/,
                    use: [
                        {
                            loader: 'style-loader' // creates style nodes from JS strings
                        },
                        {
                            loader: 'css-loader', // translates CSS into CommonJS
                            options: {
                                sourceMap: (mode === DEV),
                            },
                        },
                    ]
                },
                {
                    test: /\.less/,
                    use: [
                        {
                            loader: 'style-loader' // creates style nodes from JS strings
                        },
                        {
                            loader: 'css-loader', // translates CSS into CommonJS
                            options: {
                                sourceMap: (mode === DEV),
                            },
                        },
                        {
                            loader: 'less-loader', // compiles Sass to CSS, using Node Sass by default
                            options: {
                                sourceMap: (mode === DEV),
                            },
                        },
                    ]
                },
            ]
        }
    };

    if (mode === DEV) {
        const HtmlWebPackPlugin = require("html-webpack-plugin");

        config = {
            ...config,
            optimization: {},
            devtool: 'inline-source-map',
            watch: true,
            stats: {
                errorDetails: true
            },

            devServer: {
                historyApiFallback: true,
            },

            plugins: [
                new HtmlWebPackPlugin({
                    template: "./public/index.html",
                    filename: "./index.html"
                })
            ]
        }
    }

    return config;
};
