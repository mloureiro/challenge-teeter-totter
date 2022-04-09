import { createStore } from 'vuex';
import {
	calculateArrayDistribution,
	calculatePercentage,
	randomItem,
	randomNumber,
} from './utils';

/**
 * Main type definitions
 */

/** @typedef {
     | 'initial'
     | 'playing'
     | 'paused'
     | 'player-won'
     | 'player-lost'
   } GameStatus
 */

/** @typedef {'square' | 'triangle' | 'circle'} Shape */
/** @typedef {Array.<number, number>} Position */
/** @typedef {'left' | 'right'} Player */

/**
 * @typedef  {Object} Weight
 * @property {number} value
 * @property {Shape} shape
 * @property {Position} position
 * @property {Player} player
 * @property {function(): Weight} clone
 */

/**
 * @typedef  {Object} State
 * @property {GameStatus} status
 * @property {Player | null} player
 * @property {Weight | null} active
 * @property {Array.<Weight>} list
 */

/**
 *
 * @type {Object.<string, Player>}
 */
const PLAYERS = {
	human: 'left',
	machine: 'right',
};

/**
 * Available shapes
 * @type {Object.<string, Shape>}
 */
const SHAPES = {
	square: 'square',
	triangle: 'triangle',
	circle: 'circle',
};

/**
 * Define game rules and configuration
 * @type {Object.<string, number>}
 */
export const GAME_CONFIGURATION = {
	height: 20, // m
	width: 10,  // m
	minWeight: 1,  // kg
	maxWeight: 10, // kg
	weightDistributionArea: 2,   // m
	weightDifferencePerMeter: 10,// kg = 2 * 10 kgm
	maxBending: 30, // %
	tickTime: 800,
};

/**
 * Game status enum
 * @type {Object.<string, GameStatus>}
 */
export const STATUS = {
	initial: 'initial',
	playing: 'playing',
	paused: 'paused',
	playerWon: 'player-won',
	gameOver: 'player-lost',
};

/**
 * Available mutations
 *
 * @typedef {
     | 'add-active-weight-to-history'
     | 'create-weight'
     | 'move-active-weight'
     | 'play'
     | 'player-lost'
     | 'player-won'
     | 'pause'
     | 'reset'
   } Mutations
 * @type {Object.<string, Mutations>}
 */
export const MUTATIONS = {
	nextTurn: 'start-next-player-turn',
	move: 'move-active-weight',
	reset: 'reset',
	play: 'play',
	playerLost: 'player-lost',
	playerWon: 'player-won',
	pause: 'pause',
};

/**
 * Available actions
 *   Reason to use an enum-object for all the actions, is that we avoid
 *   using hardcoded strings throughout the application, making it easier
 *   to manage/refactor, but also avoiding possible typos.
 *
 * @typedef {
     | 'move-down'
     | 'move-left'
     | 'move-right'
     | 'next-iteration'
     | 'play'
     | 'reset'
     | 'stop'
   } Actions
 * @type {Object.<string, Actions>}
 */
export const ACTIONS = {
	moveDown: 'move-down',
	moveLeft: 'move-left',
	moveRight: 'move-right',
	next: 'next-iteration',
	play: 'play',
	reset: 'reset',
	stop: 'stop',
};

/** @returns {State} */
const createInitialState = () => ({
	active: null,
	player: null,
	list: [],
	status: STATUS.initial,
});

/**
 * Create a weight
 * @param   {Player} player
 * @param   {Weight} props
 * @returns {Weight}
 *
 * TODO extract player and board logic outside of weight creation
 */
const createWeight = (player, props = {}) => {
	const [[xStart, yStart], [xEnd]] = calculateBoardLimitsForPlayer(player);

	/** @type Weight */
	const state = {
		shape: randomItem(Object.values(SHAPES)),
		value: randomNumber(
			GAME_CONFIGURATION.minWeight,
			GAME_CONFIGURATION.maxWeight,
		),
		position: [randomNumber(xStart, xEnd), yStart],
		player,
		...props,
	};

	if (state.player === 'b') throw Error();

	return {
		get value() { return state.value; },
		get player() { return state.player; },
		get position() { return [...state.position]; },
		set position([x, y]) { state.position = [x, y]; },
		get shape() { return state.shape; },
		clone() { return createWeight(state.player, state); }
	};
};

