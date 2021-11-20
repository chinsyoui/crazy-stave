<script/>

<template>
	<view class="container">
		<image class="image" src="../static/images/all-notes-pitch.png"  style="width: 100%"></image>
		<view class="text-area">
			<text class="text">和上面的唱名速记表类似，这是音名速记表，音名在不少时候会很有用(如和弦)，请也务必记熟。\n请认真花时间牢记在心，接下来我们将通过练习来帮助您背的滚瓜烂熟。\n这样，当您看五线谱时，就不会因为对五线谱这门语言的"字母"不熟悉而影响阅读速度了。</text>
		</view>
	</view>
</template>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
        padding: 1em 3em 1em 3em;
		justify-content: center;
		align-items: center;
		/* width: 100%; */
		/* border: 1px solid red; */
	}

		.image {
			height: calc(0.25 * (100vw - 1rem));
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
