const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = (webpackConfigEnv, argv) => {
  const orgName = "jogo-do-impostor";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "root-config",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  return merge(defaultConfig, {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    entry: "./src/jogo-do-impostor-root-config",
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Security-Policy":
          "default-src 'self' https: localhost:* 192.168.15.8:*; " +
          "script-src 'unsafe-inline' 'unsafe-eval' https: localhost:* 192.168.15.8:* 'self'; " +
          "connect-src https: localhost:* ws://localhost:* 192.168.15.8:* ws://192.168.15.8:*; " +
          "style-src 'unsafe-inline' https: localhost:* 192.168.15.8:* 'self'; " +
          "img-src 'self' data: https: 192.168.15.8:*;",
      },
      historyApiFallback: true,
      hot: false,
      liveReload: false,
      port: 9000,
      allowedHosts: "all",
      host: "0.0.0.0", // Isso permite acesso externo
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          orgName,
        },
      }),
    ],
  });
};
