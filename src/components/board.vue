<template>
	<div ref="board" class="board__wrapper" :style="styleVariables">
		<scale
			:bending="bending"
			@scale="scaleConfig = $event"
		/>
		<div
			v-for="(node, index) in listWithStyle"
			:key="index"
			:style="node.style"
			class="board__node"
		>
			<slot :item="node.item"></slot>
		</div>
	</div>
</template>

<script>
import Scale from './scale.vue';

/** @typedef {Array.<number, number>} Position */

/**
 * @typedef {Object} ScaleConfig
 * @property {number} height
 * @property {number} width
 * @property {Position} start
 * @property {Position} end
 * @property {number} radAngle
 */

const isPosition = position =>
	Array.isArray(position)
	&& position.length === 2
	&& position.every(Number.isInteger);

export default {
	components: { Scale },
	props: {
		bending: Scale.props.bending,
		boardSize: {
			type: Array,
			required: true,
			validator: isPosition,
		},
		itemList: {
			type: Array,
			required: true,
			validator: l => l.every(n => isPosition(n.position)),
		},
	},
	data: () => ({
		scaleConfig: null,
	}),
	computed: {
		styleVariables() {
			if (!this.scaleConfig) return;

			const [boardWidth, boardHeight] = this.boardSize;
			const { angleRad = 0, start = [0, 0], end = [0, 0] } = this.scaleConfig;
			const boardYStart = this.$refs.board?.getBoundingClientRect().y || 0;
			const [yEndLeft, yEndRight] = this.scaleConfig.angleRad > 0
				? [start[1], end[1]]
				: [end[1], start[1]];

			return {
				'--board-width-slots': boardWidth + 1, // +1 for an empty mid
				'--board-height-slots': boardHeight,
				'--board-top-left-x': start[0],
				'--board-top-left-y': boardYStart,
				'--board-top-right-x': end[0],
				'--board-top-right-y': boardYStart,
				'--board-bottom-left-x': start[0],
				'--board-bottom-left-y': yEndLeft,
				'--board-bottom-right-x': end[0],
				'--board-bottom-right-y': yEndRight,
				'--scale-angle-rad': angleRad,
			};
		},
		listWithStyle() {
			const [boardWidth] = this.boardSize;
			return this.itemList.map(node => {
				const [x] = node.position;
				const isOnTheLeft = x < boardWidth / 2;
				return {
					item: node,
					style: {
						'--x': node.position[0] + (isOnTheLeft ? 0 : 1),
						'--y': node.position[1],
					},
				};
			});
		},
	},
};
</script>

<style scoped lang="scss">
@function abs($v) {
	@return max(var($v), calc(var($v) * -1));
}

@function sign($v) {
	@return calc(var($v) / abs($v));
}

@function slotSize($slots, $min, $max) {
	@return calc((var($max) - var($min)) / var($slots));
}

@function yInLinearEquation($x, $x1, $y1, $x2, $y2) {
	@return calc(
		(var($y2) - var($y1)) / (var($x2) - var($x1)) * var($x)
		+ (var($x2) * var($y1) - var($x1) * var($y2)) / (var($x2) - var($x1))
	);
}

.board {
	&__wrapper {
		--x: 0;
		--y: 0;
		--scale-angle-rad: 0;
		--board-width-slots: 0;
		--board-height-slots: 0;
		--board-top-left-x: 0;
		--board-top-left-y: 0;
		--board-top-right-x: 0;
		--board-top-right-y: 0;
		--board-bottom-left-x: 0;
		--board-bottom-left-y: 0;
		--board-bottom-right-x: 0;
		--board-bottom-right-y: 0;

		--board-width: calc(var(--board-top-right-x) - var(--board-top-left-x));

		height: 100%;
		width: 100%;
		position: relative;
	}

	&__node {
		position: absolute;
		opacity: 0.9;
		transform: rotate(calc(var(--scale-angle-rad) * 1rad));

		--width-slot: calc(var(--board-width) / (var(--board-width-slots) + 2));
		--weight-x-px: calc(var(--x) * var(--width-slot) + var(--width-slot) + var(--width-slot) / 2);
		left: calc(var(--weight-x-px) * 1px);

		--board-height-at-weight-x-px: #{yInLinearEquation(
			--weight-x-px,
			--board-bottom-left-x,
			--board-bottom-left-y,
			--board-bottom-right-x,
			--board-bottom-right-y,
		)};

		--board-height: calc(var(--board-height-at-weight-x-px) - var(--board-top-left-y));
		--height-slot: calc(var(--board-height) / var(--board-height-slots));
		--weight-y-px: calc(var(--y) * var(--height-slot) + var(--height-slot) - 14);
		top: calc(var(--weight-y-px) * 1px);
	}
}
</style>
