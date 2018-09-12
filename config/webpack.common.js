const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: 'file-loader'
      },
      {
        test: /\.(glsl|vs|fs|obj|txt)$/,
        use: 'raw-loader'
      }
    ]
  }
};
