<script/>

<template>
	<view class="container">
		<image class="image" src="../static/images/stave-octave-notes.png"></image>
		<view class="text-area">
			<text class="text">音名就是C D E F G A B，上面就是五线谱上一个八度的音名（最后一个是高八度的C）</text>
		</view>
		<image class="image" src="../static/images/piano-octave-pitch-names.png"></image>
		<view class="text-area">
			<text class="text">上面是钢琴键盘上的音名的例子</text>
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
			flex-wrap: wrap;
			font-size: 1em;
			height: auto;
		}
</style>
