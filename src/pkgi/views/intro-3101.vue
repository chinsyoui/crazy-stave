<script/>

<template>
	<view class="container">
		<!-- <image class="image" src="../static/images/notes.jpg"  style="width: 40%"></image> -->
		<view class="text-area">
			<text class="text">钢琴上每组键有12个键，其中7个白键，5个黑键。\n从12个键中按照某种规律，选择出7个音，就成为一个调式。\n比如，选择7个白键的音，就是C大调或A小调。</text>
		</view>
	</view>
</template>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
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
