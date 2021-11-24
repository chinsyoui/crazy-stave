<script/>

<template>
	<view class="container">
		<image class="image" src="../static/images/degrees-ex.png" style="width: 100%"></image>
		<view class="text-area">
			<text class="text">这是分解双音的度数，因为视觉上左右错开的缘故，看起来会更难一些。\n但熟能生巧，请加油练习。熟练后您看五线谱时就可以一眼看清多个音符了。</text>
		</view>
	</view>
</template>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

		.image {
			height: calc(0.22 * (100vw - 1rem));
			background-size: cover;			
		}
		
		.text-area {
			display: flex;
			justify-content: center;
		}

		.text {
			flex-wrap: wrap;
			font-size: 1em;
			height: auto;
		}
</style>
