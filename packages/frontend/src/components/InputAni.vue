<template>
	<div class="password-input">
		<q-input
			dense
			stack-label
			class="item-margin q_field_password"
			:class="passwordErr ? 'shake' : ''"
			v-model="password"
			type="password"
			ref="passwordInput"
			:inputStyle="{
				color: 'transparent',
				caretColor: 'rgba(0, 0, 0, 0)',
				fontSize: '1.8rem',
				textIndent: '2px'
			}"
			@focus="focus"
			@blur="blur"
			@keydown="onkeydown"
			@update:model-value="updateInput"
		>
		</q-input>
		<div class="password-display">
			<span v-for="(char, index) in characters" :key="index" class="animate">
			</span>
			<i class="caret" v-if="isFocus"></i>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
	loading: {
		type: Boolean,
		required: false,
		default: false
	}
});

const emits = defineEmits(['updatePwd', 'onLogin']);

const password = ref('');
const characters = ref<string[]>([]);
// const animatedIndices = ref<number[]>([]);
const passwordInput = ref<any>(null);

const passwordErr = ref(false);
const isFocus = ref(false);

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

const focus = () => {
	isFocus.value = true;
};

const blur = () => {
	isFocus.value = false;
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
.password-input {
	width: calc(100% - 60px);
	height: 50px !important;
	position: relative;
}

.password-display {
	position: absolute;
	top: 0px;
	left: 0;
	pointer-events: none;
	width: 100%;
	height: 100%;
	line-height: 50px;
	padding: 0 10px 0 16px;
	margin-top: 4px;
	overflow-x: scroll;
	white-space: nowrap;
	display: flex;
	align-items: center;
	justify-content: start;

	.caret {
		display: inline-block;
		width: 1px;
		height: 24px;
		border-radius: 1px;
		background-color: #ffffff;
		animation: caretAni 1s linear infinite;
	}
}

@keyframes caretAni {
	0% {
		opacity: 0;
	}

	50% {
		opacity: 1;
	}

	100% {
		opacity: 0;
	}
}

.password-display span {
	display: inline-block;
	width: 1.2rem;
	height: 1.2rem;
	border-radius: 6px;
	background-color: #ffffff;
	margin-right: 6px;
}

.password-display span.animate {
	animation-duration: 0.3s;
	animation-name: fontAni;
	animation-fill-mode: forwards;
	animation-direction: normal;
}

@keyframes fontAni {
	0% {
		width: 0px;
		height: 0px;
	}
	100% {
		width: 12px;
		height: 12px;
	}
}

.item-margin {
	margin-top: 4px;
	width: 100%;
	height: 100%;
	background: rgba(255, 255, 255, 0.4);
	border-radius: 8px;
	backdrop-filter: blur(20px);
	padding-left: 12px;
	padding-right: 10px;
	overflow: hidden;
}
</style>
