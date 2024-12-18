const { configure } = require('quasar/wrappers');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

module.exports = configure(function (ctx) {
	return {
		supportTS: {
			tsCheckerConfig: {
				eslint: {
					enabled: true,
					files: './src/**/*.{ts,tsx,js,jsx,vue}'
				}
			}
		},

		preFetch: true,
		boot: ['i18n', 'axios', 'smartEnginEntrance'],
		css: ['app.scss', ctx.dev ? 'font.dev.scss' : 'font.pro.scss'],

		extras: ['material-icons', 'roboto-font'],

		vendor: {
			remove: ['@bytetrade/ui']
		},

		build: {
			target: {
				browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
				node: 'node16'
			},

			env: {
				URL: process.env.URL,
				CERT_URL: process.env.CERT_URL,
				CACHE_CONTROL: 'max-age=31536000, public',
				EXPIRES: 'Wed, 01 Jan 2025 00:00:00 GMT'
			},

			vueRouterMode: 'history',
			gzip: true,
			// analyze: true,
			extractCSS: true,
			sourceMap: true,

			extendWebpack(cfg) {
				!ctx.dev &&
					cfg.plugins.push(
						new PreloadWebpackPlugin({
							rel: 'preload',
							include: 'allAssets',
							fileWhitelist: [/.+MaterialSymbolsRounded.+/],
							as: 'font'
						})
					);
			},

			chainWebpack(chain, { isClient, isServer }) {
				if (isClient) {
					chain.plugin('css-minimizer-webpack-plugin').use(CssMinimizerPlugin, [
						{
							parallel: true,
							minimizerOptions: {
								preset: [
									'default',
									{
										mergeLonghand: true,
										cssDeclarationSorter: 'concentric',
										discardComments: { removeAll: true }
									}
								]
							}
						}
					]);

					chain.optimization.minimizer('terser').use(TerserPlugin, [
						{
							terserOptions: {
								parallel: true,
								sourceMap: true,
								extractComments: false,
								compress: {
									drop_console: true,
									drop_debugger: true,
									pure_funcs: ['console.log']
								},
								output: {
									comments: false,
									ascii_only: true
								}
							}
						}
					]);

					chain.optimization.splitChunks({
						chunks: 'all', // The type of chunk that requires code segmentation
						minSize: 20000, // Minimum split file size
						minRemainingSize: 0, // Minimum remaining file size after segmentation
						minChunks: 1, // The number of times it has been referenced before it is split
						maxAsyncRequests: 30, // Maximum number of asynchronous requests
						maxInitialRequests: 30, // Maximum number of initialization requests
						enforceSizeThreshold: 50000,
						cacheGroups: {
							// Cache Group configuration
							defaultVendors: {
								test: /[\\/]node_modules[\\/]/,
								priority: -10,
								reuseExistingChunk: true
							},
							default: {
								minChunks: 2,
								priority: -20,
								reuseExistingChunk: true //	Reuse the chunk that has been split
							}
						}
					});
				}
			}
		},

		devServer: {
			open: true, // opens browser window automatically,
			proxy: {
				'/bfl': {
					target: process.env.URL,
					changeOrigin: true,
					pathRewrite: {
						'^/bfl': 'bfl'
					}
				},
				'/api': {
					target: process.env.CERT_URL,
					changeOrigin: true,
					pathRewrite: {
						'^/api': 'api'
					}
				}
			}
		},

		framework: {
			config: {},
			plugins: ['Notify', 'Loading', 'Dialog', 'Cookies']
		},

		animations: ['fadeIn', 'fadeOut'],
		ssr: {
			pwa: false,
			prodPort: 3000,
			middlewares: [
				'render' // keep this as last one
			]
		},

		pwa: {
			workboxMode: 'generateSW', // or 'injectManifest'
			injectPwaMetaTags: true,
			swFilename: 'sw.js',
			manifestFilename: 'manifest.json',
			useCredentialsForManifestTag: false
		},

		cordova: {
			// noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
		},

		capacitor: {
			hideSplashscreen: true
		},

		electron: {
			inspectPort: 5858,

			bundler: 'packager', // 'packager' or 'builder'

			builder: {
				appId: 'launcher'
			}
		},
		bex: {
			contentScripts: ['my-content-script']
		}
	};
});
