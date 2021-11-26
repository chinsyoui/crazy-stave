<script>
	import { mapState } from 'vuex'
    import { sleep } from "@/utils/global.js"
    import logger from '@/utils/logger.js'
    import ModalDlg from "@/views/modal-dlg.vue"
	import { BTs } from '@/store/game-model.js'
	
    import ButtonListKeys from "@/pkgp/views/button-list-keys.vue"
    import ButtonListDegrees from "@/pkgp/views/button-list-degrees.vue"
    import ButtonListCi from "@/pkgp/views/button-list-ci.vue"

    import { GameEngine } from '@/pkgp/utils/game-engine.js'

	export default {
        ge: null,

        components: {
            ModalDlg,
            ButtonListKeys,
            ButtonListDegrees,
            ButtonListCi
        },

		// custom reactive fields here
		data() {
			return {                
				Title: '视谱练习',

                ShowModalDlg: false,
                GameResultText: "",
                GameResultDlgButtons: [],
                ShowHintCalled: false,   // whether showHint of current question called or not
                LastButtonClickTime: -1, // elapsed seconds

                ButtonTexts: {
                    'ns' : ['1','','2','','3','4','','5','','6','','7'],
                    'ps' : ['C','','D','','E','F','','G','','A','','B'],
                    'nl' : ['1','1#/2b','2','2#/3b','3','4','4#/5b','5','5#/6b','6','6#/7b','7'],
                    'pl' : ['C','C#/Db','D','D#/Eb','E','F','F#/Gb','G','G#/Ab','A','A#/Bb','B'],
                    'WKOnlyTCs' : ['C','','Dm','','Em','F','','G','','Am','','Bsus'],
                    'WKRootMajTCs' : ['C','','D','','E','F','','G','','A','','B']
                }
			}
		},

		// mapped reactive fields here
		computed: {
            ...mapState({
                CurrentUser: state => state.CurrentUser,
                CurrentGameCollection: state => state.CurrentGameCollection,
                CurrentGame: state => state.CurrentGame,
                CurrentGameIndex: state => state.CurrentGameIndex,
                CurrentGameProgress: state => state.CurrentGameProgress,
                CGBT: state => state.CurrentGame.Type.ButtonType,
                TheBTs: state => BTs,
    		})
        },

        onReady() {
            this.$options.ge = new GameEngine();
            this.$nextTick(function () {
				this.onEntireViewRendered();
		    });
		},

        onUnload() {
            // note onUnload happens after back, we just do cleanup
            this.$options.ge.stopTimer();
            this.$options.ge.destroy();
        },

        methods: {
			onEntireViewRendered: function() {
				logger.info("onEntireViewRendered: CurrentGame = ", this.CurrentGame);
				logger.assert(this.CGBT != BTs.Any);
                this.$options.ge.initGame(this, this.CurrentGame, this.onTimer);
			},

			onTimer: function() {
				this.CurrentGameProgress.ElapsedSeconds ++;

                //logger.debug("tick", this.CurrentGameProgress.ElapsedSeconds - this.LastButtonClickTime);
                if (!this.ShowHintCalled && this.CurrentGameProgress.ElapsedSeconds - this.LastButtonClickTime >= 3) {
                    this.ShowHintCalled = true;
                    this.$refs.buttons.showHint(this.$options.ge.getCurrentQuestionCorrectButtonIndex(this.CGBT));
                }
			},

            getGameResultDisplayString: function(gp) {
                let msg = "得分: " + gp.Score + " \n(用时" + gp.ElapsedSeconds + "秒, 错误 " + gp.ErrorItemCount + "个)";
                switch(gp.Stars) {
                    case 1:
                        return "加油: ★   "+ msg;
                    case 2:
                        return "不错: ★★  " + msg;
                    case 3:
                        return "完美: ★★★ " + msg;
                    default:
                        return "请继续努力 " + msg;
                }
            },

			onButtonClick: function(value) {
                // reset hint flags
                this.LastButtonClickTime = this.CurrentGameProgress.ElapsedSeconds;
                this.ShowHintCalled = false;

                let eof = this.$options.ge.onAnswnerButtonClicked(this, this.CGBT, value, this.CurrentGameProgress);
                if (eof) {
                    sleep(1000).then(()=>{
                    // game finished, record final progress
    				this.$store.commit('onGameFinished', this.CurrentGameProgress);

                    this.GameResultText = this.getGameResultDisplayString(this.CurrentGameProgress);
                    if (this.CurrentGameIndex >= this.CurrentGameCollection.Games.length-1) 
                        this.GameResultDlgButtons = [ { Text : "返回", Value: "back"}, { Text : "再来一遍", Value: "again"} ];
                    else
                        this.GameResultDlgButtons = [ { Text : "返回", Value: "back"}, { Text : "再来一遍", Value: "again"}, { Text : "下一个", Value: "next"} ];
                    this.showGameResultDialog();

                    let sf = (this.CurrentGameProgress.Stars > 0 ? "winning" : "failed");
                    this.$options.ge.playSoundEffect(sf);
                    });
                }
			},

            showGameResultDialog: function() {
                this.ShowModalDlg = true;
			},

            onModalDlgClick: function(e) {
				logger.debug("onModalDlgClick", e);
                this.ShowModalDlg = false;

                switch(e) {
                    case "back":
        				this.navigateBack();
                        break;
                    case "again":
                        this.$store.dispatch("replayCurrentGame");
                        break;
                    case "next":
                        this.$store.dispatch("navigateToNextGame");
                        break;
                }
            },

            onBackClick: function() {
				// game stopped
                this.$options.ge.stopTimer();
				this.navigateBack();
			},

            navigateBack: function() {
                uni.navigateBack();
			}
		}
	}
