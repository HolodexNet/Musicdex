const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://staging2.holodex.net/",
      changeOrigin: true,
      pathRewrite: {
        "^/api/v2": "/v2",
      },
    })
  );
};
