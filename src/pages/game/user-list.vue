<script>
    import logger from '@/utils/logger.js'
	import { mapState } from 'vuex'

	export default {
		data() {
			return {
				Title: '选择一个用户开始'
			}
		},

		computed: mapState({
			Users: state => state.Users,
			CurrentUser: state => state.CurrentUser,
 		}),
		
        mounted() {
            logger.debug(this.Users[0].GameCollectionStates);
        },

		methods: {
			onItemClick: function(e) {
				//logger.debug(this.Title + "." + "onItemClick", e);
				let user = e;
				this.$store.commit('setCurrentUser', user);
				uni.navigateTo({ url: '/pages/game/game-collection-list' });
			},
			onLastItemClick: function() {
				//logger.debug(this.Title + "." + "onLastItemClick");
				// uni.navigateTo({ url: '/pages/game/add-new-user' });
                uni.navigateBack();
			}			
		}
	}
</script>

<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{Title}}</text>
		</view>
		<view class="uni-list">
			<block v-for="(value, index) in Users" :key="index">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="onItemClick(value)">
					<view class="uni-media-list">
						<image class="uni-media-list-logo" src="../../static/user.jpg"/>
						<view class="uni-media-list-body">
							<view class="uni-media-list-text-top">{{ value.DisplayName }}</view>
							<view class="uni-media-list-text-bottom">
								<text style="color: gray">{{ value.GameCollectionStatesSize }} / {{ value.GameCollections.length }}</text>
							</view>
						</view>
					</view>
				</view>
			</block>
			<!-- <block>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="onLastItemClick()">
					<view class="uni-media-list">
						<image class="uni-media-list-logo" src="../../static/add.jpg"/>
						<view class="uni-media-list-body">
							<view class="uni-media-list-text-top">Add New</view>
						</view>
					</view>
				</view>			
			</block> -->
		</view>
	</view>
</template>

<style>
	.content {
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

		.logo {
			max-height: 8rem;
			max-width: 8rem;
			margin-top: 0.1rem;
			margin-left: 3rem;
			margin-right: 3rem;
			margin-bottom: 0.5rem;
		}

		.text-area {
			display: flex;
			justify-content: center;
		}

			.title {
				font-size: 1em;
				color: #8f8f94;
                margin-bottom: 10px;
			}
	
		.uni-list {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			align-items: center;
			justify-content: center;
			overflow-x: scroll;
            box-sizing: border-box;
			border: 1px solid blue;
		}

			.uni-list-cell {
				margin-left: 1rem;
				margin-right: 1rem;
                padding: 0.5em 0.5em 0.5em;
			}

				.uni-media-list {
					display: flex;
					flex-direction: column;
					justify-content: center;					
				}

				.uni-media-list-logo {
					max-width: 4rem;
					max-height: 4rem;
					vertical-align: middle;
					object-fit: scale-down;
				}

				.uni-media-list-body {
					height: auto;
					justify-content: space-around;
				}

					.uni-media-list-text-top {
						font-size: 1em;
						overflow: hidden;
					}

					.uni-media-list-text-bottom {
						display: flex;
						flex-direction: row;
						font-size: 1em;
						justify-content: space-between;
					}
			
</style>
