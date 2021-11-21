<script/>

<template>
	<view class="container">
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
            注：涉及到乐器的时候，我们将以钢琴来举例。<br/>
        </text>
        <text class="text-bold">
            在开始前，确保你具备以下能力: <br/>
        </text>
        <text class="text">
                1.熟悉英文字母的写法(包括大写和小写)和读音。\n2.会读音乐中的七个唱名 Do Re Mi Fa Sol La Si。\n3.一些数学物理学概念：振动，频率，平方根。
        </text>
	</view>
</template>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
        padding: 1em 3em 3em 3em;
	}

		.text {
            white-space: pre-wrap;
			flex-wrap: wrap;
			font-size: 1em;
			height: auto;
            margin-top: 0.5em;
		}

		.text-bold {
			flex-wrap: wrap;
			font-size: 1.1em;
            color:blue;
			height: auto;
            margin-top: 1em;
        }
</style>
