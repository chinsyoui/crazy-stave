<script/>

<template>
	<view class="container">
		<view class="text-area">
			<text class="text">在开始前，确保您熟悉以下知识：</text>
		</view>
        <uni-list>
            <uni-list-item class="uni-list-item">  <br/></uni-list-item>
            <uni-list-item class="uni-list-item">  <br/></uni-list-item>
            <uni-list-item class="uni-list-item">熟悉大小写英文字母的写法和读音<br/></uni-list-item>
            <uni-list-item class="uni-list-item">TODO<br/></uni-list-item>
        </uni-list>
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
        margin-top: 2em;
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
            margin-top: 1em;
		}
</style>
