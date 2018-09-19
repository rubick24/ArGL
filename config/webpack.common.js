const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    library: 'ArGL',
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
  },
  externals: [
    {
      'gl-matrix': {
        root: 'window',
        commonjs: 'gl-matrix',
        commonjs2: 'gl-matrix',
        amd: 'gl-matrix'
      }
    }
  ]
};
