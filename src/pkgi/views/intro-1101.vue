<script/>

<template>
	<view class="container">
		<image class="image" src="../static/images/88-piano-keys.png" style="width: 100%"></image>
		<view class="text-area">
			<text class="text">
                我们再认识下钢琴键盘。\n标准的钢琴有88个键，分成九组(编号0到8)。\n中间的七个组的布局都是一样的：每组都有12个键(7个白键，5个黑键)。\n每个键(黑或白)都是一个固定的音。其中每组中的白键为7个基本音，黑键为5个变化音。
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
