<template>
	<router-view />
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { useTokenStore } from './stores/token';
import { CurrentView } from 'src/utils/constants';
import { supportLanguages } from './i18n';
import { i18n } from './boot/i18n';
import queryString from 'query-string';
import { useMobile, onMobileChange } from '@bytetrade/core';

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

		tokenStore.currentView = CurrentView.FIRST_FACTOR;
		tokenStore.setUrl(host);
		tokenStore.setUrlParams();

		return await tokenStore.loadData().then(async () => {
			const search = queryString.parse(window.location.search);
			const fa2 = search.fa2 ? decodeURIComponent(search.fa2) : 'false';
			if (fa2 === 'true') {
				redirect({ path: '/' });
			}
		});
	},
	setup() {
		const tokenStore = useTokenStore();
		const { state, cleanup } = useMobile();
		tokenStore.deviceInfo = state;

		onMobileChange((state) => {
			tokenStore.deviceInfo = state;
		});

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

		onUnmounted(() => {
			cleanup();
		});

		let terminusLanguage = '';
		let terminusLanguageInfo = document.querySelector(
			'meta[name="terminus-language"]'
		);
		if (terminusLanguageInfo && terminusLanguageInfo.content) {
			terminusLanguage = terminusLanguageInfo.content;
		} else {
			terminusLanguage = navigator.language;
		}

		console.log(navigator.language);

		if (terminusLanguage) {
			if (supportLanguages.find((e) => e.value == terminusLanguage)) {
				i18n.global.locale.value = terminusLanguage;
			}
		}
		return {};
	}
});
</script>
