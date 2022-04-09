<template>
	<div class="playground__wrapper">
		<game-over-modal
			v-if="isGameOver"
			status="lost"
			@close="onReset"
		/>
		<game-actions
			:state="gameState"
			class="playground__actions"
			@action="onActionChange"
		/>
		<board
			v-slot="{ item }"
			:board-size="boardSize"
			:bending="bending"
			:item-list="weightList"
		>
			<weight
				:weight="item.value"
				:shape="item.shape"
			/>
		</board>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Board from './components/board.vue';
import GameActions, { STATES as BOARD_ACTION } from './components/game-actions.vue';
import GameOverModal from './components/game-over-modal.vue';
import Scale from './components/scale.vue';
import Weight from './components/weight.vue';
import { GAME_CONFIGURATION, ACTIONS, STATUS as GAME_STATUS } from './store';
import { calculatePercentage } from './utils';

export default {
	components: {
		Board,
		GameActions,
		GameOverModal,
		Scale,
		Weight,
	},
	computed: mapState({
		boardSize() {
			return [GAME_CONFIGURATION.width, GAME_CONFIGURATION.height];
		},
		weightList(state) {
			return state.active
				? [...state.list, state.active]
				: state.list;
		},
		bending(state, getters) {
			return Math.sign(getters.bending) * Math.min(
				calculatePercentage(Math.abs(getters.bending), 0, GAME_CONFIGURATION.maxBending),
				100,
			);
		},
		gameStatus(state) {
			return state.status;
		},
		gameState(state) {
			return ({
				[GAME_STATUS.initial]: BOARD_ACTION.stop,
				[GAME_STATUS.playing]: BOARD_ACTION.play,
				[GAME_STATUS.paused]: BOARD_ACTION.pause,
				[GAME_STATUS.playerWon]: BOARD_ACTION.stop,
				[GAME_STATUS.gameOver]: BOARD_ACTION.stop,
			})[state.status];
		},
		isGameOver(state) {
			return state.status === GAME_STATUS.gameOver;
		},
	}),
	mounted() {
		window.addEventListener('keydown', this.onKeyPress);
	},
	unmounted() {
		window.removeEventListener('keydown', this.onKeyPress);
	},
	methods: {
		...mapActions({
			onMoveDown: ACTIONS.next,
			onMoveLeft: ACTIONS.moveLeft,
			onMoveRight: ACTIONS.moveRight,
			onPause: ACTIONS.stop,
			onPlay: ACTIONS.play,
			onReset: ACTIONS.reset,
		}),
		onToggle() {
			const action = {
				[GAME_STATUS.initial]: this.onPlay,
				[GAME_STATUS.playing]: this.onPause,
				[GAME_STATUS.paused]: this.onPlay,
			}[this.gameStatus];

			action?.();
		},
		/**
		 * @param {Event} event
		 *
		 * TODO handle touch events for mobile
		 */
		onKeyPress(event) {
			const action = {
				ArrowDown: this.onMoveDown,
				ArrowRight: this.onMoveRight,
				ArrowLeft: this.onMoveLeft,
				Escape: this.onReset,
				' ': this.onToggle,
			}[event.key];

			if (action) {
				event.preventDefault();
				action();
			}
		},
		/**
		 * @param {'play' | 'pause' | 'stop' }action
		 */
		onActionChange(action) {
			const actionCallback = {
				[BOARD_ACTION.play]: this.onPlay,
				[BOARD_ACTION.pause]: this.onPause,
				[BOARD_ACTION.stop]: this.onReset,
			}[action];

			actionCallback?.();
		},
	},
};
</script>

<style scoped lang="scss">
.playground {
	&__wrapper {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		// TODO whitening in a scalable/themeable way
		background-color: #fffffff0;
		border-radius: var(--border-xl);
	}

	&__actions {
		padding: var(--space-m);
		background-color: #ffffff;
		border-radius: 0 0 var(--space-m) var(--space-m);
		box-shadow: var(--shadow-s) var(--color-shadow-light);
	}
}
</style>
