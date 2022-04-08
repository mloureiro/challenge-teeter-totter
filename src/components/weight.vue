<template>
	<div class="weight __wrapper" :class="classList">{{ weight }}</div>
</template>

<script>
import { isBetween, randomItem, range } from '../utils';
import { GAME_CONFIGURATION } from "../store";

const SHAPES = ['square', 'circle', 'triangle'];
const SIZES = ['xs', 's', 'm', 'l', 'xl'];
const VARIANTS = range(1, 12).map(n => `${n}`);

export default {
	props: {
		weight: {
			type: Number,
			required: true,
			validator: w => isBetween(w, [GAME_CONFIGURATION.minWeight, GAME_CONFIGURATION.maxWeight]),
		},
		shape: {
			type: String,
			required: true,
			validator: t => SHAPES.includes(t),
		},
	},
	data: () => ({
		variant: randomItem(VARIANTS),
	}),
	computed: {
		size() {
			return SIZES[Math.round(this.weight * (SIZES.length - 1) / GAME_CONFIGURATION.maxWeight)];
		},
		classList() {
			return [
				`--${this.shape}`,
				`--${this.size}`,
				`--var${this.variant}`,
			];
		},
	},
};
</script>

<style scoped lang="scss">
.weight {
	&.__wrapper {
		--weight-size: var(--size-m);
		--weight-color: var(--color-rich-black);
		--weight-background: var(--color-gains-boro);
		--weight-border-width: 1px;

		width: calc(var(--weight-size) * 3);
		height: calc(var(--weight-size) * 3);
		display: flex;
		justify-content: center;
		align-items: center;

		position: absolute;
		bottom: calc(-1 * var(--size-m));

		font-size: calc(var(--weight-size) * 2);
		font-weight: var(--font-weight-heavy);

		color: var(--weight-color);
		border: var(--weight-border-width) solid var(--weight-color);
		background-color: var(--weight-background);
	}

	&.--square { border-radius: var(--border-l); }
	&.--circle { border-radius: 100%; }
	/* TODO use SVG for triangles instead of the CSS hacks */
	&.--triangle {
		width: 0;
		height: 0;
		border: solid transparent;
		border-bottom: solid var(--weight-background);
		align-items: baseline;

		/* @TODO fix !important requirement */
		border-width:
			0
			calc(var(--weight-size) * 1.5)
			calc(var(--weight-size) * 2.25)
			calc(var(--weight-size) * 1.5) !important;
		background-color: transparent !important;
	}

	&.--xs {
		--weight-size: var(--size-xs);
		--weight-border-width: var(--border-xs);
	}
	&.--s {
		--weight-size: var(--size-s);
		--weight-border-width: var(--border-s);
	}
	&.--l {
		--weight-size: var(--size-l);
		--weight-border-width: var(--border-l);
	}
	&.--xl {
		--weight-size: var(--size-xl);
		--weight-border-width: var(--border-xl);
	}

	&.--var1 {
		--weight-color: var(--color-royal-purple);
		--weight-background: var(--color-pacific-blue);
	}
	&.--var2 {
		--weight-color: var(--color-gains-boro);
		--weight-background: var(--color-pewter-blue);
	}
	&.--var3 {
		--weight-color: var(--color-granny-apple);
		--weight-background: var(--color-cadet-crayola);
	}
	&.--var4 {
		--weight-color: var(--color-cadet-crayola);
		--weight-background: var(--color-light-orange);
	}
	&.--var5 {
		--weight-color: var(--color-viridian-green);
		--weight-background: var(--color-royal-purple);
	}
	&.--var6 {
		--weight-color: var(--color-army-green);
		--weight-background: var(--color-granny-apple);
	}
	&.--var7 {
		--weight-color: var(--color-sheen-gold);
		--weight-background: var(--color-army-green);
	}
	&.--var8 {
		--weight-color: var(--color-english-violet);
		--weight-background: var(--color-orange-pantone);
	}
	&.--var9 {
		--weight-color: var(--color-old-lavender);
		--weight-background: var(--color-sheen-gold);
	}
	&.--var10 {
		--weight-color: var(--color-light-orange);
		--weight-background: var(--color-english-violet);
	}
	&.--var11 {
		--weight-color: var(--color-pacific-blue);
		--weight-background: var(--color-old-lavender);
	}
	&.--var12 {
		--weight-color: var(--color-pewter-blue);
		--weight-background: var(--color-gains-boro);
	}
}
</style>
