<template>
	<div class="bg-container">
		<img fit="fill" class="desktop-bg" :src="tokenStore.user.loginBackground" />
	</div>
	<transition appear leave-active-class="animated fadeOut">
		<component :is="currentComponent"></component>
	</transition>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useTokenStore } from './../stores/token';
import { CurrentView } from './../utils/constants';
import SecondFactor from './SecondFactor/SecondFactorForm.vue';
import FirstFactor from './FirstFactor.vue';
import MobileVerification from './MobileVerification.vue';

const tokenStore = useTokenStore();

const currentComponent = computed(() => {
	switch (tokenStore.currentView) {
		case CurrentView.FIRST_FACTOR:
			return FirstFactor;

		case CurrentView.SECOND_FACTOR:
			return SecondFactor;

		case CurrentView.MOBILE_VERIFICATION:
			return MobileVerification;

		default:
			return FirstFactor;
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
