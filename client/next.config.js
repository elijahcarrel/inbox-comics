const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');
module.exports = withCss(
  withSass({
    webpack (config, options) {
      config.module.rules.forEach(rule => {
        if (rule.test.toString().includes('.scss')) {
          
          rule.rules = rule.use.map(useRule => {
            if (typeof useRule === 'string') {
              return {
                loader: useRule,
              };
            }
            if (useRule.loader.startsWith('css-loader')) {
              return {
                oneOf: [
                  {
                    test: /\.global\.scss$/,
                    loader: useRule.loader,
                    options: {
                      ...useRule.options,
                      modules: false,
                    },
                  },
                  {
                    loader: useRule.loader,
                    options: useRule.options,
                  },
                ],
              };
            }
        
            return useRule;
          });
      
          delete rule.use;
        }
      });
      return config;
    }
  })
);
