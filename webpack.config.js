module.exports = {
  entry: [
    './src/index.ts'
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'main.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loaders: ['style', 'css'], exclude: /node_modules/ },
      { test: /\.(js|ts)$/, loaders: ['ts'], exclude: /node_modules/ }
    ]
  }
}
