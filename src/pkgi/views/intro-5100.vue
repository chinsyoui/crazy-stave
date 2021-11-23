<script/>

<template>
	<view class="container">
		<!-- <image class="image" src="../static/images/notes.jpg"  style="width: 40%"></image> -->
		<view class="text-area">
			<text class="text">三和弦就是三个呈一三五度关系的音的组合。\n三个音从下往上按一三五排列就叫原位。\n把根音换成其八度音，就叫第一转位。\n继续把三度音换成其八度音，就叫第二转位。</text>
		</view>
	</view>
</template>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
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
