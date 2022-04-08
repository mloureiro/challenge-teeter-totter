<template>
	<div class="actions-board__wrapper">
		<btn
			v-for="item in actions"
			:pressed="item.action === state"
			@click="$emit(item.action)"
		>
			<component :is="item.component" class="actions-board__icon" />
			{{ item.label }}
		</btn>
	</div>
</template>

<script>
import IconPlay from '../assets/icon-play.svg?component';
import IconPause from '../assets/icon-pause.svg?component';
import IconStop from '../assets/icon-stop.svg?component';
import Btn from './button.vue';

/**
 * @type {Object.<string, 'play' | 'pause' | 'stop'>}
 */
export const STATES = {
	play: 'play',
	pause: 'pause',
	stop: 'stop',
};

export default {
	components: { Btn },
	props: {
		state: {
			type: String,
			required: true,
			validator: s => Object.values(STATES).includes(s),
		},
	},
	created() {
		this.actions = [
				{ action: STATES.play, label: 'Play', component: IconPlay },
				{ action: STATES.pause, label: 'Pause', component: IconPause },
				{ action: STATES.stop, label: 'Stop', component: IconStop },
		];
	},
};
</script>

<style scoped lang="scss">
.actions-board {
	&__wrapper {
		display: flex;
		gap: var(--space-m);
	}

	&__icon {
		height: var(--size-s);
		width: var(--size-s);
		margin: 0 var(--space-s) 0 0;
		padding: 0;
	}
}
</style>
