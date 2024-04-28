import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		children: [
			{
				path: '/',
				component: () => import('pages/LoginPage.vue'),
				meta: { requiresNoAuth: true }
			}
		]
	},
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue')
	}
];

export default routes;
