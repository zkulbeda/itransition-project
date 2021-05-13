module.exports = {
  basePath: '',
  future: {
    webpack5: true,
  },
  webpack: (config) => {
    config.resolve.extensions.push('.mjs');
    config.module.rules.push({
      test: /\.mjs$/,
      type: 'javascript/auto',
      resolve: {
        // fullySpecified: true
      },
    });
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
