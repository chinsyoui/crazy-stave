<script>
	import { mapState } from 'vuex'
    import logger from '@/utils/logger.js'
	import { BTs } from '@/store/game-model.js'

	export default {
		data() {
			return {
				Title: 'Game-List'
			}
		},
		computed: {
            isIntroGame() {
                return function(game) {
                    return (game.ButtonType == BTs.Any);
                }
            },
			getGameCollectionState() {
                return function() {
				    return this.CurrentUser.GameCollectionStates.getMapItem(this.CurrentGameCollection.Id);
                }
			},
			getGameState() {
                return function(game_id) {
				    let parent = this.getGameCollectionState();
                    if (!parent)
                        return null;
                    let state = parent.GameStates.getMapItem(game_id);
                    return state;
                }
			},
			getGameStateTotalPlayCount() {
                return function(game_id) {
                    let state = this.getGameState(game_id);
                    return state ? state.TotalPlayCount : 0;
                }
			},
			getGameStateTotalPlayDuration() {
                return function(game_id) {
                    let state = this.getGameState(game_id);
                    return state ? state.TotalPlayDuration : 0;
                }
			},
			getGameStateHighestScore() {
                return function(game_id) {
                    let state = this.getGameState(game_id);
                    return state ? state.HighestScore : 0;
                }
			},
			getGameStateStars() {
                return function(game_id) {
                    let state = this.getGameState(game_id);
                    return state ? state.Stars: 0;
                }
			},

            ...mapState({
			    CurrentUser: state => state.CurrentUser,
			    CurrentGameCollection: state => state.CurrentGameCollection,
			    Games: state => state.CurrentGameCollection.Games
	    	})
        },
		methods: {
			onItemClick: function(pair) { // game, index
				logger.debug(this.Title + "." + "onItemClick", pair);
                let game = pair.value; let index = pair.index;

				this.$store.commit('setCurrentGame', { game : game, index : index } );

				let page_url = "";
				if (game.ButtonType == BTs.Any)
					page_url = "/pkgi/pages/game/game-intro";
				else
					page_url = "/pkgp/pages/game/game-player";
				uni.navigateTo({ url: page_url });
			},

			onBackClick: function() {
				logger.debug(this.Title + "." + "onBackClick");
                uni.navigateBack();
			}
		}
	}
</script>

<template>
	<view class="content">
		<view class="uni-list">
			<block v-for="(value, index) in Games" :key="index">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="onItemClick({value,index})">
					<view class="uni-media-list">
						<view class="uni-media-list-body">
							<view class="uni-media-list-text-top"  v-bind:class="{ 'intro-game': isIntroGame(value) }" style="color: blue; font: bold">{{ value.DisplayName }}</view>
							<view class="uni-media-list-text-middle">{{ value.Description }}</view>
							<view class="uni-media-list-text-bottom">
								<text style="color: gray">★{{ getGameStateStars(value.Id) }} 得分#{{ getGameStateTotalPlayCount(value.Id) }} 已练习{{ getGameStateTotalPlayDuration(value.Id) }}秒</text>
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
		flex-wrap: nowrap;
	}

		.text-area {
			display: flex;
			justify-content: center;
		}

			.title {
				font-size: 1em;
				/* color: #8f8f94; */
			}

		.uni-list {
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
            padding-bottom: 3rem;
			min-width: 100%;
			overflow-x: scroll;
		}

			.uni-list-cell{
				/* background-color: #C0C0C0; */
				margin: 0.5rem 0.5rem 0.5rem 0.5rem;
			}

				.uni-media-list-logo {
					width: 2rem;
					height: 2rem;
				}

				.uni-media-list-body {
					height: auto;
					justify-content: space-around;
					border: 1px solid blue;
                    box-sizing: border-box;
                    padding: 0.5em 0.5em 0.5em 0.5em;
				}

					.uni-media-list-text-top.intro-game {
                        background-color: #EEFFFF;
					}

                    .uni-media-list-text-top {
						font-size: 1em;
						overflow: hidden;
                        background-color: #FFFFCC;
                    }

					.uni-media-list-text-middle {
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
