import path from "path"
import webpack from "webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"

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
      filename: isProd ? "[name].[contenthash].js" : undefined,
    },
    resolve: {
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
    cache: {
      type: "filesystem",
      cacheDirectory: ".cache/webpack",
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
