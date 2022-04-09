<template>
	<div ref="scaleWrapper" class="scale__wrapper">
		<div ref="board" class="scale__board" :style="boardStyle"></div>
		<div class="scale__support"></div>
	</div>
</template>

<script setup>
import {
	computed,
	onMounted,
	onUnmounted,
	ref,
	watch,
	nextTick,
} from 'vue';
import { isBetween } from "../utils";

const emit = defineEmits(['scale']);

const props = defineProps({
	bending: {
		type: Number,
		required: true,
		validator: d => isBetween(d, [-100, 100]),
	},
});

const board = ref(null);
const maxRadAngle = ref(0);
const currentRadAngle = computed(() => props.bending * maxRadAngle.value / 100);
const boardStyle = computed(() => ({
	transform: `rotate(${currentRadAngle.value}rad)`,
}))

const updateMaxBoardAngle = () => {
	if (!board.value) {
		maxRadAngle.value = 0
		return;
	}

	const { top, height, width } = board.value.getBoundingClientRect();
	const { height: parentHeight } = board.value.parentElement.getBoundingClientRect();

	const heightFromGround = parentHeight - Math.round(top + (height / 2));
	maxRadAngle.value = Math.tan(heightFromGround / (width / 3));
};

const emitScaleChange = async () => {
	// TODO remove setTimeout
	// for some reason nextTick() doesn't affect DOM iteration
	// although I'm already late, so I'll figure this out later
	await nextTick();
	await new Promise(r => setTimeout(r, 100));

	const { top, right, bottom, left, height, width } = board.value.getBoundingClientRect();
	emit('scale', {
		height,
		width,
		start: [left, top],
		end: [right, bottom],
		angleRad: currentRadAngle.value,
	});
};

watch(currentRadAngle, emitScaleChange);
watch(maxRadAngle, emitScaleChange);

onMounted(() => {
	window.addEventListener('resize', updateMaxBoardAngle);
	updateMaxBoardAngle();
})
onUnmounted(() => window.removeEventListener('resize', updateMaxBoardAngle))
</script>

<style scoped lang="scss">
.scale {
	&__wrapper {
	--support-height: 5rem;
	--support-width: 2rem;
	--board-width: 90%;

		height: 100%;
		width: 100%;
		position: relative;
	}

	&__board {
		height: var(--space-s);
		width: var(--board-width);
		position: absolute;
		bottom: var(--support-height);
		left: calc(50% - var(--board-width) / 2);

		background-color: var(--color-rich-black);
		border-radius: var(--border-m);

		transition: 100ms ease-in-out;
	}

	&__support {
		width: 0;
		height: 0;
		position: absolute;
		bottom: 0;
		left: calc(50% - 2rem);

		border: solid transparent;
		border-bottom: solid var(--color-army-green);
		border-width: 0 var(--support-width) var(--support-height);
	}
}
</style>