</script>

<template>
	<view class="content">
        <ModalDlg v-if="ShowModalDlg" @click="onModalDlgClick" v-bind:buttons="GameResultDlgButtons">
            <template v-slot:title>练习结束</template>
            <template v-slot:body>{{ GameResultText }}</template>
        </ModalDlg>

        <view style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%;">
            <view class="left-bar" style="width: 46px; height: 100%;"/>
            <view class="title-wrapper" style="" @click="onBackClick()">
                <text class="title">{{ CurrentGameCollection.DisplayName }} - {{ CurrentGame.DisplayName }}</text>
            </view>
            <view class="middle-bar" style="flex-grow: 1; width: 50px; height: 100%;"/>
            <view class="game-progress-bar" @click="onBackClick()">
                <view class="game-progress-text-item">
                    <text class="progress-text">进度: {{ CurrentGameProgress.CompletedItemCount }} / {{ CurrentGameProgress.TotalItemCount }}</text>
                </view>
                <view class="game-progress-text-item">
                    <text class="progress-text">错误: {{ CurrentGameProgress.ErrorItemCount }}</text>
                </view>
                <view class="game-progress-text-item">
                    <text class="progress-text">用时: {{ CurrentGameProgress.ElapsedSeconds }}s</text>
                </view>
                <view class="game-progress-text-item">
                    <text class="progress-text">得分: {{ CurrentGameProgress.Score }}</text>
                </view>
            </view>
            <view class="right-bar" style="width: 46px; height: 100%;"/>
        </view>
		<view id="questions-wrapper" class="questions-wrapper">
            <view class="outer-wrapper" style="flex-grow: 1; display: flex; flex-direction: row;">
                <view class="left-bar" style="width: 50px; height: 100%;"/>
                <canvas z-index="-1" type="2d" id="the-canvas" canvas-id="the-canvas" class="the-canvas" style="display: inline-block; box-sizing: border-box; border: 1px solid gray; min-height: 100px; width: 100%; height: 100%;"/>
                <view class="right-bar" style="width: 50px; height: 100%;"/>
            </view>
		</view>
        <view class="button-list-wrapper">
		<block>
            <ButtonListKeys ref="buttons" v-if="CGBT==TheBTs.Syllable" class="button-list" v-on:buttonClick="onButtonClick" v-bind:Texts="ButtonTexts['ns']" />
            <ButtonListKeys ref="buttons" v-if="CGBT==TheBTs.SyllableWithSF" class="button-list" v-on:buttonClick="onButtonClick" v-bind:Texts="ButtonTexts['nl']" />
            <ButtonListKeys ref="buttons" v-if="CGBT==TheBTs.Pitch" class="button-list" v-on:buttonClick="onButtonClick" v-bind:Texts="ButtonTexts['ps']" />
            <ButtonListKeys ref="buttons" v-if="CGBT==TheBTs.PitchWithSF" class="button-list" v-on:buttonClick="onButtonClick" v-bind:Texts="ButtonTexts['pl']" />

            <ButtonListKeys ref="buttons" v-if="CGBT==TheBTs.WKOnlyTC" class="button-list" v-on:buttonClick="onButtonClick" v-bind:Texts="ButtonTexts['WKOnlyTCs']" />
            <ButtonListKeys ref="buttons" v-if="CGBT==TheBTs.WKRootMajTC" class="button-list" v-on:buttonClick="onButtonClick" v-bind:Texts="ButtonTexts['WKRootMajTCs']" />

			<ButtonListDegrees ref="buttons" v-if="CGBT==TheBTs.Degree" class="button-list" v-on:buttonClick="onButtonClick"/>
			<ButtonListCi ref="buttons" v-if="CGBT==TheBTs.CI" class="button-list" v-on:buttonClick="onButtonClick"/>
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
	}

			.title {
                padding-right: 10px;
    			white-space: nowrap;
				text-overflow: ellipsis;
				font-size: 1em;
				color: black;
			}

		.game-progress-bar {
			height: 2rem;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: center;
			align-items: center;
			background-color: white;
		}

			.game-progress-text-item {
				padding-left: 1rem;
				padding-right: 1rem;
			}

				.progress-text {
    			    white-space: nowrap;
					text-overflow: ellipsis;
					font-size: 1em;
					color: black;
				}

		.questions-wrapper {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			width: 100%;
			flex-grow: 1;
		}
</style>
