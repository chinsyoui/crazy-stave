<script/>

<template>
	<view class="container">
		<image class="image" src="../static/images/double-staves.jpg"></image>
		<view class="text-area">
			<text class="text">每五条线组成一个谱表，每个谱表开头的符号叫谱号，其定位点指向一个固定的音。\n注:G4就是钢琴键盘上第4组键的G音(唱名为Sol)，F3就是钢琴键盘上第3组键的F音(唱名为Fa)。\n\n五线谱上的其他音符都是根据位置一个个排列下去，高度每升高半行，就相当于钢琴键盘上向右到下一个键。\n因为每7个基本音(白键)就是一个循环，所以7个音名会不断循环。\n上图中三个绿色的音都是C，分别是高音谱上的C4,C5以及低音谱上的C3。</text>
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
			height: calc(0.15 * (100vw - 1rem));
            width: 100%;
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
