const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin, SourceMapDevToolPlugin } = require("webpack");

const ROOT = path.resolve( __dirname, 'src' );
const ROOT_ENGINE = path.resolve( ROOT, 'engine' );
const BUILD = path.resolve(__dirname, 'build');

const name = JSON.stringify(require("./package.json").name);
const buildId = JSON.stringify(require("./package.json").buildId);

module.exports = [
    {
        context: ROOT,
        name: "electron",
        entry: './electron/preload.ts',
        target: 'electron-main',
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    options: { allowTsInNodeModules: true }
                },
            ]
        },
        externals: {
            'sharp': 'commonjs sharp'
        },
        output: {
            path: BUILD,
            filename: 'preload.js',
        }
    },
    {
        context: ROOT,
        name: "electron",
        entry: './index.ts',
        target: 'electron-main',
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    options: { allowTsInNodeModules: true }
                },
                {
                    test: /\.(gif|png|jpe?g|svg)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {},
                        },
                    ],
                },
            ]
        },
        externals: {
            'sharp': 'commonjs sharp'
        },
        output: {
            path: BUILD,
            filename: 'index.js'
        },
        plugins: [
            new DefinePlugin({
                BUILD_ID: buildId,
                NAME: name,
            })
        ]
    },
    {
        context: ROOT_ENGINE,
        name: "engine",
        entry: './index.ts',
        output: {
            path: BUILD,
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
                },
            ]
        },
        externals: {
            'sharp': 'commonjs sharp'
        },
        plugins: [
            new HtmlWebpackPlugin({
                minify: true,
                hash: true,
                inject: false,
                template: `${ROOT_ENGINE}/index.html`,
            }),
            new DefinePlugin({
                BUILD_ID: buildId,
                NAME: name,
            }),
            new SourceMapDevToolPlugin({
                filename: "[file].map"
            })
        ]
    },
];
