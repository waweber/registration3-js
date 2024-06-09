import path from "path"
import webpack from "webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"

import packageJson from "./package.json" with { type: "json" }
const deps = packageJson.dependencies
const peerDeps = packageJson.peerDependencies

const config = (env, argv) => {
  const isProd = argv.mode != "development"
  /** @type {import("webpack").Configuration} */
  const config = {
    mode: isProd ? "production" : "development",
    entry: {
      main: "./src/bootstrap.ts",
    },
    output: {
      path: path.resolve("./dist"),
      publicPath: "/",
      filename: isProd ? "[name].[contenthash].js" : undefined,
      library: {
        name: "registration_selfservice",
        type: "var",
      },
    },
    resolve: {
      extensionAlias: {
        ".js": [".js", ".jsx", ".ts", ".tsx"],
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "swc-loader",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.s[ac]ss$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.svg$/,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html",
      }),
      ...(isProd
        ? [
            new webpack.container.ModuleFederationPlugin({
              filename: "remoteEntry.js",
              name: "registration_selfservice",
              exposes: {
                "./": "./src/index.ts",
              },
              shared: {
                react: {
                  singleton: true,
                  requiredVersion: peerDeps.react,
                },
                "react-dom": {
                  singleton: true,
                  requiredVersion: peerDeps["react-dom"],
                },
                "@mantine/core/": {
                  singleton: true,
                  requiredVersion: peerDeps["@mantine/core"],
                },
                "@mantine/hooks/": {
                  singleton: true,
                  requiredVersion: peerDeps["@mantine/hooks"],
                },
                "@open-event-systems/registration-common/":
                  deps["@open-event-systems/registration-common"],
              },
            }),
          ]
        : []),
    ],
    optimization: isProd
      ? {
          splitChunks: {
            chunks: "all",
          },
        }
      : undefined,
    devtool: isProd ? undefined : "eval-source-map",
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
