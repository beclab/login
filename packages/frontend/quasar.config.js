const { configure } = require('quasar/wrappers');
const path = require('path');

module.exports = configure(function (/* ctx */) {
	return {
		eslint: {
			warnings: true,
			errors: true
		},

		preFetch: true,
		boot: ['i18n', 'axios', 'smartEnginEntrance'],
		css: ['app.scss', 'fonts.scss'],
		extras: [
			'roboto-font',
			'material-icons',
			'bootstrap-icons',
			'themify',
			'material-icons',
			'material-symbols-outlined',
			'material-symbols-rounded'
		],

		build: {
			target: {
				browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
				node: 'node16'
			},

			env: {
				URL: process.env.URL,
				CERT_URL: process.env.CERT_URL
			},

			vueRouterMode: 'history',

			vitePlugins: [
				[
					'@intlify/vite-plugin-vue-i18n',
					{
						include: path.resolve(__dirname, './src/i18n/**')
					}
				]
			]
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
