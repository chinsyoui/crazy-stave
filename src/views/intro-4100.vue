<script/>

<template>
	<view class="container">
		<!-- <image class="image" src="../static/images/piano-multiple-octaves.png"></image> -->
		<view class="text-area">
			<text class="text">两个音之间的距离，叫度数。\n相邻的两个键叫二度，相邻两个组(指12个黑白键组成的组)中的同一个名称的音叫八度。\n其他还有三度，四度，五度，六度，七度，以及不太常用的比八度更宽的十一度等等。\n\n看到五线谱上的两个音，能迅速识别出度数，对于快速识谱非常重要。</text>
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
			height: calc(0.3 * (100vw - 1rem));
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
