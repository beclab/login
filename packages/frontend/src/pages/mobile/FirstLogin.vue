<template>
	<div class="login-box">
		<q-card class="login-card">
			<q-card-section class="column">
				<div class="avator">
					<img :src="tokenStore.avatar_url" style="width: 100%; height: 100%" />
				</div>
				<p class="login-name">{{ username }}</p>
				<p class="login-conter">
					{{ t('login_title') }}
				</p>

				<InputAni
					ref="InputAniRef"
					:loading="loading"
					@onLogin="onLogin"
					@updatePwd="updatePwd"
				/>

				<div
					class="login row items-center justify-center"
					v-if="!loading && pwd"
					@click="onLogin"
				>
					<q-img
						src="../../assets/mobile/login-icon.svg"
						style="width: 18px; height: 18px"
					/>
				</div>

				<div class="refush row items-center justify-center" v-if="loading">
					<q-img
						src="../../assets/mobile/login-loading.svg"
						spinner-color="white"
						style="width: 26px; height: 26px"
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
import InputAni from './../../components/InputAni.vue';

const { t } = useI18n();
const tokenStore = useTokenStore();
const pwd = ref('');
const loading = ref(false);
const InputAniRef = ref();
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

		console.log('firstfactor', firstfactor);

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
		await InputAniRef.value.shakeInput();
		await InputAniRef.value.handleClearInput();
	} finally {
		loading.value = false;
	}
};

const updatePwd = (value) => {
	pwd.value = value;
};
</script>

<style lang="scss">
.q_field_password {
	.q-field__native {
		font-size: 14px;
		font-family: Roboto-Medium, Roboto;
		font-weight: 500;
		color: #ffffff;
	}
	.q-field__control {
		height: 100% !important;
		padding-left: 24px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.q-field__marginal {
		height: 32px;
	}
}
</style>
<style lang="scss" scoped>
.login-box {
	width: 100%;
	height: 100vh;
	background-position: center;
	background-repeat: no-repeat;
	background-size: 100% 100%;
	position: fixed;
	top: 0px;
	left: 0;
	display: flex;
	align-items: center;
	overflow: hidden;

	.login-card {
		width: 500px;
		margin: 0 auto;
		background-color: transparent;
		box-shadow: none;
		padding-bottom: 56px;
		.column {
			display: flex;
			justify-content: center;
			align-items: center;
			.avator {
				width: 100px;
				height: 100px;
				border-radius: 62px;
				overflow: hidden;
			}
			.login-name {
				font-size: 24px;
				font-family: Roboto-Bold, Roboto;
				font-weight: bold;
				color: #ffffff;
				margin-top: 30px;
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
}
:global(.q-field__control) {
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

.login {
	width: 56px;
	height: 56px;
	border-radius: 28px;
	background: rgba(255, 255, 255, 0.98);
	position: absolute;
	left: 0;
	right: 0;
	bottom: -70px;
	margin: auto;
	overflow: hidden;
}

.refush {
	width: 56px;
	height: 56px;
	border-radius: 28px;
	background: rgba(31, 24, 20, 0.3);
	animation: rotate 1s linear infinite;
	position: absolute;
	left: 0;
	right: 0;
	bottom: -70px;
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
