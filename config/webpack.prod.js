const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'argl.min.js'
  },
  optimization: {
    minimizer: [new UglifyJSPlugin()]
  }
});
