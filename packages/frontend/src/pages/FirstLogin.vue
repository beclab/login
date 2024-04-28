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
				<q-input
					dense
					:disable="loading"
					stack-label
					class="item-margin q_field_password"
					:class="passwordErr ? 'shake' : ''"
					v-model="pwd"
					@keydown="onkeydown"
					:placeholder="t('login_hint_password')"
					type="password"
					ref="loginRef"
					autofocus
				>
					<template v-slot:append>
						<q-img
							v-if="pwd"
							class="cursor-pointer animated fadeIn"
							src="../assets/arrow_circle_right.svg"
							spinner-color="white"
							style="width: 20px; height: 20px"
							@click="onLogin"
						/>
					</template>
				</q-input>
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

const { t } = useI18n();
const tokenStore = useTokenStore();
const pwd = ref('');
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
	}
	.q-field__marginal {
		height: 32px;
	}
}
</style>
<style lang="scss" scoped>
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
		font-size: 12px;
		padding-left: 12px;
		padding-right: 10px;
		.cursor-pointer {
			color: #ffffff;
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
