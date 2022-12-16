const path = require('path');
module.exports = {
    mode: "development",
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: { 
                            outputPath: '.', 
                            name: 'style/[name].css'
                        }
                    },
                    "sass-loader"
                ],
            },
        ],
    },
    entry: {
        "style/main.js":'./assets/scss/main.scss',
        "script/output.js":'./assets/js/input.js',
    },
    output: {
        path: path.resolve(__dirname, './static'),
        filename: '[name]',
        iife: false,
    },
    optimization: {
        minimize: false,
    },
    devtool: false,
    cache: false,
};
