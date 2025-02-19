const path = require("path");

module.exports = {
  entry: {
    index: "./src/index.js",
  },
  target: "web",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: "validateForm",
    libraryTarget: "umd",
    globalObject: "this",
    umdNamedDefine: true,
  },
  devServer: {
    static: path.resolve(__dirname, "src"), // Serve files from the src directory
    hot: true, // Enable hot reloading
    open: true, // Auto-open browser
    port: 3000, // Port to run the server
  },
};
