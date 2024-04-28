<template>
	<div class="security column items-center justify-center">
		<div class="column items-center justify-center">
			<div class="iconContainer q-mb-md">
				<q-circular-progress
					:value="progressPeriod"
					size="100px"
					:thickness="1"
					color="white"
					class="q-ma-md"
					style="margin: 10px"
				/>
			</div>

			<div class="text-white secend-title">{{ t('totp_title') }}</div>
			<div class="text-white secend-desc q-mb-md">
				{{ t('totp_message') }}
			</div>

			<OtpInput
				:class="passwordErr ? 'shake' : ''"
				ref="otpInputRef"
				input-classes="otp-input"
				separator=""
				:num-inputs="6"
				:should-auto-focus="true"
				:is-input-num="true"
				:conditionalClass="['one', 'two', 'three', 'four', 'five', 'six']"
				@on-change="handleOnChange"
				@on-complete="handleOnComplete"
			/>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { ref, onMounted, defineExpose } from 'vue';
import OtpInput from 'vue3-otp-input';
import { useI18n } from 'vue-i18n';

const props = defineProps({
	digits: {
		type: Number,
		required: false,
		default: 6
	},
	period: {
		type: Number,
		required: false,
		default: 30
	},
	passwordErr: {
		type: Boolean,
		required: false,
		default: false
	}
});

const emits = defineEmits(['handleOnComplete']);

const { t } = useI18n();
const otpInputRef = ref();
const currentPeriod = ref(0);
const progressPeriod = ref(0);
const currentSecond = ref(0);

const handleOnChange = () => {
	console.log('handleOnChange');
};

const handleOnComplete = (value: any) => {
	emits('handleOnComplete', value);
};

const clearInput = () => {
	otpInputRef.value.clearInput();
};

const initSecond = () => {
	currentSecond.value = new Date().getSeconds();
	currentPeriod.value =
		currentSecond.value > 30
			? Math.round(currentSecond.value / 2)
			: currentSecond.value;
};

onMounted(() => {
	initSecond();

	window.setInterval(() => {
		currentPeriod.value = currentPeriod.value + 1;
		if (currentPeriod.value >= props.period) {
			currentPeriod.value = 0;
		}
		progressPeriod.value = (currentPeriod.value * 100) / props.period;
	}, 1000);
});

defineExpose({
	clearInput,
	currentPeriod
});
</script>
<style lang="scss">
.security {
	margin-top: 20px;
	padding: 20px 0 32px;
	border-radius: 14px;
	.information-icon {
		border-radius: 60px;
		margin: 20px 0;
	}
}

.iconContainer {
	width: 100px;
	height: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50px;
	border: 5px solid #ffffff;
	box-sizing: border-box;
	opacity: 0.5;
}

.secend-title {
	font-weight: 600;
	font-size: 24px;
}
.secend-desc {
	font-size: 14px;
}

.otp-input {
	width: 32px;
	height: 40px;
	line-height: 40px;
	margin: 0 4px;
	font-size: 23px;
	font-weight: 600;
	text-align: center;
	border: none;
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.4);
	opacity: 1;
	color: #ffffff;

	&:focus-visible {
		border: none !important;
		padding: 0 !important;
		outline-style: none;
		outline-color: rgba(255, 255, 255, 0.4);
	}
}

.otp-input.is-complete {
	background: rgba(255, 255, 255, 0.3);
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
	-webkit-appearance: none;
	margin: 0;
}
</style>
