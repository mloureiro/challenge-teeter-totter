import { isBetween, itemOrRandom, randomItem, range} from "./utils.js";

/**
 * Shape definitions
 *
 * @typedef {'circle' | 'triangle' | 'square'} ShapeType
 * @typedef {'xs' | 's' | 'm' | 'l' | 'xl'} ShapeSize
 *
 * @typedef  {Object} ShapeConfiguration
 * @property {[number, number]} weightRange
 * @property {Array.<ShapeSize>} types
 * @property {Array.<ShapeSize>} sizes
 * @property {Array.<number>} variants
 *
 * @readonly
 * @type ShapeConfiguration
 */
const SHAPE_CONFIGURATION = Object.freeze({
	weightRange: [1, 10],
	types: ['circle', 'triangle', 'square'],
	sizes: ['xs', 's', 'm', 'l', 'xl'],
	variants: range(1, 12),
});

const [,SHAPE_MAX_WEIGHT] = SHAPE_CONFIGURATION.weightRange;

/**
 * Checks if weight is within expected range
 * @param 	{number} weight
 * @returns {boolean}
 */
const isValidWeight = weight => isBetween(weight, SHAPE_CONFIGURATION.weightRange);

/**
 * Converts weight to a specific shape size
 * @param 	{number} weight
 * @returns {ShapeSize}
 */
const calculateSize = weight =>
	SHAPE_CONFIGURATION.sizes[
		Math.floor(weight * SHAPE_CONFIGURATION.sizes.length / SHAPE_MAX_WEIGHT) - 1
	];

/**
 * Generate a new shape
 *
 * @typedef  {Object} Shape
 * @property {HTMLElement} el
 * @property {number} weight
 *
 * @typedef  {Object} ShapeInjections
 * @property {() => HTMLElement} createElement
 *
 * @typedef  {Object} ShapeConstructor
 * @property {ShapeType} type
 * @property {number} [weight = 5]
 *
 * @param    {ShapeInjections}
 * @returns  {function(ShapeConstructor): Shape}
 */
export const factoryShape = ({ createElement }) => ({ type, weight }) => {
	const state = {
		weight: isValidWeight(weight) ? weight : 5,
	};

	const el = createElement();
	el.classList.add(
		'shape',
		`--${itemOrRandom(type, SHAPE_CONFIGURATION.types)}`,
		`--${calculateSize(state.weight)}`,
		`--var${randomItem(SHAPE_CONFIGURATION.variants)}`,
	);
	el.innerHTML = state.weight;

	return {
		get el() { return el },
		get weight() { return state.weight },
		set weight(val) {
			state.weight = val;
			el.classList.remove(...SHAPE_CONFIGURATION.sizes,);
			el.classList.add(`--${calculateSize(val)}`);
		},
	};
}
