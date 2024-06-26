/** @type {import("next").NextConfig} */

const path = require('path');
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
	reactStrictMode: false,
	experimental: {
    nextScriptWorkers: true,
  },
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')],
	},
	images: {
		domains: [`${process.env.API_ROOT_URL}`],
		remotePatterns: [
			{
				protocol: `${process.env.HTTP_PROTOCOLE}`,
				hostname: `${process.env.API_ROOT_URL}`,
			},
		],
	},
	sentry: {
		// Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
		// for client-side builds. (This will be the default starting in
		// `@sentry/nextjs` version 8.0.0.) See
		// https://webpack.js.org/configuration/devtool/ and
		// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
		// for more information.
		hideSourceMaps: true,
		autoInstrumentMiddleware: false,
	},
};

module.exports = withSentryConfig(nextConfig, {
	// Additional config options for the Sentry Webpack plugin. Keep in mind that
	// the following options are set automatically, and overriding them is not
	// recommended:
	//   release, url, org, project, authToken, configFile, stripPrefix,
	//   urlPrefix, include, ignore
	// For all available options, see:
	// https://github.com/getsentry/sentry-webpack-plugin#options.
	silent: false,
});

// module.exports = {
// 	...nextConfig,
// }

// module.exports = {
// 	...nextConfig,
//
// 	// webpack5: true,
// 	// webpack: (config) => {
// 	// 	config.resolve.fallback = {fs: false};
// 	// 	return config;
// 	// }
// };