/**
 * Check if position is within board limits
 * @param   {Position} position
 * @param   {Position} start - board start [xMin, yMin] inclusive
 * @param   {Position} end   - board end [xMax, yMax] inclusive
 * @returns {boolean}
 */
const isWithinBoard = (position, [start, end]) =>
	position.every((_, i) =>
		position[i] >= start[i] && position[i] <= end[i]);

/**
 * Calculate board for player
 * Note that it starts from 0 instead of 1, so the max must be 1 less to
 * @param   {Player} player
 * @returns {Array.<Position, Position>}
 */
const calculateBoardLimitsForPlayer = player =>
	player === 'left'
		? [
			[0, 0],
			[
				Math.floor(GAME_CONFIGURATION.width / 2) - 1,
				GAME_CONFIGURATION.height - 1 ,
			]
		]
		: [
			[
				Math.ceil(GAME_CONFIGURATION.width / 2),
				1,
			],
			[GAME_CONFIGURATION.width -1, GAME_CONFIGURATION.height - 1]
		];

/**
 * Move to new position based on the direction
 * @param   {'up' | 'down' | 'left' | 'right'} direction
 * @param   {Position} position
 * @returns {Position}
 */
const movePosition = (direction, position) =>
	({
		up: [0, -1],
		down: [0, 1],
		left: [-1, 0],
		right: [1, 0],
	})[direction]
		.map((move, i) => position[i] + move);

/**
 * (Try to) Move active weight in the defined direction
 * @param   {Position} currentPosition
 * @param   {Player} player
 * @param   {'left' | 'right' | 'down'} direction
 * @returns {Position}
 */
const calculateNewPosition = (currentPosition, player, direction) => {
	const newPosition = movePosition(direction, currentPosition)
	const board = calculateBoardLimitsForPlayer(player);
	return isWithinBoard(newPosition, board)
		? newPosition
		: currentPosition;
};

/**
 * Centralize the interval logic to ease the usage
 *
 * @typedef  {Object} Ticker
 * @property {interval} number
 * @property {function(): void} callback
 * @property {function(): void} start
 * @property {function(): void} stop
 *
 * @returns {Ticker}
 */
const createTicker = ({ interval = 200, callback = () => null }) => {
	const state = {
		subscriptionId: null,
		interval,
		callback: callback,
	};

	const start = () =>
		state.subscriptionId = setInterval(state.callback, state.interval);
	const stop = () =>
		state.subscriptionId && clearInterval(state.subscriptionId);

	return Object.freeze({ start, stop });
};

let ticker = null;

/**
 * Guard to ensure action is only executed if it's time
 * for the end user to play
 * @param {State} state
 * @param {function(): void} callback
 */
const onlyOnHumanTime = (state, callback) => {
	if (state.player === PLAYERS.human && state.active)
		callback();
}

