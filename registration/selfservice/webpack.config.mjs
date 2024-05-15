import path from "path"
import webpack from "webpack"

import packageJson from "./package.json" with { type: "json" }
const peerDeps = packageJson.peerDependencies

const config = (env, argv) => {
  const isProd = argv.mode != "development"
  /** @type {import("webpack").Configuration} */
  const config = {
    mode: isProd ? "production" : "development",
    entry: {
      main: "./src/index.ts",
    },
    output: {
      path: path.resolve("./dist"),
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
      ],
    },
    plugins: [
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
        },
      }),
    ],
  }

  return config
}

export default config
