<template>
	<div ref="wrapper" class="playground__wrapper">
		<actions-board
			:state="gameState"
			class="playground__actions"
			@action="onActionChange"
		/>
		<div class="playground__board">
			<scale
				:bending="bending"
				@board="board = $event"
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
import ActionsBoard, { STATES } from './components/actions-board.vue';
import Scale from './components/scale.vue';
import Weight from './components/weight.vue';
import { calculateYInLinearEquation } from './utils';
import { GAME_CONFIGURATION, ACTIONS } from './store';

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
 * @typedef {Object} BoardConfig
 * @property {Position} start
 * @property {Position} end
 * @property {number} radAngle
 */

/**
 * Calculate weight board position equivalent in playground
 * @param   {Position} position
 * @param   {Object} config
 * @param   {number} config.totalWidthPositions
 * @param   {number} config.totalHeightPositions
 * @param   {Position} config.start
 * @param   {Position} config.end
 * @returns {Position}
 */
const calculatePositionWithinPlayground = (position, config) => {
	const { totalWidthPositions, totalHeightPositions, start, end } = config;

	// add +1 so that the middle of the board is empty
	const widthPositions = totalWidthPositions + 1;
	const slotWidth = Math.abs(start[0] - end[0]) / widthPositions;

	const [x, y] = position;
	// constructor side increment to avoid middle slot if position is on the right side
	const sideIncrement = x >= (totalWidthPositions / 2) ? 1 : 0
	const xWidth = (x + sideIncrement) * slotWidth;
	const boardHeightAtX = calculateYInLinearEquation(xWidth, start, end);
	const slotHeight = boardHeightAtX / totalHeightPositions;

	return [(slotWidth / 2) + xWidth, y * slotHeight];
};

export default {
	components: { ActionsBoard, Scale, Weight },
	data: () => ({
		/** @property {BoardConfig | null} */
		board: null,
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
			return state.list.map(weight => {
				const [x, y] = this.calculateWeightPosition(weight);
				return {
					...weight,
					style: {
						left: `calc(${x}px + ${this.board?.radAngle} * 4rem)`,
						top: `calc(${y}px + ${this.board?.radAngle} * 4rem)`,
						transform: `rotate(${this.board?.radAngle}rad)`
					},
				};
			});
		},
		bending(state, getters) {
			return getters.bending;
		},
		gameState(state) {
			return ({
				'initial': STATES.stop,
				'playing': STATES.play,
				'paused': STATES.pause,
				'left-won': STATES.stop,
				'right-won': STATES.stop,
			})[state.status];
		},
	}),
	mounted() {
		window.addEventListener('keydown', this.onKeyPress)
		this.playgroundHeight = this.$refs.wrapper?.getBoundingClientRect().height || null;
	},
	unmounted() {
		window.removeEventListener('keydown', this.onKeyPress)
	},
	methods: {
		...mapActions({
			onMoveLeft: ACTIONS.moveLeft,
			onMoveRight: ACTIONS.moveRight,
			onPause: ACTIONS.pause,
			onPlay: ACTIONS.play,
		}),
		/**
		 * @param {Event} event
		 *
		 * TODO handle touch events for mobile
		 */
		onKeyPress(event) {
			const action = {
				ArrowRight: this.onMoveRight,
				ArrowLeft: this.onMoveLeft,
			}[event.key];

			action?.();
		},
		/**
		 *
		 * @param action
		 */
		onActionChange(action) {

		},
		/**
		 * @param   {Weight} weight
		 * @returns {Position}
		 */
		calculateWeightPosition(weight) {
			if (!this.board) return [-9000, -9000];

			return calculatePositionWithinPlayground(
				weight.position,
				{
					// TODO define Vue component data properties properly (`this.board` type is not identified)
					...(/** @type BoardConfig */this.board),
					totalHeightPositions: GAME_CONFIGURATION.height,
					totalWidthPositions: GAME_CONFIGURATION.width,
					playgroundHeight: this.playgroundHeight,
				},
			);
		},
	},
};
</script>

<style scoped lang="scss">
.playground {
	&__wrapper {
		height: 100%;
		width: 100%;
		position: relative;
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
		height: 100%;
		width: 100%;
	}

	&__weight {
		position: absolute;
		opacity: 0.9;
	}
}
</style>
