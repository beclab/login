<template>
	<div class="factor-box">
		<q-img
			fit="fill"
			class="desktop-bg"
			:src="tokenStore.user.loginBackground"
		/>
		<q-card class="factor-card row items-center justify-center">
			<OneTimePasswordMethod
				ref="onetimeRef"
				:digits="infitotp.digits"
				:period="infitotp.period"
				@handleOnComplete="handleOnComplete"
			/>

			<div
				class="login-btn"
				:class="passwordErr ? 'errShock' : ''"
				@click="onLogin"
			>
				Submit
			</div>
		</q-card>
	</div>
</template>
<script lang="ts">
import {
	defineComponent,
	ref,
	onMounted,
	onUnmounted,
	nextTick,
	getCurrentInstance
} from 'vue';
import { Notify, Loading } from 'quasar';
import { useTokenStore } from '../../stores/token';
import OneTimePasswordMethod from './OneTimePasswordMethod.vue';
import { Token } from '@bytetrade/core';

export default defineComponent({
	components: {
		OneTimePasswordMethod
	},
	setup() {
		const tokenStore = useTokenStore();
		const userinfo = ref();
		const infitotp = ref({
			digits: 6,
			period: 30
		});
		const passwordErr = ref(false);
		const oneTimePasswordMethod = ref();
		const { proxy } = getCurrentInstance();

		const handleOnComplete = (value: any) => {
			oneTimePasswordMethod.value = value;
		};

		const onLogin = async () => {
			Loading.show();

			try {
				const data: Token = await tokenStore.cert_secondfactor_totp(
					oneTimePasswordMethod.value
				);
				if (data.redirect) {
					window.location.replace(data.redirect);
					handleClearInput();
				}
			} catch (err) {
				passwordErr.value = true;
				handleClearInput();
				setTimeout(() => {
					passwordErr.value = false;
				}, 2000);
				Notify.create({
					type: 'negative',
					message: (err as Error).message
				});
			} finally {
				Loading.hide();
			}
		};

		const handleClearInput = () => {
			nextTick(() => {
				oneTimePasswordMethod.value = null;
				proxy.$refs['onetimeRef'].clearInput();
			});
		};

		const keydownEnter = (event: any) => {
			if (event.keyCode !== 13) return false;
			if (
				!oneTimePasswordMethod.value ||
				(oneTimePasswordMethod.value && oneTimePasswordMethod.value.length < 6)
			) {
				return Notify.create({
					type: 'warning',
					message: 'Please enter the Verification Code.',
					timeout: 800
				});
			}
			onLogin();
		};

		onMounted(() => {
			window.addEventListener('keydown', keydownEnter);
		});

		onUnmounted(() => {
			window.removeEventListener('keydown', keydownEnter);
		});

		return {
			userinfo,
			infitotp,
			passwordErr,
			onLogin,
			handleOnComplete,
			handleClearInput,
			tokenStore
		};
	}
});
</script>
<style lang="scss">
.factor-box {
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background-position: center;
	background-repeat: no-repeat;
	background-size: 100% 100%;

	.desktop-bg {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}

	.factor-card {
		width: 480px;
		padding: 20px;
		box-shadow: none;
		background: none;

		.user-info {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.avator {
				border-radius: 40px;
			}
			span {
				line-height: 40px;
				font-weight: bolder;
				font-size: 18px;
			}
		}

		.logout {
			div {
				width: 100px;
				color: red;
				cursor: pointer;
				&:first-child {
					text-align: end;
					padding-right: 10px;
				}
				&:last-child {
					padding-left: 10px;
				}
			}
		}

		.login-btn {
			width: 120px;
			height: 48px;
			line-height: 48px;
			text-align: center;
			font-size: 16px;
			font-weight: 500;
			color: #242424;
			background: #ffffff;
			box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.2);
			opacity: 1;
			border-radius: 8px;
		}

		.errShock {
			animation-delay: 0s;
			animation-name: shock;
			animation-duration: 0.1s;
			animation-iteration-count: 3;
			animation-direction: normal;
			animation-timing-function: linear;
		}

		@keyframes shock {
			0% {
				margin-left: 0px;
				margin-right: 5px;
			}
			100% {
				margin-left: 5px;
				margin-right: 0px;
			}
		}
	}
}
</style>
