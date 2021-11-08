<script>
	import { mapState, mapMutations, mapActions } from 'vuex'

	export default {
		data() {
			return {
				Title: 'Game-Collection-List'
			}
		},

		computed: mapState({
			CurrentUser: state => state.CurrentUser,
			GameCollections: state => state.CurrentGameCollections
		}),

		onLoad() {
			console.log(this.Title + "." + "onLoad");
			console.log(this.CurrentUser);
			console.log(this.GameCollections);
		},

		methods: {
			onItemClick: function(e) {
				console.log(this.Title + "." + "onItemClick", e);
				let game_collection = e;
				this.$store.commit('setCurrentGameCollection', game_collection);
				uni.reLaunch({ url: '/pages/game/game-list' });
			},
			onBackClick: function() {
				console.log(this.Title + "." + "onBackClick");
				uni.reLaunch({ url: '/pages/game/user-list' });
			},
			getGameCollectionState(game_collection_id) {
				return this.CurrentUser.GameCollectionStates.get(game_collection_id);
			},
			getGameCollectionStateCount(game_collection_id) {
				let state = this.getGameCollectionState(game_collection_id);
				return state ? state.GameStates.size : 0;
			},
			getGameCollectionStateStars(game_collection_id) {
				let state = this.getGameCollectionState(game_collection_id);
				return state ? state.Stars: 0;
			}
		}
	}
</script>

<template>
	<view class="content">
		<view class="text-area" @click="onBackClick()">
			<text class="title">{{Title}} - {{ CurrentUser.DisplayName }}</text>
		</view>
		<view class="uni-list">
			<block v-for="(value, index) in GameCollections" :key="index">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="onItemClick(value)">
					<view class="uni-media-list">
						<image class="uni-media-list-logo" :src="value.Icon"></image>
						<view class="uni-media-list-body">
							<view class="uni-media-list-text-top">{{ value.DisplayName }}</view>
							<view class="uni-media-list-text-bottom">
								<text>{{ getGameCollectionStateCount(value.Id) }} / {{ value.Games.length }} + *{{ getGameCollectionStateStars(value.Id) }}</text>
							</view>
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
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: 1px solid red;
	}

		.text-area {
			display: flex;
			justify-content: center;
			border: 1px solid red;
		}

			.title {
				vertical-align: middle;
				font-size: 1em;
				color: #8f8f94;
			}
	
		.uni-list {
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
			align-items: center;
			justify-content: center;
			min-width: 99%;
			overflow-x: scroll;
			border: 1px solid red;
		}

			.uni-list-cell {
				background-color: #C0C0C0;
				margin-left: 0.5rem;
				margin-right: 0.5rem;
			}

				.uni-media-list-logo {
					width: 2rem;
					height: 2rem;
				}

				.uni-media-list-body {
					height: auto;
					justify-content: space-around;
					border: 5px solid red;
				}

					.uni-media-list-text-top {
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
