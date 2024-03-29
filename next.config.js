module.exports = {
  crossOrigin: "anonymous",
  webpack: (config) => {
    if (!config.module.rules) {
      config.module.rules = [];
    }
    config.module.rules.push(
      // The api directory is a separate project. We should ignore it so that
      // it doesn't get uselessly bundled into this project.
      {
        test: /^\/api\/.*/,
        loader: "ignore-loader",
      },
    );
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "syndication-images.s3.us-west-2.amazonaws.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};
