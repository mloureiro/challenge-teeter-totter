<template>
	<div class="alert__wrapper">
		<div class="alert__content">
			<header class="alert__title">
				{{ title }}
			</header>
			<main class="alert__action-bar">
				<btn
					:label="label"
					role="button"
					@click="$emit('close')"
				/>
			</main>
		</div>
	</div>
</template>

<script>
import Btn from './button.vue';
export default {
	components: { Btn },
	props: {
		title: { type: String, required: true },
		label: { type: String, default: 'Ok' },
	},
};
</script>

<style scoped lang="scss">
.alert {
	&__wrapper {
		position: fixed;
		left: 0;
		top: 0;
		height: 100vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #00000080;
		z-index: 400;
	}

	&__content {
		padding: var(--space-l);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		background-color: var(--color-light);
		box-shadow: var(--shadow-m);
		border-radius: var(--border-xl);

		min-width: 20rem;
		min-height: 10rem;
	}

	&__title {
		font-family: var(--font-family-cursive);
		font-size: var(--size-xl);
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	&__action-bar {
		margin-top: var(--space-m);
		display: flex;
		justify-content: center;
	}
}
</style>
