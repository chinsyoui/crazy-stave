<script/>

<template>
	<view class="container">
		<image class="image" src="../static/images/notes.jpg"  style="width: 40%"></image>
		<view class="text-area">
			<text class="text">凡是带一个小椭圆的符号都是一个音符。其他差异都表示不同的时长(弹奏时这个键按下去多久就松开)。\n根据椭圆内部有没有填充，带不带尾巴，带几条尾巴，来表示时长的不同。\n上图中，每个右边的音符的时长都是其左边紧邻音符时长的一半(弹奏时快一倍)。\n\n以上，我们已经掌握了最基本的五线谱知识，接下来，为了加快我们的视谱速度，我们需要大量练习，做到一看到谱子上音符的位置就立刻反应出其音名/唱名（钢琴键盘上的位置)。</text>
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
