import { factoryShape } from './shape.js';

/**
 * @TODO WIP
 * @TODO describe the main
 */
function main() {
	const app = document.getElementById('app');
	const createShape = factoryShape({
		createElement: () => document.createElement('div'),
	});

	const tri = createShape({ type: 'triangle', weight: 10 });
	app.append(tri.el)
	tri.weight = 4;

	app.append(createShape({ type: 'circle', weight: 10 }).el)
}

main();
