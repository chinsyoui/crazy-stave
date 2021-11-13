<script>
	import { mapState } from 'vuex'

    import ButtonListSyllables from "@/views/button-list-syllables.vue";
    import ButtonListPitchs from "@/views/button-list-pitchs.vue";
    import ButtonListDegrees from "@/views/button-list-degrees.vue";
    import ButtonListCi from "@/views/button-list-ci.vue";
    import ButtonListPitchsWithSf from "@/views/button-list-pitchs-with-sf.vue";
    import ButtonListWkOnlyTcs from "@/views/button-list-wk-only-tcs.vue";

	import { MusicItem, BTs } from '@/store/game-model.js'
	import { MITs, GenerateMusicItemsForGameInstance } from '@/store/game-content.js'

    import { WeixinRenderContext } from '@/utils/WeixinRenderContext.js'

	import Vex from '@/utils/vexflow-debug.js';
	const VF = Vex.Flow;

	export default {
		canvasElement: null,	   // HtmlCanvasElement (id='stave-wrapper')
		vfRenderContext: null, 	   // VF.RenderContext
		vfRenderer: null,		   // new VF.Renderer(vfRenderContext)
		vfStaveNotes: new Array(), // array of VF.StaveNote
        canvasSizing: { width: 640, height: 480 },// sizing of canvas
        staveClef: "treble",       // default clef
        staveKeysig: "C",          // default keysig
		musicItems: [],            // random generated music items

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
				Title: 'Game-Player',
				Timer: null,
			}
		},

		// mapped reactive fields here
		computed: mapState({
			CurrentUser: state => state.CurrentUser,
			CurrentGameCollection: state => state.CurrentGameCollection,
			CurrentGame: state => state.CurrentGame,
			CurrentGameProgress: state => state.CurrentGameProgress,
			CurrentGameItemIndex: state => state.CurrentGameItemIndex,
			CGBT: state => state.CurrentGame.Type.ButtonType,
			TheBTs: state => BTs
		}),

        onReady() {
			// mounted does not guarantee that all child components have also been mounted，this way can make sure it.
            this.$nextTick(function () {
				this.onEntireViewRendered();
		    });
		},

        onUnload() {
            console.log("onUnload", this);
            if (this.Timer)
                clearTimeout(this.Timer);
            this.Timer = null;
        },
		methods: {
			onEntireViewRendered() {
				console.info("onEntireViewRendered: CurrentGame = ", this.CurrentGame);
				console.assert(this.CGBT != BTs.Any);

                this.$options.staveClef = this.CurrentGame.StaveClef;
                this.$options.staveKeysig = this.CurrentGame.StaveKeySig;

				let musicItems = GenerateMusicItemsForGameInstance(this.CurrentGame.MusicItemsCount, this.CurrentGame.MusicItemsGenerator);
				this.$options.musicItems = musicItems;
				console.log("random generated music items: ", this.$options.musicItems);

                const _this = this;
                this.initStave(function() {
                    // start game and focus to first question
                    if (!_this.Timer)
                        _this.Timer = setInterval( () => { _this.onTimer() }, 1000);

			        _this.$nextTick(function () {
                        _this.highlightNextMusicItem(true, _this.CurrentGameItemIndex);
                    });
                });
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
				console.log("Your Answner to Question[" + this.CurrentGameItemIndex + "] = " + answner);

				// get the correct answner of current question
				let music_item = this.$options.musicItems[this.CurrentGameItemIndex];
				let correct_answner = music_item.TargetValue;

				// 特殊处理: 
				// 和弦转位基本练习按钮只包含转位0/1/2数字，不含和弦名称, 而和弦转位值被编码在答案的第一个字节
				if (this.CGBT == BTs.CI)
					correct_answner = correct_answner[0];
				// 特殊处理: 
                // 双音度数判断基本练习里只包含度数，不含度数的类型(大小纯等)
				if (this.CGBT == BTs.Degree)
					correct_answner = correct_answner[0];

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
				this.highlightNextMusicItem(result, this.CurrentGameItemIndex);

				// check if all questions answnered
				var eof = (this.CurrentGameItemIndex == this.CurrentGameProgress.TotalItemCount);
				if (!eof)
					return;

				// game completed
				if (this.Timer)
					clearInterval(this.Timer);
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
				//uni.navigateTo({ url: '/pages/game/game-list' });
                uni.navigateBack();
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
			},

            /////////////////////////////////////
            /* stave related methods following */ 

            // async run canvas draw func under mp-weixin,
            // callback will be called after drawFunc called
            miniAppCanvasDraw(drawFunc, callback) {
                console.info("before wx.createSelectorQuery().selectAll('#the-canvas').node(...)");
                wx.createSelectorQuery().selectAll('#the-canvas').node(res => {
                    console.assert(res,"can't select canvas node, selectQuery return null");
                    console.assert(res.length, "can't select canvas node, selectQuery return empty");
                    console.assert(res[0].node,"can't select canvas node, .node not found in return of selectQuery");

                    let node = res[0].node;
                    this.$options.canvasSizing.width = node.width;
                    this.$options.canvasSizing.height = node.height;
                    const crc2d = node.getContext('2d');
                    console.assert(crc2d,"can't get crc2d from ",node);
                    console.info("inside selectorQuery: execute drawFunc with crc2d", drawFunc);
                    drawFunc(crc2d);
                    console.info("inside selectorQuery: execute callback", callback);
                    if (callback) 
                        callback();
                }).exec();
                console.info("after async wx.createSelectorQuery().started");
            },

			initStave(callback) {
                console.assert(this.$options.musicItems && this.$options.musicItems.length);

				console.log("msg from local vexflow: ", Vex.sayHello);
				if (!this.$options.vfRenderContext) {
                    if (this.$global.isMiniApp()) {
                        //this.miniAppCanvasDraw(this.testDrawSomething);
                        this.miniAppCanvasDraw(this.initStavePhase2,callback);
                    } else {
                        // TODO not tested in H5 yet
    					this.$options.canvasElement = document.getElementById("the-canvas").children[0];
					    this.$options.vfRenderContext = this.$options.canvasElement.getContext("2d");
                        this.initStavePhase2();
                    }
                }
            },

            testDrawSomething(crc2d) {
                console.log("crc2d = ", crc2d);

                crc2d.moveTo(10, 10);
                crc2d.lineTo(110, 60);
                crc2d.rect(10, 10, 200, 120);
                crc2d.stroke();
            },
 
            initStavePhase2(crc2d) {
                if (!this.$options.vfRenderer) {
                    this.$options.vfRenderContext = new WeixinRenderContext(crc2d, this.$options.canvasSizing.width, this.$options.canvasSizing.height);
                    this.$options.vfRenderer = new VF.Renderer(this.$options.vfRenderContext, VF.Renderer.Backends.CANVAS);
                    console.log("this.$options.vfRenderer = ", this.$options.vfRenderer.__proto__);
                }

				console.log(this.$options.staveClef, this.$options.staveKeysig, this.$options.musicItems);

				// 把MusicItems转换为StaveNotes
				this.$options.vfStaveNotes = new Array();
				this.convertToStaveNotes();

				const context = this.$options.vfRenderer.getContext();
				console.log("VF.Renderer.getContext() = ", context.__proto__);

				//context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
				context.font = "10px Arial"; context.setFillStyle("#eed");

				const vfStave = new VF.Stave(0, 0, this.$options.canvasSizing.width);
				vfStave.addClef(this.$options.staveClef); // .addTimeSignature("4/4");
				vfStave.setContext(context).draw();

				VF.Formatter.FormatAndDraw(context, vfStave, this.$options.vfStaveNotes);

				// var voice = new VF.Voice({ num_beats: this.$options..vfStaveNotes.length, beat_value: 4});
				// voice.addTickables(this.$options..vfStaveNotes);
				// var formatter = new VF.Formatter().joinVoices([voice]).format([voice], width - 20);
				// voice.draw(context,stave);

				console.log("render finished");
			},

			// change current highlighted music item to next music item,
		    // show animations according result (whether user's answner to current question is correct or not)
		    // @func <bool,Number>
		    // @return bool: false means there is no next music item.
		    highlightNextMusicItem(result, new_music_item_index) {
                this.miniAppCanvasDraw( (crc2d) => {
                this.$options.vfRenderer.ctx.context2D = crc2d;
				const context = this.$options.vfRenderer.getContext();

				console.log("Switching to next... Last Result = ", result);
				console.assert(new_music_item_index >=0 && new_music_item_index <= this.$options.vfStaveNotes.length);

				let last_index = new_music_item_index - 1;
				let new_index = new_music_item_index;

				// update old note if exists
				if (last_index >= 0) {
					let last_stave_note = this.$options.vfStaveNotes[last_index];
					if (result)
						last_stave_note.setStyle({ fillStyle: "gray", strokeStyle: "gray" });
					else
						last_stave_note.setStyle({ fillStyle: "yellow", strokeStyle: "yellow" });
					last_stave_note.setContext(context).draw();
					console.log(last_stave_note);
				}

				// update new note if exists
				if (new_index < this.$options.vfStaveNotes.length) {
					let new_stave_note = this.$options.vfStaveNotes[new_index];
					new_stave_note.setStyle({ fillStyle: "red", strokeStyle: "red" });
					new_stave_note.setContext(context).draw();
					console.log(new_stave_note);
				}
                });
		    },

            drawStaveNotes(crc2d) {
                last_stave_note
            },

			// private methods:
			resizeCanvas() {
				let width = this.$options.canvasSizing.width;
				let height = this.$options.canvasSizing.height;
				console.log("resizing canvas to: " + width + " x " + height);

				const devicePixelRatio = window.devicePixelRatio || 1;

				// Scale the canvas size by the device pixel ratio
				// this.$options.canvasElement.width = width * devicePixelRatio;
				// this.$options.canvasElement.height = height * devicePixelRatio;
				// this.$options.canvasElement.style.width = width + 'px';
				// this.$options.canvasElement.style.height = height + 'px';

				this.$options.vfRenderContext.scale(devicePixelRatio, devicePixelRatio);
			},

			// add music items to vexflow's stave object
			convertToStaveNotes() {
				console.log("Enter convertToStaveNotes", this.$options.musicItems);

				for(let i=0; i<this.$options.musicItems.length; i++) {
					let music_item = this.$options.musicItems[i];
					console.assert(music_item instanceof MusicItem);
					let value = music_item.SourceValue;

					switch(music_item.Type) {
						case MITs.Syllable:
						case MITs.Pitch:
							console.assert("not implemented yet");
							break;
						case MITs.Note: {
								let note = new VF.StaveNote({ keys: [ value ], clef: this.$options.staveClef, duration: "q" });
								if (value.includes("b"))
									note = note.addAccidental(0, new VF.Accidental("b"));
								if (value.includes("#"))
									note = note.addAccidental(0, new VF.Accidental("#"));
								this.$options.vfStaveNotes.push(note);
							}
							break;
						case MITs.PC: {
								let note = new VF.StaveNote({ keys: value.split(','), clef: this.$options.staveClef, duration: "q" });
								this.$options.vfStaveNotes.push(note);
							}
							break;
						case MITs.AC: {
								let note = new VF.StaveNote({ keys: value.split(','), clef: this.$options.staveClef, duration: "q" });
								this.$options.vfStaveNotes.push(note);
								console.log("not implemented yet");
							} 
							break;
						default:
							console.assert("not implemented yet");
							break;
					}
				}

				console.log("Leave convertToStaveNotes", this.$options.vfStaveNotes);
			}
		}
	}
</script>

<template>
	<view class="content">
		<view class="outermost-top-bar"/>
		<view class="title-wrapper" @click="onBackClick()">
			<text class="title">{{Title}} - {{ CurrentUser.DisplayName }} - {{ CurrentGameCollection.DisplayName }} - {{ CurrentGame.DisplayName }}</text>
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
