const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
    entry: ['./src/index.js', './src/index.scss'],
    output: {
        path: __dirname + '/public/dist/',
        filename: 'app.min.js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                include: __dirname + '/src/',
                exclude: /(node_modules|public)/,
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
                    },
                ],
            },
            {
                test: /\.scss$/,
                include: __dirname + '/src/',
                exclude: /(node_modules|public)/,
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
                            includePaths: [__dirname + '/src'],
                            outputStyle: 'compressed',
                        }
                    },
                ]
            }
        ]
    },
    plugins: [
        new UglifyJsPlugin(),
        new StyleLintPlugin(),
    ],
    resolve: {
        alias: {
            "react": "preact-compat",
            "react-dom": "preact-compat"
        }
    }
};



// end
