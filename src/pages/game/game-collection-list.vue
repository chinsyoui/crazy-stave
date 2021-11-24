<script>
    import logger from '@/utils/logger.js'
	import { mapState } from 'vuex'

	export default {
		data() {
			return {
				Title: 'Game-Collection-List'
			}
		},

		computed: {
			getGameCollectionState() {
                return function(game_collection_id) {
				    return this.CurrentUser.GameCollectionStates.getMapItem(game_collection_id);
			    }
            },
			getGameCollectionStateCount() {
                return function(game_collection_id) {
				    let state = this.getGameCollectionState(game_collection_id);
				    return state ? state.GameStates.mapItemsCount : 0;
                }
			},
			getGameCollectionStateStars() {
                return function(game_collection_id) {
				    let state = this.getGameCollectionState(game_collection_id);
				    return (state && state.Stars > 0) ? "★" + state.Stars : "";
			    }
            },

            ...mapState({
			    CurrentUser: state => state.CurrentUser,
			    GameCollections: state => state.CurrentGameCollections
      		})
        },

		onLoad() {
			logger.debug(this.Title + "." + "onLoad");
			//logger.debug(this.CurrentUser);
			//logger.debug(this.GameCollections);
		},

		methods: {
			onItemClick: function(e) {
				logger.debug(this.Title + "." + "onItemClick", e);
				let game_collection = e;
				this.$store.commit('setCurrentGameCollection', game_collection);
				uni.navigateTo({ url: '/pages/game/game-list' });
			},
			onBackClick: function() {
				logger.debug(this.Title + "." + "onBackClick");
				// uni.navigateTo({ url: '/pages/game/user-list' });
                uni.navigateBack();
			}
		}
	}
</script>

<template>
	<view class="content">
		<!-- <view class="text-area" @click="onBackClick()">
			<text class="title">{{Title}} - {{ CurrentUser.DisplayName }}</text>
		</view> -->
		<view class="uni-list">
			<block v-for="(value, index) in GameCollections" :key="index">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="onItemClick(value)">
					<view class="uni-media-list">
						<!-- <image class="uni-media-list-logo" :src="value.Icon"></image> -->
						<view class="uni-media-list-body">
							<view class="uni-media-list-text-top" style="color: blue; font: bold">{{ value.DisplayName }}</view>
							<view class="uni-media-list-text-top">{{ value.Description }}</view>
							<!-- <view class="uni-media-list-text-bar" style="color: gray">—————</view> -->
							<view class="uni-media-list-text-bottom">
								<text style="color: gray">{{ getGameCollectionStateCount(value.Id) }} / {{ value.Games.length }} {{ getGameCollectionStateStars(value.Id) }}</text>
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
        padding-left: 3rem;
        padding-right: 3rem;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

		.text-area {
			display: flex;
			justify-content: center;
		}

			.title {
				vertical-align: middle;
				font-size: 1em;
				color: #8f8f94;
                margin: 0.5em 0.5em 0.5em 0.5em;
			}
	
		.uni-list {
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
            padding-bottom: 3rem;
			min-width: 100%;
            overflow-x: scroll;
		}

			.uni-list-cell {
				/* background-color: #C0C0C0; */
				margin: 0.5rem 0.5rem 0.5rem 0.5rem;
                box-sizing: border-box;
			    border: 1px solid blue;
			}

				.uni-media-list-logo {
					width: 2rem;
					height: 2rem;
				}

				.uni-media-list-body {
					height: auto;
					justify-content: space-around;
                    padding: 0.5em 0.5em 0.5em 0.5em;
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
