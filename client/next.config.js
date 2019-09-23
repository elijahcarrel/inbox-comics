const withSass = require('@zeit/next-sass');
module.exports = withSass({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
  },
  target: 'serverless',
  crossOrigin: 'anonymous',
  experimental: { publicDirectory: true },
});
