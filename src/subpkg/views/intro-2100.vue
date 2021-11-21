<script/>

<template>
	<view class="container">
		<!-- <image class="image" src="../static/images/notes.jpg"  style="width: 40%"></image> -->
		<view class="text-area">
			<text class="text">除了按照唱名速记表和音名速记表记忆外，还可以按如下次序快速记忆: \n1.记住谱号定位点对应的G4/F3；\n2.记住高低音谱上所有五个C音(分别是C2,C3,C4,C5,C6)；\n3.记住高低音谱四个边线对应的音(分别是G2,B3,E4,F4)；\n4.记住高低音谱两个中线对应的音(分别是D3,B4)；\n5.再记住中线上下的音(分别是C3,E3,A4,C5)；6.最后再记住其他线和间的音。、\n\n接下来，请继续将唱名/音名练习至滚瓜烂熟的程度，务必做到看到音符立刻就能反应出其唱名和音名。</text>
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
