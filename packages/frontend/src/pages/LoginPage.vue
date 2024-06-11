<template>
	<div class="bg-container">
		<img fit="fill" class="desktop-bg" :src="tokenStore.user.loginBackground" />
	</div>

	<transition appear leave-active-class="animated fadeOut">
		<component :is="currentComponent"></component>
	</transition>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useTokenStore } from './../stores/token';
import SecondFactorForm from './SecondFactor/SecondFactorForm.vue';
import FirstLogin from './FirstLogin.vue';
import MobileVerification from './MobileVerification.vue';
import FirstLoginMobile from './mobile/FirstLogin.vue';
import MobileVerificationMobile from './mobile/MobileVerification.vue';
import SecondFactorFormMobile from './SecondFactor/SecondFactorFormMobile.vue';

import { isMobile } from './../utils/platform';

export default defineComponent({
	components: {
		SecondFactorForm,
		FirstLogin,
		MobileVerification,
		FirstLoginMobile,
		MobileVerificationMobile,
		SecondFactorFormMobile
	},
	setup() {
		const tokenStore = useTokenStore();

		const currentComponent = computed(() => {
			if (isMobile.value) {
				return `${tokenStore.currentView}Mobile`;
			}

			return tokenStore.currentView;
		});

		return {
			tokenStore,
			currentComponent
		};
	}
});
</script>

<style lang="scss" scoped>
.bg-container {
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: -1;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
}

.bg-container .desktop-bg {
	width: auto;
	min-width: 100%;
	height: 100%;
	object-fit: cover;
}
</style>