export const store = createStore({
	/**
	 * @returns {State}
	 */
	state() {
		return createInitialState();
	},
	getters: {
		/**
		 * Calculate board bending
		 * @param   {State} state
		 * @returns {number}
		 *
		 * TODO check the correct way to calculate the bending
		 * The way I've implemented
		 * - bending is a percentual number from -100% to 100%
		 * - the weights further from the center has an higher effect (bend more)
		 * - to calculate the difference for each area, I'm using the weight
		 *   distribution requirement (10kg * 2m)
		 */
		bending(state) {
			const weights = Array(GAME_CONFIGURATION.width).fill(0);
			state.list
				.filter(w => w.position[1] === GAME_CONFIGURATION.height - 1)
				.forEach(w => weights[w.position[0]] += w.value);

			const rightWeights = weights.splice(GAME_CONFIGURATION.width / 2);
			const leftWeights = weights;

			const leftDistribution = calculateArrayDistribution(
				leftWeights.reverse(), // reversing so that it counts from center (like the right side)
				GAME_CONFIGURATION.weightDistributionArea
			);

			const rightDistribution = calculateArrayDistribution(
				rightWeights,
				GAME_CONFIGURATION.weightDistributionArea
			);

			const totalAreas = leftDistribution.length;
			const impactVariationPerArea = 0.50 / totalAreas;
			let bending = 0;
			for (let i = 0; i < totalAreas; i++) {
				const impactMultiplier = 0.5 + (i + 1) * impactVariationPerArea;
				bending += (rightDistribution[i] - leftDistribution[i]) * impactMultiplier;
			}

			return Math.sign(bending) * calculatePercentage(Math.abs(bending), 0, GAME_CONFIGURATION.maxBending);
		},
	},
	/**
	 * @type {Object.<Mutations, function(State): void>} mutations
	 */
	mutations: {
		[MUTATIONS.nextTurn]: state => {
			state.player = !state.player || state.player === PLAYERS.human
				? PLAYERS.machine
				: PLAYERS.human;
			state.active = createWeight(state.player);
			state.list = [...state.list, state.active];
		},
		[MUTATIONS.move]: (state, newPosition) => {
			if (state.active)
				state.active.position = newPosition;
		},
		[MUTATIONS.play]: state => state.status = STATUS.playing,
		[MUTATIONS.playerLost]: state => state.status = STATUS.gameOver,
		[MUTATIONS.playerWon]: state => state.status = STATUS.playerWon,
		[MUTATIONS.pause]: state => state.status = STATUS.paused,
		[MUTATIONS.reset]: state =>
			Object.entries(createInitialState())
				.forEach(([key, value]) => state[key] = value),
	},
	actions: {
		// TODO throttle to reduce the amount of actions per second user can do
		[ACTIONS.moveDown]: ({ state, commit }) =>
			onlyOnHumanTime(state,
				() => commit(MUTATIONS.move, calculateNewPosition(state.active.position, state.player, 'down'))),
		[ACTIONS.moveLeft]: ({ state, commit }) =>
			onlyOnHumanTime(state,
				() => commit(MUTATIONS.move, calculateNewPosition(state.active.position, state.player, 'left'))),
		[ACTIONS.moveRight]: ({ state, commit }) =>
			onlyOnHumanTime(state,
				() => commit(MUTATIONS.move, calculateNewPosition(state.active.position, state.player, 'right'))),
		[ACTIONS.reset]: async ({ commit, dispatch }) => {
			if (!ticker) {
				ticker = createTicker({
					callback: () => dispatch(ACTIONS.next),
					interval: GAME_CONFIGURATION.tickTime,
				});
			}
			ticker.stop();
			commit(MUTATIONS.reset);
		},
		[ACTIONS.stop]: async ({ state, commit }) => {
			if (![STATUS.playing, STATUS.paused].includes(state.status))
				return;

			ticker.stop();
			commit(MUTATIONS.pause);
		},
		// TODO support incremental ticks
		[ACTIONS.play]: async ({ state, commit, dispatch }) => {
			if (![STATUS.initial, STATUS.paused].includes(state.status))
				return;
			if (!ticker)
				await dispatch(ACTIONS.reset);
			ticker.start();
			commit(MUTATIONS.play);
		},
		[ACTIONS.next]: async ({ state, commit }) => {
			if (state.status !== STATUS.playing)
				return;

			if (!state.active)
				return commit(MUTATIONS.nextTurn);

			commit(
				MUTATIONS.move,
				calculateNewPosition(state.active.position, state.player, 'down'),
			);

			const hasActiveReachedBottom = state.active.position[1] >= GAME_CONFIGURATION.height - 1;
			if (!hasActiveReachedBottom) return;

			const hasGameFinished = state.bending > GAME_CONFIGURATION.maxBending;
			if (!hasGameFinished)
				return commit(MUTATIONS.nextTurn);

			ticker.stop();
			commit(state.player === PLAYERS.human ? MUTATIONS.playerWon : MUTATIONS.playerLost)
		},
	},
});
