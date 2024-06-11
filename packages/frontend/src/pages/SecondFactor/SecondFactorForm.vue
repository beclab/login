<template>
	<div class="factor-box">
		<q-card class="factor-card colnum items-center justify-center">
			<OneTimePasswordMethod
				ref="onetimeRef"
				:passwordErr="passwordErr"
				:digits="infitotp.digits"
				:period="infitotp.period"
				@handleOnComplete="handleOnComplete"
			/>

			<div class="refush row items-center justify-center" v-if="loading">
				<q-img
					src="../../assets/progress_activity.svg"
					spinner-color="white"
					style="width: 18px; height: 18px"
				/>
			</div>
		</q-card>
	</div>
</template>
<script lang="ts">
import {
	defineComponent,
	ref,
	onUnmounted,
	nextTick,
	getCurrentInstance
} from 'vue';
import { Token } from '@bytetrade/core';
import { useTokenStore } from '../../stores/token';
import OneTimePasswordMethod from './OneTimePasswordMethod.vue';

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
		const oneTimePasswordMethod = ref();
		const passwordErr = ref(false);
		const { proxy } = getCurrentInstance();
		const loading = ref(false);

		const handleOnComplete = (value: any) => {
			oneTimePasswordMethod.value = value;
			onLogin();
		};

		const onLogin = async () => {
			loading.value = true;
			try {
				const data: Token = await tokenStore.cert_secondfactor_totp(
					oneTimePasswordMethod.value
				);

				if (data.redirect && data.access_token) {
					window.location.replace(data.redirect);
				} else {
					if (typeof window !== 'undefined') {
						window.location.replace(tokenStore.getDesktopURL());
					}
				}
			} catch (err) {
				passwordErr.value = true;
				handleClearInput();
				setTimeout(() => {
					passwordErr.value = false;
				}, 2000);
			} finally {
				loading.value = false;
			}
		};

		const handleClearInput = () => {
			nextTick(() => {
				oneTimePasswordMethod.value = null;
				proxy.$refs['onetimeRef'].clearInput();
			});
		};

		onUnmounted(() => {
			handleClearInput();
		});

		return {
			userinfo,
			infitotp,
			passwordErr,
			loading,
			onLogin,
			handleOnComplete,
			handleClearInput,
			tokenStore
		};
	}
});
</script>
<style lang="scss" scoped>
.factor-box {
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background-position: center;
	background-repeat: no-repeat;
	background-size: 100% 100%;

	.factor-card {
		width: 480px;
		padding: 20px;
		margin-bottom: 20vh;
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

		.refush {
			width: 32px;
			height: 32px;
			border-radius: 16px;
			background: rgba(31, 24, 20, 0.3);
			margin: 0 auto;
			animation: rotate 1s linear infinite;
			position: absolute;
			left: 0;
			right: 0;
			bottom: -10px;
			margin: auto;
			overflow: hidden;
		}

		@keyframes rotate {
			0% {
				transform: rotate(0deg);
			}
			100% {
				transform: rotate(360deg);
			}
		}
	}
}
</style>
