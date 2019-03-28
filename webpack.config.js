const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'argl.js',
    path: path.resolve(__dirname, './dist'),
    library: 'ArGL',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader'
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(glsl|vert|frag|txt)$/,
        use: 'raw-loader'
      }
    ]
  },

  plugins: [new CleanWebpackPlugin()]
}
