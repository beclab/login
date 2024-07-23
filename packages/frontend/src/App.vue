<template>
	<router-view />
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import { useTokenStore } from './stores/token';
import { CurrentView } from 'src/constants/index';

import queryString from 'query-string';

export default defineComponent({
	name: 'App',
	async preFetch({ redirect }) {
		if (document.getElementById('Loading'))
			document.getElementById('Loading')?.remove();

		const tokenStore = useTokenStore();
		let host = '';
		if (typeof window !== 'undefined') {
			host = window.location.origin;
		}

		tokenStore.currentView = CurrentView.FIRSTLOGIN;
		tokenStore.setUrl(host);
		tokenStore.setUrlParams();

		return await tokenStore.loadData().then(async () => {
			const search = queryString.parse(window.location.search);
			const fa2 = search.fa2 ? decodeURIComponent(search.fa2) : 'false';
			if (fa2 === 'true') {
				redirect({ path: '/' });
			}
			//
		});
	},
	setup() {
		const tokenStore = useTokenStore();

		onMounted(async () => {
			const host = window.location.origin;
			if (host.indexOf('auth.local.') <= -1) {
				const authIndex = host.indexOf('auth.');
				const pingLocalUrl =
					host.slice(0, authIndex + 5) + 'local.' + host.slice(authIndex + 5);
				const data = await tokenStore.pingLoadData(pingLocalUrl);
				if (data) {
					const href = window.location.href;
					const currentUrl =
						href.slice(0, authIndex + 5) + 'local.' + href.slice(authIndex + 5);
					window.location.replace(currentUrl);
				}
			}
		});

		return {};
	}
});
</script>
