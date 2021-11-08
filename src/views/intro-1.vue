<script/>

<template>
	<view class="container">
		<image class="image" src="../static/images/piano-multiple-octaves.png"></image>
		<view class="text-area">
			<text class="text">钢琴键盘包含多个八度</text>
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
		border: 1px solid red;
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
