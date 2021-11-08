<script>
	// import { changeScreenOrientationToLandscape } from "../../utils.js";
	import { mapState, mapMutations, mapActions } from 'vuex'

	export default {
		data() {
			return {
				Title: 'User-List'
			}
		},
		computed: mapState({
			Users: state => state.Users,
			CurrentUser: state => state.CurrentUser
		}),
		
		onLoad() {
			//changeScreenOrientationToLandscape(this);
		},
		methods: {
			onItemClick: function(e) {
				console.log(this.Title + "." + "onItemClick", e);
				let user = e;
				this.$store.commit('setCurrentUser', user);
				uni.reLaunch({ url: '/pages/game/game-collection-list' });
			},
			onLastItemClick: function() {
				console.log(this.Title + "." + "onLastItemClick");
				uni.reLaunch({ url: '/pages/game/add-new-user' });
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
								<text>{{ value.GameCollectionStates.size }} / {{ value.GameCollections.length }}</text>
							</view>
						</view>
					</view>
				</view>
			</block>
			<block>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="onLastItemClick()">
					<view class="uni-media-list">
						<image class="uni-media-list-logo" src="../../static/add.jpg"/>
						<view class="uni-media-list-body">
							<view class="uni-media-list-text-top">Add New</view>
						</view>
					</view>
				</view>			
			</block>
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
		border: 1px solid red;
	}

		.logo {
			max-height: 4rem;
			max-width: 4rem;
			margin-top: 10px;
			margin-left: 10px;
			margin-right: 10px;
			margin-bottom: 10px;
		}

		.text-area {
			display: flex;
			justify-content: center;
			border: 1px solid red;
		}

			.title {
				font-size: 1em;
				color: #8f8f94;
				border: 1px solid red;
			}
	
		.uni-list {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			align-items: center;
			justify-content: center;
			overflow-x: scroll;
			border: 1px solid red;
		}

			.uni-list-cell {
				background-color: #C0C0C0;
				margin-left: 1rem;
				margin-right: 1rem;
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
					border: 1px solid red;
				}

					.uni-media-list-text-top {
						//height: 4rem;
						font-size: 1em;
						overflow: hidden;
						border: 1px solid red;
					}

					.uni-media-list-text-bottom {
						display: flex;
						flex-direction: row;
						font-size: 1em;
						justify-content: space-between;
						border: 1px solid red;
					}
			
</style>
