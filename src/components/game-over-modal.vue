<template>
	<alert
		v-if="status"
		:label="label"
		:title="message"
		@click="$emit('click')"
	/>
</template>

<script>
import Alert from './alert.vue';

/**
 * @type {Object.<string, 'won' | 'lost'>}
 */
export const STATUS = {
	won: 'won',
	lost: 'lost',
};

export default {
	components: { Alert },
	props: {
		status: {
			type: String,
			default: null,
			validator: s => !s || ['won', 'lost'].includes(s),
		},
	},
	computed: {
		label() {
			return this.status === STATUS.won
				? 'Restart'
				: 'Try again';
		},
		message() {
			return this.status === STATUS.won
				? 'Congratulations, you won! 🎉'
				: 'Oops! You lost 😅';
		},
	},
};
</script>
