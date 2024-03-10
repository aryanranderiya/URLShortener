const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/l",
    createProxyMiddleware({
      target: "https://urlshortener-qwlv3u8sc-aryanranderiya.vercel.app/",
      changeOrigin: true,
    })
  );
  app.use(
    "/insert",
    createProxyMiddleware({
      target: "https://urlshortener-qwlv3u8sc-aryanranderiya.vercel.app/",
      changeOrigin: true,
    })
  );
};