<template>
	<div ref="scaleWrapper" class="scale __wrapper">
		<div ref="board" class="scale __board" :style="boardStyle"></div>
		<div class="scale __support"></div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { isBetween } from "../utils";

const props = defineProps({
	deviation: {
		type: Number,
		required: true,
		validator: d => isBetween(d, [-100, 100]),
	},
});

const board = ref(null);
const maxRadAngle = ref(0);
const currentRadAngle = computed(() => props.deviation * maxRadAngle.value / 100);
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
	maxRadAngle.value = Math.tan(heightFromGround / (width / 2));
};

onMounted(() => {
	window.addEventListener('resize', updateMaxBoardAngle);
	updateMaxBoardAngle();
})
onUnmounted(() => window.removeEventListener('resize', updateMaxBoardAngle))
</script>

<style scoped lang="scss">
.scale {
	--support-height: 5rem;
	--support-width: 2rem;
	--board-width: 90%;

	&.__wrapper {
		height: 100%;
		width: 100%;
		position: relative;
	}

	&.__board {
		height: var(--space-s);
		width: var(--board-width);
		position: absolute;
		bottom: var(--support-height);
		left: calc(50% - var(--board-width) / 2);

		background-color: var(--color-rich-black);
		border-radius: var(--border-m);

		transition: 100ms ease-in-out;
	}

	&.__support {
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
