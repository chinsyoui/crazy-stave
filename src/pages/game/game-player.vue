<script>
	import { mapState, mapMutations, mapActions } from 'vuex'
	import { BTs, GameProgress, RandomGenerateMusicItems } from '@/store/game-model.js'

	export default {
		// custom reactive fields here
		data() {
			return {
				Title: 'Game-Player',
				Timer: null,
				MusicItems: []   // random generated music items
			}
		},

		// mapped reactive fields here
		computed: mapState({
			CurrentUser: state => state.CurrentUser,
			CurrentGameCollection: state => state.CurrentGameCollection,
			CurrentGame: state => state.CurrentGame,
			CurrentGameProgress: state => state.CurrentGameProgress,
			CurrentGameItemIndex: state => state.CurrentGameItemIndex,
			StaveClef: state => state.CurrentGame.StaveClef,
			StaveKeySig: state => state.CurrentGame.StaveKeySig,
			CGBT: state => state.CurrentGame.Type.ButtonType,
			TheBTs: state => BTs
		}),

        mounted() {
			// mounted does not guarantee that all child components have also been mounted，this way can make sure it.
			this.$nextTick(function () {
				this.onEntireViewRendered();
		  })
		},
		methods: {
			onEntireViewRendered() {
				console.log("CurrentGame = ", this.CurrentGame);
				console.assert(this.CGBT != BTs.Any);

				// FIXME find a way to get Canvas for vexflow
				if (!this.$global.isMiniApp())
					this.container = document.getElementById('questions-wrapper');

				console.log("mounted: questions-wrapper = ", this.container);
				console.log("mounted: questions-wrapper size: " + this.container.offsetWidth + " x " + this.container.offsetHeight);

				let musicItems = RandomGenerateMusicItems(this.CurrentGame.MusicItemsCount, this.CurrentGame.TemplateMusicItems);
				// note: here we push all items to this.MusicItems because you cann't change vue component's reference,
				// otherwise the 'v-bind' will be disconnected.
				this.MusicItems.length = 0;
				this.MusicItems.push(...musicItems);  // TODO Array.push... may have performance issues
				console.log("random generated music items: ", this.MusicItems);

				this.$refs.stave.init();

				// start game and focus to first question
				this.Timer = setInterval( () => { this.onTimer() }, 1000);
				this.$refs.stave.next(true, this.CurrentGameItemIndex);
			},

			onButtonClick: function(value) {
				console.assert(value);
				console.log(this.Title + "." + "onButtonClick: ", value);
				let answner = value;

				// OK means this is an introduction game, just finish it
				if (answner == "OK") {
					this.onGameFinished();
					this.navigateBack();
				} else {
					this.onAnswnerSubmitted(answner);
				}
			},
			onAnswnerSubmitted: function(answner) {
				console.log("Your Answner " + this.CurrentGameItemIndex + " = " + answner);

				// get the correct answner of current question
				let music_item = this.MusicItems[this.CurrentGameItemIndex];
				let correct_answner = music_item.TargetValue;

				// 特殊处理: 
				// 和弦转位基本练习按钮只包含转位0/1/2数字，不含和弦名称, 而和弦转位值被编码在答案的第一个字节
				if (this.CGBT == BTs.CI)
					correct_answner = music_item.TargetValue.at(0);

				console.log("The Correct Answner " + this.CurrentGameItemIndex + " = " + correct_answner);

				// check if user's answner correct or not
				let result = (answner.toUpperCase() === correct_answner.toUpperCase());
				console.log("You Are: " + (result ? "Right" : "Wrong"));

				// update progress
				this.CurrentGameProgress.CompletedItemCount ++;
				this.CurrentGameProgress.ErrorItemCount += (result ? 0 : 1);
				this.CurrentGameProgress.Score += (result ? 10 : 0);

				// switch to next question
				this.$store.commit('setCurrentGameItemIndex', this.CurrentGameItemIndex + 1);
				this.$refs.stave.next(result, this.CurrentGameItemIndex);

				// check if all questions answnered
				var eof = (this.CurrentGameItemIndex == this.CurrentGameProgress.TotalItemCount);
				if (!eof)
					return;

				// game completed
				if (this.Timer)
					clearTimeout(this.Timer);
				this.Timer = null;

				// compute stars
				this.CurrentGameProgress.Stars = this.computeGameStars(this.CurrentGameProgress);

				// show game score
				console.log("show game score dialog");
				let msg = "用时" + this.CurrentGameProgress.ElapsedSeconds + "秒" +
						  ", 错误: " + this.CurrentGameProgress.ErrorItemCount +
						  ", 得分: " + this.CurrentGameProgress.Score +
						  ", 星星: " + this.CurrentGameProgress.Stars;

				const parent = this;
				uni.showModal({ title: "游戏结束", content: msg, showCancel: false, confirmText: "下一关" ,
					complete: function (res) {
						console.log("game score dialog closed");
						// report game score and close
						console.log("Prepare for next level: onGameFinished & navigateBack");
						parent.onGameFinished();
						parent.navigateBack();
					}
				});
			},
			onTimer: function() {
				this.CurrentGameProgress.ElapsedSeconds ++;
			},
			onGameFinished: function() {
				this.$store.commit('onGameFinished', this.CurrentGameProgress);
			},
			navigateBack: function() {
				uni.reLaunch({ url: '/pages/game/game-list' });
			},
			onBackClick: function() {
				// TODO show modal dialog to let user confirm here
				// game stopped
				if (this.Timer)
					clearTimeout(this.Timer);
				this.Timer = null;
				this.navigateBack();
			},
			computeGameStars(game_progress) {
				if (game_progress.TotalItemCount > game_progress.CompletedItemCount)
					return 0;
				let error_percent = (parseFloat(game_progress.ErrorItemCount) / parseFloat(game_progress.TotalItemCount));
				if (error_percent == 0)
					return 3;
				if (error_percent < 0.05)
					return 2;
				if (error_percent < 0.1)
					return 1;
				return 0;
			}
		},
	}
