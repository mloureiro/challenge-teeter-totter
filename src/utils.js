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
