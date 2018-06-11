// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const { readdirSync, statSync } = require('fs');
const path = require('path');
const dirs = p => readdirSync(p).filter(f => statSync(path.join(p, f)).isDirectory());

const AppConfig = {
    context: path.join(__dirname, '/src/app'),
    entry: ['./index.js', './index.scss'],
    output: {
        path: path.join(__dirname, '/public/dist/'),
        filename: 'app.min.js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'eslint-loader'
                    }
                ]
            },
            {
                test: /\.scss$/,
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
                            outputStyle: 'compressed'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // new UglifyJsPlugin(),
        new StyleLintPlugin()
    ]
};

let configs = [AppConfig];
const componentResources = dirs(path.join(__dirname, '/src/components'));
// Create webpack configuration object for each component
componentResources.forEach(function (directory, index) {
    let componentPath = path.join(__dirname, '/src/components', directory);
    let componentConfig = {
        context: componentPath,
        entry: {
            index: './index.js',
            style: './index.scss',
            markup: './index.html'
        },
        output: {
            path: path.join(__dirname, '/build', directory)
        },
        mode: 'production',
        optimization: {
            minimize: true,
            runtimeChunk: true
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'eslint-loader'
                        }
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'index.css',
                            }
                        },
                        {
                            loader: 'postcss-loader',
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                outputStyle: 'compressed'
                            }
                        }
                    ]
                },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'index.html'
                            }
                        },
                        {
                            loader: 'extract-loader'
                        },
                        {
                            loader: 'html-loader'
                        }
                    ]
                }
            ]
        },
        plugins: [
            // new UglifyJsPlugin(),
            new StyleLintPlugin(),
            new ZipPlugin({
                path: path.join(__dirname, '/public/dist/components'),
                include: ['index.js', 'index.css', 'index.html'],
                filename: directory + '.zip',
            })
        ]
    };

    configs.push(componentConfig);
});

module.exports = configs;