</script>

<template>
	<view class="content">
		<view class="outermost-top-bar"/>
		<view class="title-wrapper" @click="onBackClick()">
			<text class="title">{{Title}} - {{ CurrentUser.DisplayName }} - {{ CurrentGameCollection.DisplayName }} - {{ CurrentGame.DisplayName }}</text>
		</view>

		<view class="game-progress-bar" >
			<view class="game-progress-text-item">
				<text class="progress-text">Progress: {{ CurrentGameProgress.CompletedItemCount }} / {{ CurrentGameProgress.TotalItemCount }}</text>
			</view>
			<view class="game-progress-text-item">
				<text class="progress-text">Errors: {{ CurrentGameProgress.ErrorItemCount }}</text>
			</view>
			<view class="game-progress-text-item">
				<text class="progress-text">Elapsed: {{ CurrentGameProgress.ElapsedSeconds }}s</text>
			</view>
			<view class="game-progress-text-item">
				<text class="progress-text">Score: {{ CurrentGameProgress.Score }}</text>
			</view>
		</view>
		<view id="questions-wrapper" class="questions-wrapper">
			<stave ref="stave" class="stave" v-bind:clef="StaveClef" v-bind:keysig="StaveKeySig" v-bind:music-items="MusicItems"/>
		</view>
		<block>
			<ButtonListSyllables v-if="CGBT==TheBTs.Syllable" class="button-list" v-on:buttonClick="onButtonClick"/>
			<ButtonListPitchs v-if="CGBT==TheBTs.Pitch" class="button-list" v-on:buttonClick="onButtonClick"/>
			<ButtonListPitchs v-if="CGBT==TheBTs.WKRootMajTC" class="button-list" v-on:buttonClick="onButtonClick"/>
			<ButtonListDegrees v-if="CGBT==TheBTs.Degree" class="button-list" v-on:buttonClick="onButtonClick"/>
			<ButtonListCi v-if="CGBT==TheBTs.CI" class="button-list" v-on:buttonClick="onButtonClick"/>
			<ButtonListPitchsWithSf v-if="CGBT==TheBTs.PitchWithSF" class="button-list" v-on:buttonClick="onButtonClick"/>
			<ButtonListWkOnlyTcs v-if="CGBT==TheBTs.WKOnlyTC" class="button-list" v-on:buttonClick="onButtonClick"/>
		</block>
		<view class="outermost-bottom-bar"/>
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

		.outermost-top-bar {
			height: 2rem;
		}

		.title-wrapper {
			display: flex;
			flex-wrap: nowrap;
			justify-content: center;
			border: 1px solid red;
		}

			.title {
				text-overflow: ellipsis;
				font-size: 1em;
				color: #8f8f94;
				border: 1px solid red;
			}

		.introduction {
			margin: 3em 3em;
			font-size: 1em;
		}

		.game-progress-bar {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: center;
			align-items: center;
			height: 3rem;
			background-color: #F0AD4E;
			border: 1px solid red;
		}

			.game-progress-text-item {
				padding-left: 1rem;
				padding-right: 1rem;
			}

				.progress-text {
					text-overflow: ellipsis;
					font-size: 1em;
					color: #F1F1F1;
					border: 1px solid red;
				}

		.questions-wrapper {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			width: 100%;
/* 			height: 100%; */
			flex-grow: 1;
			border: 1px solid red;
		}

			.stave {
/* 				width: 100%;
				height: 100%;
				flex-grow: 1;
 */				border: 1px solid red;
			}

		.button-list {
			// nothing to do now
		}

		.outermost-bottom-bar {
			height: 2rem;
		}
</style>
