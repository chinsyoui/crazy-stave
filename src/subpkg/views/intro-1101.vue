<script/>

<template>
	<view class="container">
		<image class="image" src="../static/images/88-piano-keys.png" style="width: 100%"></image>
		<view class="text-area">
			<text class="text">
                标准的钢琴有88个键，可以如图所示分成若干组（从左到右编号为0~8组）。\n每个完整的组键的数量及布局都一样：每组有12个键(7个白键，5个黑键)。\n每个键(黑或白)都是一个固定的音。其中每组中的白键为7个基本音，黑键为5个变化音。
            </text>
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
		/* border: 1px solid red; */
	}

		.image {
			height: calc(0.15 * (100vw - 1rem));
			background-size: cover;
		}
		
		.text-area {
			display: flex;
			justify-content: center;
		}

		.text {
            white-space: pre-wrap;
			flex-wrap: wrap;
			font-size: 1em;
			height: auto;
		}
</style>
