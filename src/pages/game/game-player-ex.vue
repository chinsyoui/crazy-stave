<script>
    import ButtonListSyllables from "@/views/button-list-syllables.vue"
    import ButtonListPitchs from "@/views/button-list-pitchs.vue"
    import ButtonListDegrees from "@/views/button-list-degrees.vue"
    import ButtonListCi from "@/views/button-list-ci.vue"
    import ButtonListPitchsWithSf from "@/views/button-list-pitchs-with-sf.vue"
    import ButtonListWkOnlyTcs from "@/views/button-list-wk-only-tcs.vue"

	import { mapState } from 'vuex'
	import { BTs } from '@/store/game-model.js'
	import { GameEngine } from '@/utils/game-engine.js'

	export default {
        ge: null,

        components: {
            ButtonListSyllables,
            ButtonListPitchs,
            ButtonListDegrees,
            ButtonListCi,
            ButtonListPitchsWithSf,
            ButtonListWkOnlyTcs
        },

		// custom reactive fields here
		data() {
			return {
				Title: '视谱练习'
			}
		},

		// mapped reactive fields here
		computed: mapState({
			CurrentUser: state => state.CurrentUser,
			CurrentGameCollection: state => state.CurrentGameCollection,
			CurrentGame: state => state.CurrentGame,
			CurrentGameProgress: state => state.CurrentGameProgress,
			CGBT: state => state.CurrentGame.Type.ButtonType,
			TheBTs: state => BTs
		}),

        onReady() {
            this.$options.ge = new GameEngine();
            this.$nextTick(function () {
				this.onEntireViewRendered();
		    });
		},

        onUnload() {
            console.log("onUnload", this);
            // note onUnload happens after back, we just do cleanup
            this.$options.ge.stopTimer();
        },

        methods: {
			onEntireViewRendered: function() {
				console.info("onEntireViewRendered: CurrentGame = ", this.CurrentGame);
				console.assert(this.CGBT != BTs.Any);
                this.$options.ge.initGame(this, this.CurrentGame, this.onTimer);
			},

			onButtonClick: function(value) {
                let eof = this.$options.ge.onAnswnerButtonClicked(this, this.CGBT, value, this.CurrentGameProgress);
                if (eof) {
                    // game finished, record final progress
    				this.$store.commit('onGameFinished', this.CurrentGameProgress);
                    // show game reusult to user and ask user what to do next
                    this.showGameResultDialog(this.onGameResultDlgCallback);
                }
			},

            showGameResultDialog: function(callback) {
				console.log("show game result dialog");
				let msg = "用时" + this.CurrentGameProgress.ElapsedSeconds + "秒" +
						  ", 错误: " + this.CurrentGameProgress.ErrorItemCount +
						  "\n得分: " + this.CurrentGameProgress.Score +
						  ", 星星: " + this.CurrentGameProgress.Stars;

				uni.showModal({ title: "游戏结束", content: msg, showCancel: false, confirmText: "下一关" ,
					complete: function (res) { callback(res); }
				});
			},

            onGameResultDlgCallback: function(ret) {
                console.log("game result dialog closed");
                this.navigateBack();
            },

			onTimer: function() {
				this.CurrentGameProgress.ElapsedSeconds ++;
			},

            navigateBack: function() {
				//uni.navigateTo({ url: '/pages/game/game-list' });
                uni.navigateBack();
			},

            onBackClick: function() {
				// game stopped
                this.$options.ge.stopTimer();
				this.navigateBack();
			}

			// resizeCanvas: function() {
			// 	let width = this.$options.canvasSizing.width;
			// 	let height = this.$options.canvasSizing.height;
			// 	console.log("resizing canvas to: " + width + " x " + height);

			// 	const devicePixelRatio = window.devicePixelRatio || 1;

			// 	// Scale the canvas size by the device pixel ratio
			// 	// this.$options.canvasElement.width = width * devicePixelRatio;
			// 	// this.$options.canvasElement.height = height * devicePixelRatio;
			// 	// this.$options.canvasElement.style.width = width + 'px';
			// 	// this.$options.canvasElement.style.height = height + 'px';

			// 	this.$options.vfRenderContext.scale(devicePixelRatio, devicePixelRatio);
			// }
		}
	}
</script>

<template>
	<view class="content">
		<view class="outermost-top-bar"/>
		<view class="title-wrapper" @click="onBackClick()">
			<text class="title">{{Title}} - {{ CurrentGameCollection.DisplayName }} - {{ CurrentGame.DisplayName }}</text>
		</view>

		<view class="game-progress-bar" @click="onBackClick()">
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
            <view class="outer-wrapper">
                <view class="stave-wrapper-left"/>
                <canvas type="2d" id="the-canvas" canvas-id="the-canvas" class="the-canvas" style="display: inline-block; border: 1px solid black; width: 100%; height: 100%;"/>
                <view class="stave-wrapper-right"/>
            </view>
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
		/* border: 1px solid red; */
	}

		.outermost-top-bar {
			height: 0.2rem;
		}

		.title-wrapper {
			display: flex;
			flex-wrap: nowrap;
			justify-content: center;
			/* border: 1px solid blue; */
		}

			.title {
				text-overflow: ellipsis;
				font-size: 1em;
				color: #8f8f94;
				/* border: 1px solid red; */
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
			height: 2rem;
			background-color: #F0AD4E;
			border: 1px solid #FFBD8E;
		}

			.game-progress-text-item {
				padding-left: 1rem;
				padding-right: 1rem;
			}

				.progress-text {
					text-overflow: ellipsis;
					font-size: 1em;
					color: #F1F1F1;
					/* border: 1px solid red; */
				}

		.questions-wrapper {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			width: 100%;
			flex-grow: 1;
			/* border: 1px solid red; */
		}

            .outer-wrapper {
                display: flex;
                flex-direction: row;
                padding: 1px;
                flex-grow: 1;
            }

                .stave-wrapper-left {
                    width: 50rpx;
                    height: 100%;
                }

                .the-stave {}

                .stave-wrapper-right {
                    width: 50rpx;
                    height: 100%;
                }

		.button-list {}

		.outermost-bottom-bar {
			height: 2rem;
		}
</style>
