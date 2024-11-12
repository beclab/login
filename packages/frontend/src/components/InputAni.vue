<template>
	<div class="item-margin" :class="passwordErr ? 'shake' : ''">
		<input
			class="text-white"
			:class="loading ? 'disable' : ''"
			type="password"
			id="password"
			v-model="password"
			ref="passwordInput"
			:disabled="loading"
			@keydown="onkeydown"
			@update:model-value="updateInput"
		/>
		<label v-if="!password" class="placeholder-label">{{
			t('login_hint_password')
		}}</label>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps({
	loading: {
		type: Boolean,
		required: false,
		default: false
	}
});

const emits = defineEmits(['updatePwd', 'onLogin']);
const { t } = useI18n();
const password = ref('');
const characters = ref<string[]>([]);
const passwordInput = ref<any>(null);

const passwordErr = ref(false);

const updateInput = () => {
	emits('updatePwd', password.value);
	characters.value = password.value.split('');
};

const shakeInput = () => {
	passwordErr.value = true;
	setTimeout(() => {
		passwordErr.value = false;
	}, 1000);
};

const onkeydown = async (e: any) => {
	if (e.keyCode !== 13) return false;
	if (e.keyCode === 13 && !password.value) {
		await shakeInput();
		await handleClearInput();
	}
	emits('onLogin');
};

const handleClearInput = () => {
	setTimeout(() => {
		passwordInput.value.focus();
		passwordInput.value.select();
	}, 1200);
};

defineExpose({
	shakeInput,
	handleClearInput
});
</script>
<style scoped lang="scss">
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
		width: 100%;
		height: 24px;
		line-height: 24px;
		background-color: transparent;
		border: none;
		padding: 0;
		margin: 0;
		font-size: 20px !important;
		caret-color: #ffffff;
		letter-spacing: 2px;
		&.disable {
			pointer-events: none;
		}
		&:focus {
			outline: none;
			box-shadow: none;
		}
	}
}
</style>
