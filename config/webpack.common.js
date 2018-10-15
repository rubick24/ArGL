const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    library: 'ArGL',
    libraryTarget: 'umd'
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
      },
      'hammerjs': {
        root: 'Hammer',
        commonjs: 'hammerjs',
        commonjs2: 'hammerjs',
        amd: 'hammerjs'
      },
      'webgl-obj-loader': {
        root: 'OBJ',
        commonjs: 'webgl-obj-loader',
        commonjs2: 'webgl-obj-loader',
        amd: 'webgl-obj-loader'
      }
    }
  ]
};
