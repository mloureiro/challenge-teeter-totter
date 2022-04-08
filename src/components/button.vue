<template>
	<button
		:title="title"
		:class="{ '--pressed': pressed }"
		class="btn__button"
		role="button"
		@click="$emit('click')"
	>
		<slot>{{ label }}</slot>
	</button>
</template>

<script>
// TODO many things are missing, although not really needed for this challenge
export default {
	props: {
		label: { type: String, default: '' },
		title: { type: String, default: '' },
		pressed: { type: Boolean, default: false },
	},
};
</script>

<style scoped lang="scss">
.btn__button {
	cursor: pointer;
	display: inline-flex;
	flex-direction: row;
	align-items: center;
	padding: var(--space-xs) var(--space-l);
	color: var(--color-rich-black);
	background-color: var(--color-light);
	border: 0;
	border-radius: var(--space-m);
	text-align: center;
	box-shadow: var(--shadow-m) var(--color-shadow-light);

	&:hover ,
	&.--pressed {
		background-color: var(--color-primary);
		color: var(--color-light);
		fill: var(--color-light);
	}

	&.--pressed,
	&:active {
		box-shadow: inset var(--shadow-s) var(--color-shadow-dark);
	}
}
</style>
