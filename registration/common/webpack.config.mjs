import path from "path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"

const config = (env, argv) => {
  const isProd = argv.mode != "development"
  /** @type {import("webpack").Configuration} */
  const config = {
    mode: isProd ? "production" : "development",
    entry: {
      main: "./src/app/entry.tsx",
    },
    output: {
      path: path.resolve("./dist"),
      publicPath: "/",
      clean: true,
      filename: isProd ? "_js/[name].[contenthash].js" : undefined,
      assetModuleFilename: isProd ? "_assets/[contenthash][ext]" : undefined,
    },
    resolve: {
      alias: {
        "#src/config": [
          path.resolve("./custom.ts"),
          path.resolve("./src/config.ts"),
        ],
      },
      extensionAlias: {
        ".js": [".js", ".jsx", ".ts", ".tsx"],
      },
    },
    module: {
      rules: [
        // development: only transpile ts/tsx/jsx
        // production: transpile everything
        {
          test: isProd ? /\.([jt]sx?)$/ : /\.(tsx?|jsx)$/,
          use: "swc-loader",
        },

        // extract css for production
        {
          test: /\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            "sass-loader",
          ],
        },

        // assets
        {
          test: /\.(svg)$/,
          type: "asset/resource",
          use: "svgo-loader",
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "_styles/[contenthash].css",
      }),
      new HtmlWebpackPlugin({
        template: "./index.html",
        inject: "head",
        scriptLoading: "blocking",
      }),
    ],
    optimization: isProd
      ? {
          splitChunks: {
            chunks: "all",
            cacheGroups: {
              config: {
                name: "config",
                filename: "config.js",
                enforce: true,
                reuseExistingChunk: false,
                test: (module) => module.rawRequest == "#src/config",
              },
            },
          },
        }
      : undefined,
    devtool: isProd ? "hidden-source-map" : "eval-source-map",
    cache: {
      type: "filesystem",
      cacheDirectory: path.resolve(".cache/webpack"),
    },
    devServer: {
      historyApiFallback: true,
      client: {
        overlay: {
          runtimeErrors: false,
        },
      },
    },
  }

  return config
}

export default config
