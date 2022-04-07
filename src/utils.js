/**
 * Generate an array with requested range
 * @param  {number} min
 * @param  {number} max
 * @return {Array.<number>}
 */
export const range = (min, max) => Array(max - min).fill(0).map((_, i) => min + i);

/**
 * Get a random number between a-b
 * @param   {number} a
 * @param   {number | null} [b=null]
 * @returns {number}
 */
export const randomNumber = (a, b = null) => {
	if (b === null) {
		b = a;
		a = 0;
	}
	return Math.round(Math.random() * (b - a)) + a;
};


/**
 * Get a random element form the array
 * @template I
 * @param    {Array.<I>} list
 * @return   {I}
 */
export const randomItem = list => list[randomNumber(0, list.length - 1)];

/**
 * Check if number is within range
 * @param  {number} n
 * @param  {number} min
 * @param  {number} max
 * @return {boolean}
 */
export const isBetween = (n, [min, max]) => !Number.isNaN(n) && n >= min && n <= max;

/**
 * Calculate Y on linear equation, based on provided X
 * @param   {number} x
 * @param   {number} x1
 * @param   {number} y1
 * @param   {number} x2
 * @param   {number} y2
 * @returns {number}
 */
export const calculateYInLinearEquation = (x, [x1, y1], [x2, y2]) =>
	(y2 - y1) / (x2 - x1) * x + (x2 * y1 - x1 * y2) / (x2 - x1);
