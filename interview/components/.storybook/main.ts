import type { StorybookConfig } from "@storybook/react-webpack5"

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  swc: {
    jsc: {
      transform: {
        react: {
          runtime: "automatic",
        },
      },
    },
  },
  webpackFinal(config) {
    return {
      ...config,
      module: {
        ...config.module,
        rules: [
          ...(config.module?.rules || []),
          {
            test: /\.s[ac]ss$/,
            use: ["style-loader", "css-loader", "sass-loader"],
          },
        ],
      },
      resolve: {
        ...config.resolve,
        extensionAlias: {
          ".js": [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    }
  },
}
export default config
