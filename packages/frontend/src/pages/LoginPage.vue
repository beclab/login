<template>
	<img fit="fill" class="desktop-bg" :src="tokenStore.user.loginBackground" />
	<transition appear leave-active-class="animated fadeOut">
		<component :is="tokenStore.currentView"></component>
	</transition>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useTokenStore } from '/src/stores/token';
import SecondFactorForm from './SecondFactor/SecondFactorForm.vue';
import FirstLogin from './FirstLogin.vue';
import MobileVerification from './MobileVerification.vue';

export default defineComponent({
	components: {
		SecondFactorForm,
		FirstLogin,
		MobileVerification
	},
	setup() {
		const tokenStore = useTokenStore();

		return {
			tokenStore
		};
	}
});
</script>

<style lang="scss" scoped>
.desktop-bg {
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: -1;
}
</style>
