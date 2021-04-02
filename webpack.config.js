const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin, SourceMapDevToolPlugin } = require("webpack");

const ROOT = path.resolve( __dirname, 'src' );

module.exports = {
    context: ROOT,
    entry: './index.ts',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    devServer: { },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.(gif|png|jpe?g|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {},
                    },
                ],
            },
            /****************
             * PRE-LOADERS
             *****************/
            {
                enforce: 'pre',
                test: /\.js$/,
                use: 'source-map-loader'
            },
            /****************
             * LOADERS
             *****************/
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: { allowTsInNodeModules: true }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            minify: true,
            hash: true,
            inject: false,
            template: `${ROOT}/index.html`,
        }),
        new DefinePlugin({
            DATA: JSON.stringify(require("./package.json").data)
        }),
        new SourceMapDevToolPlugin({
            filename: "[file].map"
        })
    ]
};
