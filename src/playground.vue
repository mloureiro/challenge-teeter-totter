<template>
	<div class="playground">
		<scale :deviation="deviation" />
	</div>
</template>

<script>
import Scale from './components/scale.vue';
import Shape from './components/shape.vue';

export default {
	components: { Scale, Shape },
	data: () => ({
		deviation: 50,
	}),
	mounted() {
		window.addEventListener('keydown', this.onKeyPress)
	},
	unmounted() {
		window.removeEventListener('keydown', this.onKeyPress)
	},
	methods: {
		onKeyPress(event) {
			const action = {
				ArrowRight: this.onMoveRight,
				ArrowLeft: this.onMoveLeft,
			}[event.key];

			action?.();
		},
		onMoveRight() {
			// TODO
		},
		onMoveLeft() {
			// TODO
		},
	},
};
</script>

<style scoped lang="scss">
.playground {
	height: 100vh;
	width: 100vw;
	padding: var(--space-s);
	display: flex;
	justify-content: center;
}
</style>
