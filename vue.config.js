module.exports = {
  devServer: {
    host: process.env.HOST || "localhost",
  },
  configureWebpack: {
    resolve: {
      symlinks: false,
    },
  },
  transpileDependencies: ["vuetify"],
};
