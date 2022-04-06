import { createStore } from 'vuex';

/**
 * Main type definitions
 *
 * @typedef {
     | 'initial'
     | 'playing'
     | 'paused'
     | 'left-won'
     | 'right-won'
   } GameStatus
 *
 * @typedef {'square' | 'triangle' | 'circle'} Shape
 * @typedef {[number, number]} Position
 * @typedef {'left' | 'right'} Player
 *
 * @typedef  {Object} Weight
 * @property {Shape} shape
 * @property {Position} position
 * @property {Player} owner
 *
 * @typedef  {Object} State
 * @property {GameStatus} status
 * @property {Weight | null} active
 * @property {Array.<Weight>} list
 */

/**
 * Define game rules and configuration
 * @type {Object.<string, number>}
 */
const GAME_CONFIGURATION = {
	height: 20,
	width: 10,
	minWeight: 1,
	maxWeight: 10,
	maxBending: 30,
}

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
 * Available actions
 *   Reason to use an enum-object for all the actions, is that we avoid
 *   using hardcoded strings throughout the application, making it easier
 *   to manage/refactor, but also avoiding possible typos.
 *
 * @typedef {
     | 'create-weight'
     | 'move-left'
     | 'move-right'
     | 'next'
     | 'pause'
     | 'play'
     | 'reset'
   } Actions
 * @type {Object.<string, Actions>}
 */
export const ACTIONS = {
	createWeight: 'create-weight',
	moveLeft: 'move-left',
	moveRight: 'move-right',
	next: 'next-iteration',
	play: 'play',
	pause: 'pause',
	reset: 'reset',
};

/**
 * @returns {State}
 */
const createInitialState = () => ({
	active: null,
	list: [],
	status: STATUS.initial,
});

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
	 * @type {Object.<Actions, function(State): State>} mutations
	 */
	mutations: {
		// @TODO
		[ACTIONS.createWeight]: state => state,
		// @TODO
		[ACTIONS.moveLeft]: state => state,
		// @TODO
		[ACTIONS.moveRight]: state => state,
		// @TODO
		[ACTIONS.next]: state => state,
		// @TODO
		[ACTIONS.pause]: state => state,
		// @TODO
		[ACTIONS.play]: state => state,
		// @TODO
		[ACTIONS.reset]: createInitialState,
	},
});
