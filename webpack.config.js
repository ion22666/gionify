const path = require('path');
module.exports = {
    mode: "development",
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [{loader: 'file-loader',options: { outputPath: '.', name: '[name].css'}},"sass-loader"],
        },
      ],
    },
    entry: path.resolve(__dirname, './assets/scss/main.scss'),
    output: {
        path: path.resolve(__dirname, './static/style'),
        filename: 'core.js',
    },
};
