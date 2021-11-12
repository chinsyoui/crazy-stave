<script>
	import { mapState, mapMutations, mapActions } from 'vuex'
	import { BTs } from '../../store/game-model.js'

	export default {
		data() {
			return {
				Title: 'Game-List'
			}
		},
		computed: mapState({
			CurrentUser: state => state.CurrentUser,
			CurrentGameCollection: state => state.CurrentGameCollection,
			Games: state => state.CurrentGames
		}),
		methods: {
			onItemClick: function(e) {
				console.log(this.Title + "." + "onItemClick", e);
				let game = e;
				this.$store.commit('setCurrentGame', game);

				let page_url = "";
				if (game.Type.ButtonType == BTs.Any)
					page_url = "/pages/game/game-player-intro";
				else
					page_url = "/pages/game/game-player-ex";
				uni.reLaunch({ url: page_url });
			},
			onBackClick: function() {
				console.log(this.Title + "." + "onBackClick");
				uni.reLaunch({ url: '/pages/game/game-collection-list' });
			},
			getGameCollectionState() {
				return this.CurrentUser.GameCollectionStates.get(this.CurrentGameCollection.Id);
			},
			getGameState(game_id) {
				let parent = this.getGameCollectionState();
				if (!parent)
					return null;
				let state = parent.GameStates.get(game_id);
				return state;
			},
			getGameStateTotalPlayCount(game_id) {
				let state = this.getGameState(game_id);
				return state ? state.TotalPlayCount : 0;
			},
			getGameStateTotalPlayDuration(game_id) {
				let state = this.getGameState(game_id);
				return state ? state.TotalPlayDuration : 0;
			},
			getGameStateHighestScore(game_id) {
				let state = this.getGameState(game_id);
				return state ? state.HighestScore : 0;
			},
			getGameStateStars(game_id) {
				let state = this.getGameState(game_id);
				return state ? state.Stars: 0;
			}
		}
	}
</script>

<template>
	<view class="content">
		<view class="text-area" @click="onBackClick()">
			<text class="title">{{Title}} - {{ CurrentUser.DisplayName }} - {{ CurrentGameCollection.DisplayName }}</text>
		</view>
		<view class="uni-list">
			<block v-for="(value, index) in Games" :key="index">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="onItemClick(value)">
					<view class="uni-media-list">
						<!-- <image class="uni-media-list-logo" :src="value.Icon"></image> -->
						<view class="uni-media-list-body">
							<view class="uni-media-list-text-top">{{ value.DisplayName }}</view>
							<view class="uni-media-list-text-bottom">
								<text> *{{ getGameStateStars(value.Id) }} / #{{ getGameStateTotalPlayCount(value.Id) }} / s{{ getGameStateTotalPlayDuration(value.Id) }} / {{ value.MusicItemsCount }}</text>
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
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		/* border: 1px solid red; */
	}

		.text-area {
			display: flex;
			justify-content: center;
			/* border: 1px solid red; */
		}

			.title {
				font-size: 1em;
				/* color: #8f8f94; */
			}

		.uni-list {
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
			align-items: center;
			justify-content: center;
			min-width: 100%;
			overflow-x: scroll;
			border: 1px solid blue;
		}

			.uni-list-cell{
				/* background-color: #C0C0C0; */
				margin-left: 0.5rem;
				margin-right: 0.5rem;
				margin-top: 0.5rem;
				margin-bottom: 0.5rem;
			}

				.uni-media-list-logo {
					width: 2rem;
					height: 2rem;
				}

				.uni-media-list-body {
					height: auto;
					justify-content: space-around;
					border: 1px solid blue;
                    padding: 0.5em 0.5em 0.5em;
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
						/* border: 1px solid red; */
					}

</style>
