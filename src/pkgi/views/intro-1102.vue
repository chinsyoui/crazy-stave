<script/>

<template>
	<view class="container">
		<image class="image" src="../static/images/stave-keys-names.png" style="width: 35%"></image>
		<view class="text-area">
			<text class="text">每个基本音都有三个称呼：音名（7个大写英文字母之一），唱名(7个发音标记之一)，数字(7个阿拉伯数字之一)。\n五线谱就是把音摆在五根线上(可以在一根线之上或两根线之间，简称线或间)，每个音符表示一个音(小椭圆)。\n五线谱上的音符和钢琴键盘上键、音名/唱名/数字的对应关系如上图所示。</text>
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
