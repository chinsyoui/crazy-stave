<script/>

<template>
	<view class="container">
		<text-area class="text-area">
			<text class="text">
                五线谱是音乐的书面语，学习音乐就要掌握这门语言。<br/>
            </text>
			<text class="text">
                就像中文/英文语言一样，五线谱这门语言也是由字母，单词，短语，句子，文章这样的结构组成的。<br/>
            </text>
			<text class="text">
                这个小程序可以帮助你快速学习五线谱这门语言，并且辅助你训练阅读五线谱的速度，直到能像快速阅读中文/英文文章一样的阅读五线谱。<br/>
            </text>
			<text class="text">
                在开始前，确保你具备以下能力: <br/>
            </text>
			<text class="text">
                 1.熟悉英文字母的写法(包括大写和小写)和读音。<br/>
            </text>
			<text class="text">
                 2.TODO. <br/>
            </text>
		</text-area>
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
		/* border: 1px solid red; */
	}

		.image {
			height: calc(0.15 * (100vw - 1rem));
			background-size: cover;			
		}
		
		.text-area {
			display: flex;
            flex-direction: column;
			justify-content: center;
            padding: 5em 10em 10em 5em;
		}

		.text {
			flex-wrap: wrap;
			font-size: 1em;
			height: auto;
            margin-top: 1em;
		}
</style>
