<script/>

<template>
	<view class="container">
		<!-- <image class="image" src="../static/images/notes.jpg"  style="width: 40%"></image> -->
		<view class="text-area">
			<text class="text">#是升号，表示升高半音。b是降号，表示降低半音。</text>
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
