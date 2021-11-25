<script/>

<template>
	<view class="container">
		<image class="image" src="../static/images/notes.jpg"  style="width: 40%"></image>
		<view class="text-area">
			<text class="text">我们已经认识了一个小椭圆就是一个音符。\n小椭圆可以带尾巴，椭圆内部也可以填充，这些都表示弹奏时时间的长短。\n音符上的修饰越多，弹奏时就越短。上图每个右边的音符的时长都是其左边紧邻音符时长的一半(弹奏时快一倍)。</text>
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
            align-items: center;
		}

		.text {
            white-space: pre-wrap;
			flex-wrap: wrap;
			font-size: 1em;
			height: auto;
		}
</style>
