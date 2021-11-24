<script>
	import { mapState, mapMutations, mapActions } from 'vuex'

	export default {
		data() {
			return {
				title: 'Add-New-User'
			}
		},
		computed: mapState({
			Users: state => state.Users
		}),
		
		onLoad() {
		},
		methods: {
			onSaveClick: function(e) {
				logger.debug(this.title + "." + "onSaveClick", e);
				// TODO prepare new user object here
				var user = null;
				this.$store.commit('addNewUser',user);
				uni.navigateBack();
			},
			onCancelClick: function() {
				logger.debug(this.title + "." + "onCancelClick");
				uni.navigateBack();
			}			
		}
	}
</script>

<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
        box-sizing: border-box;
		border: 1px solid red;
	}

		.logo {
			height: 64rpx;
			width: 64rpx;
			margin-top: 10rpx;
			margin-left: 10rpx;
			margin-right: 10rpx;
			margin-bottom: 10rpx;
		}

		.text-area {
			display: flex;
			justify-content: center;
            box-sizing: border-box;
			border: 1px solid red;
		}

			.title {
				font-size: 36rpx;
				color: #8f8f94;
                box-sizing: border-box;
				border: 1px solid red;
			}
	
</style>
