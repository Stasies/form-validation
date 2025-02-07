const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: ["node_modules"],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"], // Compile modern JS
          },
        },
      },
    ],
  },
  entry: {
    index: "./src/index.js",
    experiment: "./src/experiment.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  devServer: {
    static: path.resolve(__dirname, "src"), // Serve files from the src directory
    hot: true, // Enable hot reloading
    open: true, // Auto-open browser
    port: 3000, // Port to run the server
  },
};
