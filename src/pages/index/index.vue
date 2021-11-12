<script>
	export default {
		data() {
			return {
				Title: "Welcome",
				DebugInfo: ""
			}
		},
		mounted() {
			// this.DebugInfo = this.DebugInfo + "uni.getSystemInfoSync() = " + JSON.stringify(uni.getSystemInfoSync());
		},
		methods: {
			onItemClick: function() {
				console.log(this.Title + "." + "onItemClick");
				uni.reLaunch({ url: '/pages/game/user-list' });
			}
		}
	}
</script>

<template>
 	<view class="container" @click="onItemClick()">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{Title}}</text>
		</view>
		<view class="text-area">
			<text class="DebugInfo">{{ DebugInfo }}</text>
		</view>
		
		<match-media max-height="480" max-width="640">
			<view>屏幕太小，无法工作</view>
		</match-media>
 		<match-media min-height="300" orientation="landscape">
			<view>欢迎，点击开始</view>
		</match-media>
		<match-media min-width="300" orientation="portrait">
			<view>请横屏使用</view>
		</match-media>
	</view>
</template>

<style>
	.container {
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: 1px solid red;
	}

	.logo {
		max-height: 4rem;
		max-width: 4rem;
		background-size: cover;
		margin-top: 10px;
		margin-left: 10px;
		margin-right: 10px;
		margin-bottom: 10px;
	}

	.DebugInfo {
		overflow-wrap: break-word;
	}
</style>
