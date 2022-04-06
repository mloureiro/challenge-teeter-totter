/**
 * Generate an array with requested range
 * @param  {number} min
 * @param  {number} max
 * @return {Array.<number>}
 */
export const range = (min, max) => Array(max - min).fill(0).map((_, i) => min + i);

/**
 * Get a random element form the array
 * @template I
 * @param    {Array.<I>} list
 * @return   {I}
 */
export const randomItem = list => list[Math.floor(Math.random() * list.length)];

/**
 * Check if number is within range
 * @param  {number} n
 * @param  {number} min
 * @param  {number} max
 * @return {boolean}
 */
export const isBetween = (n, [min, max]) => !Number.isNaN(n) && n >= min && n <= max;