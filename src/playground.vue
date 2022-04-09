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
		<div ref="board" class="playground__board" :style="styleVariables">
			<scale
				:bending="bending"
				@scale="scaleConfig = $event"
			/>
			<div
				v-for="(weight, index) in weightList"
				:key="index"
				:style="weight.style"
				class="playground__weight"
			>
				<weight
					:weight="weight.value"
					:shape="weight.shape"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import GameActions, { STATES as BOARD_ACTION } from './components/game-actions.vue';
import GameOverModal from './components/game-over-modal.vue';
import Scale from './components/scale.vue';
import Weight from './components/weight.vue';
import { GAME_CONFIGURATION, ACTIONS, STATUS as GAME_STATUS } from './store';
import { calculatePercentage } from './utils';

/**
 * @typedef {import('./store').State} State
 * @typedef {import('./store').Weight} Weight
 * @typedef {import('./store').Position} Position
 */

/**
 * @augments {Weight}
 * @typedef  {Object} PositionedWeight
 * @property {Object.<string, string>} style
 */

/**
 * @typedef {Object} ScaleConfig
 * @property {number} height
 * @property {number} width
 * @property {Position} start
 * @property {Position} end
 * @property {number} radAngle
 */

export default {
	components: {
		GameActions,
		GameOverModal,
		Scale,
		Weight,
	},
	data: () => ({
		/** @property {ScaleConfig | null} */
		scaleConfig: null,
		/** @property {number} */
		playgroundHeight: 0,
	}),
	computed: mapState({
		/**
		 * Parse/compute game weights into respective UI weights
		 * with the absolute position in the screen
		 * @param   {State} state
		 * @returns {Array.<PositionedWeight>}
		 */
		weightList(state) {
			const list = state.active
				? [...state.list, state.active]
				: state.list;
			return list.map(weight => {
				const [x] = weight.position;
				const isOnTheLeft = x < GAME_CONFIGURATION.width / 2;
				return {
					...weight,
					style: {
						'--x': weight.position[0] + (isOnTheLeft ? 0 : 1),
						'--y': weight.position[1],
					},
				};
			});
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
		styleVariables() {
			if (!this.scaleConfig) return;

			const { angleRad = 0, start = [0, 0], end = [0, 0] } = this.scaleConfig;
			const boardYStart = this.$refs.board?.getBoundingClientRect().y || 0;
			const [yEndLeft, yEndRight] = this.scaleConfig.angleRad > 0
				? [start[1], end[1]]
				: [end[1], start[1]];

			return {
				'--board-width-slots': GAME_CONFIGURATION.width + 1, // +1 for an empty mid
				'--board-height-slots': GAME_CONFIGURATION.height,
				'--board-top-left-x': start[0],
				'--board-top-left-y': boardYStart,
				'--board-top-right-x': end[0],
				'--board-top-right-y': boardYStart,
				'--board-bottom-left-x': start[0],
				'--board-bottom-left-y': yEndLeft,
				'--board-bottom-right-x': end[0],
				'--board-bottom-right-y': yEndRight,
				'--scale-angle-rad': angleRad,
			};
		},
	}),
	mounted() {
		window.addEventListener('keydown', this.onKeyPress);
		this.playgroundHeight = this.$refs.board?.getBoundingClientRect().height || null;
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
@function abs($v) {
	@return max(var($v), calc(var($v) * -1));
}

@function sign($v) {
	@return calc(var($v) / abs($v));
}

@function slotSize($slots, $min, $max) {
	@return calc((var($max) - var($min)) / var($slots));
}

@function yInLinearEquation($x, $x1, $y1, $x2, $y2) {
	@return calc(
		(var($y2) - var($y1)) / (var($x2) - var($x1)) * var($x)
		+ (var($x2) * var($y1) - var($x1) * var($y2)) / (var($x2) - var($x1))
	);
}

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

	&__board {
		--x: 0;
		--y: 0;
		--scale-angle-rad: 0;
		--board-width-slots: 0;
		--board-height-slots: 0;
		--board-top-left-x: 0;
		--board-top-left-y: 0;
		--board-top-right-x: 0;
		--board-top-right-y: 0;
		--board-bottom-left-x: 0;
		--board-bottom-left-y: 0;
		--board-bottom-right-x: 0;
		--board-bottom-right-y: 0;

		--board-width: calc(var(--board-top-right-x) - var(--board-top-left-x));

		height: 100%;
		width: 100%;
		position: relative;
	}

	&__weight {
		position: absolute;
		opacity: 0.9;
		transform: rotate(calc(var(--scale-angle-rad) * 1rad));

		--width-slot: calc(var(--board-width) / (var(--board-width-slots) + 2));
		--weight-x-px: calc(var(--x) * var(--width-slot) + var(--width-slot));
		left: calc(var(--weight-x-px) * 1px);

		--board-height-at-weight-x-px: #{yInLinearEquation(
			--weight-x-px,
			--board-bottom-left-x,
			--board-bottom-left-y,
			--board-bottom-right-x,
			--board-bottom-right-y,
		)};

		--board-height: calc(var(--board-height-at-weight-x-px) - var(--board-top-left-y));
		--height-slot: calc(var(--board-height) / var(--board-height-slots));
		--weight-y-px: calc(var(--y) * var(--height-slot) + var(--height-slot) - 14);
		top: calc(var(--weight-y-px) * 1px);
	}
}
</style>
