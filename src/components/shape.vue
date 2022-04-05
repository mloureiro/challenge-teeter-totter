<template>
	<div class="shape __wrapper" :class="classList">{{ weight }}</div>
</template>

<script>
import { isBetween, randomItem, range } from "../utils";

const [MIN_WEIGHT, MAX_WEIGHT] = [1, 10];
const TYPES = ['square', 'circle', 'triangle'];
const SIZES = ['xs', 's', 'm', 'l', 'xl'];
const VARIANTS = range(1, 12).map(n => `${n}`);

export default {
	props: {
		type: {
			type: String,
			required: true,
			validator: t => TYPES.includes(t),
		},
		weight: {
			type: Number,
			required: true,
			validator: w => isBetween(w, [MIN_WEIGHT, MAX_WEIGHT]),
		},
	},
	data: () => ({
		variant: randomItem(VARIANTS),
	}),
	computed: {
		size() {
			return SIZES[Math.floor(this.weight * (SIZES.length - 1) / MAX_WEIGHT)];
		},
		classList() {
			return [
				`--${this.type}`,
				`--${this.size}`,
				`--var${this.variant}`,
			];
		},
	},
};
</script>

<style scoped lang="scss">
.shape {
	&.__wrapper {
		--shape-size: var(--size-m);
		--shape-color: var(--color-rich-black);
		--shape-background: var(--color-gains-boro);

		width: calc(var(--shape-size) * 3);
		height: calc(var(--shape-size) * 3);
		display: flex;
		justify-content: center;
		align-items: center;

		font-size: calc(var(--shape-size) * 2);
		font-weight: var(--font-weight-heavy);

		color: var(--shape-color);
		border: 1px solid var(--shape-color);
		background-color: var(--shape-background);
		opacity: 0.8;
	}

	&.--square { border-radius: var(--border-l); }
	&.--circle { border-radius: 100%; }
	&.--triangle {
		width: 0;
		height: 0;
		border: solid transparent;
		border-bottom: solid var(--shape-background);
		align-items: baseline;

		/* @TODO fix !important requirement */
		border-width:
			0
			calc(var(--shape-size) * 1.5)
			calc(var(--shape-size) * 2.25)
			calc(var(--shape-size) * 1.5) !important;
		background-color: transparent !important;
	}

	&.--xs {
		--shape-size: var(--size-xs);
		border-width: var(--border-xs);
	}
	&.--s {
		--shape-size: var(--size-s);
		border-width: var(--border-s);
	}
	&.--l {
		--shape-size: var(--size-l);
		border-width: var(--border-l);
	}
	&.--xl {
		--shape-size: var(--size-xl);
		border-width: var(--border-xl);
	}

	&.--var1 {
		--shape-color: var(--color-royal-purple);
		--shape-background: var(--color-pacific-blue);
	}
	&.--var2 {
		--shape-color: var(--color-gains-boro);
		--shape-background: var(--color-pewter-blue);
	}
	&.--var3 {
		--shape-color: var(--color-granny-apple);
		--shape-background: var(--color-cadet-crayola);
	}
	&.--var4 {
		--shape-color: var(--color-cadet-crayola);
		--shape-background: var(--color-light-orange);
	}
	&.--var5 {
		--shape-color: var(--color-viridian-green);
		--shape-background: var(--color-royal-purple);
	}
	&.--var6 {
		--shape-color: var(--color-army-green);
		--shape-background: var(--color-granny-apple);
	}
	&.--var7 {
		--shape-color: var(--color-sheen-gold);
		--shape-background: var(--color-army-green);
	}
	&.--var8 {
		--shape-color: var(--color-english-violet);
		--shape-background: var(--color-orange-pantone);
	}
	&.--var9 {
		--shape-color: var(--color-old-lavender);
		--shape-background: var(--color-sheen-gold);
	}
	&.--var10 {
		--shape-color: var(--color-light-orange);
		--shape-background: var(--color-english-violet);
	}
	&.--var11 {
		--shape-color: var(--color-pacific-blue);
		--shape-background: var(--color-old-lavender);
	}
	&.--var12 {
		--shape-color: var(--color-pewter-blue);
		--shape-background: var(--color-gains-boro);
	}
}
</style>
