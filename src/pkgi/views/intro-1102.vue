<script/>

<template>
	<view class="container">
		<image class="image" src="../static/images/stave-keys-names.png" style="width: 35%"></image>
		<view class="text-area">
			<text class="text">五线谱上的音符(小椭圆)和钢琴键盘上的白键是一一对应的，音符位置的高低决定了是哪个键。\n我们都知道，音乐有七个音，分别是1234567(读作DoReMiFaSolLaSi)，这叫唱名。\n在五线谱上，同时还有七个对应的音名(依次是CDEFGAB)。\n接下来，让我们做个练习熟悉一下。\n</text>
		</view>
		<view class="text-area" style="margin-top: 10px">
			<text class="text" style="font-size: smaller">注：为简化起见，此处以高音谱/中央八度/C大调/固定调唱名法为例。</text>
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
