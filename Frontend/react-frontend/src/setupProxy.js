const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/l",
    createProxyMiddleware({
      target: "https://urlshortener-3bu9011g3-aryanranderiya.vercel.app/",
      changeOrigin: true,
    })
  );
  app.use(
    "/insert",
    createProxyMiddleware({
      target: "https://urlshortener-3bu9011g3-aryanranderiya.vercel.app/",
      changeOrigin: true,
    })
  );
};
