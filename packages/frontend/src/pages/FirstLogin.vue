<template>
	<div class="login-box">
		<q-card class="login-card">
			<q-card-section class="column q-py-xl">
				<div class="avator">
					<div :style="{ width: '124px', height: '124px' }">
						<img
							:src="tokenStore.avatar_url"
							style="width: 100%; height: 100%"
						/>
					</div>
				</div>
				<p class="login-name">{{ username }}</p>
				<p class="login-conter">
					{{ t('login_title') }}
				</p>
				<div class="item-margin" :class="passwordErr ? 'shake' : ''">
					<input
						class="text-white"
						:class="loading ? 'disable' : ''"
						type="password"
						id="password"
						v-model="pwd"
						ref="loginRef"
						:disabled="loading"
						@keydown="onkeydown"
					/>
					<label v-if="!pwd" class="placeholder-label">{{
						t('login_hint_password')
					}}</label>
					<q-icon
						v-if="pwd"
						class="cursor-pointer animated fadeIn"
						name="sym_r_arrow_circle_right"
						@click="onLogin"
						size="20px"
					/>
				</div>
				<div class="refush row items-center justify-center" v-if="loading">
					<q-img
						src="../assets/progress_activity.svg"
						spinner-color="white"
						style="width: 18px; height: 18px"
					/>
				</div>
			</q-card-section>
		</q-card>
	</div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTokenStore } from 'src/stores/token';
import { CurrentView } from 'src/constants/index';
import { BtNotify, NotifyDefinedType } from '@bytetrade/ui';

const { t } = useI18n();
const tokenStore = useTokenStore();
const pwd = ref();
const loginRef = ref();
const loading = ref(false);
const passwordErr = ref(false);
const username =
	tokenStore.user.terminusName &&
	tokenStore.user.terminusName.slice(
		0,
		tokenStore.user.terminusName.indexOf('@')
	);

const onLogin = async () => {
	loading.value = true;
	try {
		const firstfactor = await tokenStore.login(
			tokenStore.user.terminusName.split('@')[0],
			pwd.value
		);

		if (firstfactor.fa2) {
			// redirect('/secondFactorForm');
			tokenStore.currentView = CurrentView.MOBILEVERIFICATION;
		} else {
			if (firstfactor.redirect) {
				window.location.replace(firstfactor.redirect);
			} else {
				if (typeof window !== 'undefined') {
					window.location.replace(
						'https://desktop.' +
							tokenStore.user.terminusName.replace('@', '.') +
							'/'
					);
				}
			}
		}
	} catch (err) {
		console.log('eeee', err.response.data);
		BtNotify.show({
			type: NotifyDefinedType.MESSAGE,
			message: err.response.data.message
		});

		await shakeInput();
		await handleClearInput();
	} finally {
		loading.value = false;
	}
};

const handleClearInput = () => {
	loading.value = false;
	setTimeout(() => {
		loginRef.value.focus();
		loginRef.value.select();
	}, 1200);
};

const shakeInput = () => {
	passwordErr.value = true;
	setTimeout(() => {
		passwordErr.value = false;
	}, 1000);
};

const onkeydown = async (e: any) => {
	if (e.keyCode !== 13) return false;
	if (e.keyCode === 13 && !pwd.value) {
		await shakeInput();
		await handleClearInput();
	}

	onLogin();
};
</script>

<!-- <style lang="scss">
input[type='password'] {
	font-size: 28px !important;
	caret-color: #ffffff;
	letter-spacing: 1px;
	line-height: 16px;
	height: 16px;
}
input[type='password']::placeholder {
	font-size: 12px;
	line-height: 20px;
}
</style> -->
<style lang="scss" scoped>
input[type='password'] {
	font-size: 28px !important;
	caret-color: #ffffff;
	letter-spacing: 1px;
	line-height: 16px;
	height: 16px;
}
input[type='password']::placeholder {
	font-size: 12px;
	line-height: 20px;
}
.login-box {
	width: 100%;
	height: 100%;
	background-position: center;
	background-repeat: no-repeat;
	background-size: 100% 100%;
	position: fixed;
	top: 0px;
	left: 0;
	display: flex;
	align-items: center;

	.login-card {
		width: 500px;
		margin: 0 auto 20vh;
		background-color: transparent;
		box-shadow: none;
		.column {
			display: flex;
			justify-content: center;
			align-items: center;
			.avator {
				width: 124px;
				height: 124px;
				border-radius: 62px;
				overflow: hidden;
			}
			.login-name {
				font-size: 24px;
				font-family: Roboto-Bold, Roboto;
				font-weight: bold;
				color: #ffffff;
				margin-top: 16px;
				margin-bottom: 4px;
			}
			.login-conter {
				font-size: 14px;
				font-family: Roboto-Regular, Roboto;
				font-weight: 400;
				color: #ffffff;
			}
			.login-btn {
				margin-top: 48px;
			}
		}
	}
	.item-margin {
		margin: 5px;
		width: 220px;
		height: 32px !important;
		background: rgba(255, 255, 255, 0.4);
		border-radius: 8px;
		backdrop-filter: blur(20px);
		// font-size: 12px;
		padding-left: 12px;
		padding-right: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		position: relative;
		.cursor-pointer {
			color: #ffffff;
		}

		.placeholder-label {
			position: absolute;
			left: 14px;
			top: 50%;
			transform: translateY(-50%);
			color: rgba(255, 255, 255, 0.5);
			pointer-events: none;
		}

		input {
			width: 180px;
			background-color: transparent;
			border: none;
			padding: 0;
			margin: 0;
			&.disable {
				pointer-events: none;
			}
			&:focus {
				outline: none;
				box-shadow: none;
			}
		}
	}
}

:global(.text-white) {
	font-size: 16px;
	font-family: Roboto-Medium, Roboto;
	font-weight: 500;
	color: #242424;
}

:global(.q-btn--rectangle) {
	border-radius: 8px;
	width: 120px;
	height: 48px;
}
:global(.q-field--standard .q-field__control:before) {
	border: none;
}
:global(.q-field--standard .q-field__control:after) {
	height: 0px;
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
</style>
