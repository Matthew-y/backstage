const { defineConfig } = require("@vue/cli-service");
const webpack = require('webpack')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      require("unplugin-element-plus/webpack")({
        // options
        type: { Format: "cjs" },
      }),
    ],
  },
  devServer: {
    port: 8093
  }
});