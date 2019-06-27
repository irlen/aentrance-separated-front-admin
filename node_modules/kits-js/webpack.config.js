var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        'kits-js': path.join(__dirname, './src/index.js'),
    },
    externals: [
        // {
        //     react: {
        //         amd: 'react',
        //         commonjs: 'react',
        //         commonjs2: 'react',
        //         root: 'React',
        //     },
        // },
    ],
    output: {
        filename: '[name].min.js',
        library: 'KitsJs',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [{
            test: /\.js|\.jsx$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            options: {
                presets: ['es2015', 'react']
            }
        }],
    },
    optimization: {
        minimize: true
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
    ]
};