import { route } from 'quasar/wrappers';
import {
	createMemoryHistory,
	createRouter,
	createWebHashHistory,
	createWebHistory
} from 'vue-router';

import routes from './routes';
import { useTokenStore } from '../stores/token';

export default route(function () {
	const createHistory = process.env.SERVER
		? createMemoryHistory
		: process.env.VUE_ROUTER_MODE === 'history'
		? createWebHistory
		: createWebHashHistory;

	const Router = createRouter({
		scrollBehavior: () => ({ left: 0, top: 0 }),
		routes,
		history: createHistory(process.env.VUE_ROUTER_BASE)
	});

	Router.beforeEach(async (to, _from, next) => {
		const tokenStore = useTokenStore();

		if (to.matched.some((record) => record.meta.requiresAuth)) {
			if (tokenStore.token) {
				next();
			} else {
				next({
					path: '/login',
					query: { redirect: to.fullPath }
				});
			}
		} else if (to.matched.some((record) => record.meta.requiresNoAuth)) {
			next();
		} else {
			next();
		}
	});

	return Router;
});
