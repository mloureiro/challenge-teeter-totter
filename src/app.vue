<template>
	<div class="app">
		<!-- TODO remove test -->
		<div class="app __row" v-for="type in ['square', 'circle', 'triangle']">
			<shape v-for="i in 10" :type="type" :weight="i" />
		</div>
	</div>
</template>

<script>
import Shape from './components/shape.vue';

export default {
	components: { Shape },
};
</script>

<style scoped lang="scss">
.app {
	display: flex;
	justify-content: center;

	&.__row {
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
		gap: var(--space-s);
	}
}
</style>
