import { createStore } from 'vuex';
import { randomItem, randomNumber } from './utils';

/**
 * Main type definitions
 */

/** @typedef {
     | 'initial'
     | 'playing'
     | 'paused'
     | 'left-won'
     | 'right-won'
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
	left: 'left',
	right: 'right',
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
	height: 20,
	width: 10,
	minWeight: 1,
	maxWeight: 10,
	maxBending: 30,
	tickTime: 800,
};

/**
 * Game status enum
 * @type {Object.<string, GameStatus>}
 */
const STATUS = {
	initial: 'initial',
	playing: 'playing',
	paused: 'paused',
	leftWon: 'left-won',
	rightWon: 'right-won',
};

/**
 * Available mutations
 *
 * @typedef {
     | 'create-weight'
     | 'move-active-weight'
     | 'reset'
   } Mutations
 * @type {Object.<string, Mutations>}
 */
export const MUTATIONS = {
	addWeight: 'add-weight',
	move: 'move-active-weight',
	reset: 'reset',
};

/**
 * Available actions
 *   Reason to use an enum-object for all the actions, is that we avoid
 *   using hardcoded strings throughout the application, making it easier
 *   to manage/refactor, but also avoiding possible typos.
 *
 * @typedef {
     | 'move-left'
     | 'move-right'
     | 'next-iteration'
     | 'pause'
     | 'play'
     | 'reset'
     | 'stop'
   } Actions
 * @type {Object.<string, Actions>}
 */
export const ACTIONS = {
	moveLeft: 'move-left',
	moveRight: 'move-right',
	next: 'next-iteration',
	play: 'play',
	pause: 'pause',
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
	let position = props.position || calculateBoardLimitsForPlayer(player)[0];

	/** @type Weight */
	const state = {
		shape: randomItem(Object.values(SHAPES)),
		value: randomNumber(
			GAME_CONFIGURATION.minWeight,
			GAME_CONFIGURATION.maxWeight,
		),
		...props,
		position,
		player,
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
			[1, 1],
			[
				Math.floor(GAME_CONFIGURATION.width / 2),
				GAME_CONFIGURATION.height,
			]
		]
		: [
			[
				Math.ceil(GAME_CONFIGURATION.width / 2),
				1,
			],
			[GAME_CONFIGURATION.width, GAME_CONFIGURATION.height]
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
 * @param   {State} state
 * @param   {'left' | 'right' | 'down'} direction
 * @returns {State}
 */
const moveActiveWeight = (state, direction) => {
	if (!state.active || !state.player) return state;

	const newPosition = movePosition(direction, state.active.position)
	const board = calculateBoardLimitsForPlayer(state.player);
	if (!isWithinBoard(newPosition, board)) return state;

	const clonedWeight = state.active.clone();
	clonedWeight.position = newPosition;
	return {
		...state,
		active: clonedWeight,
	};
};

let playerSubscription = null;

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
		 * @TODO
		 */
		bending(state) { return 0; },
	},
	/**
	 * @type {Object.<Mutations, function(State): void>} mutations
	 */
	mutations: {
		[MUTATIONS.reset]: state =>
			Object.entries(createInitialState())
				.forEach(([key, value]) => state[key] = value),
		[MUTATIONS.addWeight]: state => {
			state.player = !state.player || state.player === PLAYERS.left
				? PLAYERS.right
				: PLAYERS.left;
			const weight = createWeight(state.player);
			state.list = state.active
				? [...state.list, state.active]
				: state.list;
			state.active = weight;
		},
		[MUTATIONS.move]: (state, newPosition) => {
			if (state.active)
				state.active.position = newPosition;
		},
	},
	actions: {
		// TODO throttle to reduce the amount of actions per second user can do
		[ACTIONS.moveLeft]: ({ state, commit }) =>
			commit(MUTATIONS.move, moveActiveWeight(state, 'left')),
		[ACTIONS.moveRight]: ({ state, commit }) =>
			commit(MUTATIONS.move, moveActiveWeight(state, 'right')),
		[ACTIONS.reset]: async ({ commit, dispatch }) => {
			commit(MUTATIONS.reset);
			await dispatch(ACTIONS.stop);
		},
		[ACTIONS.stop]: () => {
			if (playerSubscription) {
				playerSubscription.off();
				playerSubscription = null;
			}
		},
		// TODO support incremental ticks
		[ACTIONS.play]: async ({ dispatch }) => {
			await dispatch(ACTIONS.stop);
			const intervalId = setInterval(() => dispatch(ACTIONS.next), GAME_CONFIGURATION.tickTime);
			playerSubscription = { off: () => clearInterval(intervalId) };
		},
		// @TODO
		[ACTIONS.next]: () => {
			console.log('tick')
		},
	},
});
