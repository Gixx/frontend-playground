const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const path = require('path');

const AppConfig = {
    entry: ['./src/index.js', './src/index.scss'],
    output: {
        path: path.join(__dirname, '/public/dist/'),
        filename: 'app.min.js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.join(__dirname, '/src/'),
                exclude: /(node_modules|public|src\/components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                'es2015'
                            ],
                            plugins: [
                                ['transform-react-jsx', { pragma: 'h' }]
                            ]
                        }
                    },
                    {
                        loader: 'eslint-loader'
                    }
                ]
            },
            {
                test: /\.scss$/,
                include: path.join(__dirname, '/src/'),
                exclude: /(node_modules|public|src\/components)/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'app.min.css',
                        }
                    },
                    {
                        loader: 'postcss-loader',
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [path.join(__dirname, '/src')],
                            outputStyle: 'compressed',
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new UglifyJsPlugin(),
        new StyleLintPlugin()
    ],
    resolve: {
        alias: {
            'react': 'preact-compat',
            'react-dom': 'preact-compat'
        }
    }
};

const configs = [AppConfig];

// TODO generate webpack config for the components

module.exports = configs;
