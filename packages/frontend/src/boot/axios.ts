import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useTokenStore } from '../stores/token';
declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$axios: AxiosInstance;
	}
}

const api = axios.create({ baseURL: 'https://api.example.com' });

export default boot(({ app, router }) => {
	app.config.globalProperties.$axios = axios;
	app.config.globalProperties.$api = api;
	app.config.globalProperties.$axios.interceptors.request.use(
		(config: AxiosRequestConfig) => {
			const tokenStore = useTokenStore();
			config.headers['Access-Control-Allow-Origin'] = '*';
			config.headers['Access-Control-Allow-Headers'] =
				'X-Requested-With,Content-Type';
			config.headers['Access-Control-Allow-Methods'] =
				'PUT,POST,GET,DELETE,OPTIONS';

			if (tokenStore.token?.access_token) {
				config.headers['X-Authorization'] = tokenStore.token?.access_token;
				return config;
			} else {
				return config;
			}
		}
	);

	app.config.globalProperties.$axios.interceptors.response.use(
		(response: AxiosResponse) => {
			if (response && response.status == 401) {
				router.push({ path: '/login' });
				return;
			}

			if (!response || response.status != 200 || !response.data) {
				throw Error('Network error, please try again later');
			}

			const data = response.data;
			if (data.code == 100001) {
				router.push({ path: '/login' });
				throw Error(data.message);
			}

			if (data.status) {
				if (data.status === 'OK') {
					return data.data;
				}
				throw Error(data.status);
			} else {
				if (data.code != 0) {
					throw Error(data.message);
				}

				return data.data;
			}
		}
	);
});

export { api };
