<script module="stave-module" lang="renderjs">
	import { MusicItem } from '@/store/game-model.js'
	import { MITs, GameTypes } from '@/store/game-content.js'

	import Vex from '@/utils/vexflow-debug.js';
	const VF = Vex.Flow;

    export default {
		canvasElement: null,	   // HtmlCanvasElement (id='stave-wrapper')
		crc2d: null, 			   // CanvasRenderingContext2D (canvasElement.getContext('2d'))
		vfRenderer: null,		   // new VF.Renderer(crc2d,)
		vfStaveNotes: new Array(), // array of VF.StaveNote

		data() {
			return {}
		},
		// 注意,keySig在调用者的html赋值时写成key-sig赋值, 在组件模板及代码里引用时用原始形式keySig
		// 参见：Prop Casing (camelCase vs kebab-case)
		props: {
			clef: String,
			keysig: String,
			musicItems: Array
		},
		created() {
			// console.warn("##################### stave created");
			// this.$global.objects["StaveVue"] = this;
		},
        mounted() {
			// this.$global.objects["StaveVue"] = this;
        },
        methods: {
			init() {
				console.log("msg from local vexflow: ", Vex.sayHello);

				if (!this.$options.canvasElement) {
					this.$options.canvasElement = document.getElementById('stave-wrapper').children[0];
					console.log("HtmlCanvasElement = ", this.$options.canvasElement.__proto__);
					this.$options.crc2d = this.$options.canvasElement.getContext("2d");
					//this.$options.crc2d = uni.createCanvasContext('stave-wrapper',this);
					console.log("CanvasRenderingContext2D = ", this.$options.crc2d.__proto__);

					this.$options.vfRenderer = new VF.Renderer(this.$options.crc2d, VF.Renderer.Backends.CANVAS);
					console.assert(this.$options.vfRenderer, "VexFlow Renderer Init Failed");
					console.log(" VF.Renderer = ", this.$options.vfRenderer.__proto__);
				}

				console.assert(this.$options.canvasElement);
				console.log("CanvasElement size: " + this.$options.canvasElement.offsetWidth + " x " + this.$options.canvasElement.offsetHeight);

				console.log("stave.vue: init", this.clef, this.keysig, this.musicItems);
				console.assert(this.clef == "treble" || this.clef == "bass");
				console.assert(this.keysig);
				console.assert(this.musicItems);
				console.log("props:", this.clef, this.keysig, this.musicItems);

				// 把MusicItems转换为StaveNotes
				this.$options.vfStaveNotes = new Array();
				this.convertToStaveNotes();

				this.resizeCanvas();

				const context = this.$options.vfRenderer.getContext();
				console.log("VF.Renderer.getContext() = ", context.__proto__);

				//context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
				context.font = "10px Arial";
				context.setFillStyle("#eed");

				const vfStave = new VF.Stave(0, 0, this.$options.canvasElement.offsetWidth);
				vfStave.addClef(this.clef); // .addTimeSignature("4/4");
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
		    next(result, new_music_item_index) {
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
					last_stave_note.draw();
					console.log(last_stave_note);
				}

				// update new note if exists
				if (new_index < this.$options.vfStaveNotes.length) {
					let new_stave_note = this.$options.vfStaveNotes[new_index];
					new_stave_note.setStyle({ fillStyle: "red", strokeStyle: "red" });
					new_stave_note.draw();
					console.log(new_stave_note);
				}
		    },

			// private methods:
			resizeCanvas() {
				let width = this.$options.canvasElement.offsetWidth;
				let height = this.$options.canvasElement.offsetHeight;
				console.log("resizing canvas to: " + width + " x " + height);

				const devicePixelRatio = window.devicePixelRatio || 1;

				// Scale the canvas size by the device pixel ratio
				this.$options.canvasElement.width = width * devicePixelRatio;
				this.$options.canvasElement.height = height * devicePixelRatio;
				this.$options.canvasElement.style.width = width + 'px';
				this.$options.canvasElement.style.height = height + 'px';

				this.$options.crc2d.scale(devicePixelRatio, devicePixelRatio);
			},

			// add music items to vexflow's stave object
			convertToStaveNotes() {
				console.log("Enter convertToStaveNotes", this.musicItems);

				for(let i=0; i<this.musicItems.length; i++) {
					let music_item = this.musicItems[i];
					console.assert(music_item instanceof MusicItem);
					let value = music_item.SourceValue;

					switch(music_item.Type) {
						case MITs.Syllable:
						case MITs.Pitch:
							console.assert("not implemented yet");
							break;
						case MITs.Note: {
								let note = new VF.StaveNote({ keys: [ value ], clef: this.clef, duration: "q" });
								if (value.includes("b"))
									note = note.addAccidental(0, new VF.Accidental("b"));
								if (value.includes("#"))
									note = note.addAccidental(0, new VF.Accidental("#"));
								this.$options.vfStaveNotes.push(note);
							}
							break;
						case MITs.PC: {
								let note = new VF.StaveNote({ keys: value.split(','), clef: this.clef, duration: "q" });
								this.$options.vfStaveNotes.push(note);
							}
							break;
						case MITs.AC: {
								let note = new VF.StaveNote({ keys: value.split(','), clef: this.clef, duration: "q" });
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
	<view class="outer-wrapper">
		<view class="stave-wrapper-left"/>
		<canvas id="stave-wrapper" class="stave-wrapper"/>
		<view class="stave-wrapper-right"/>
	</view>
</template>

<style scoped>
	.outer-wrapper {
		display: flex;
		flex-direction: row;
		padding: 1px;
		flex-grow: 1;
		font-size: 14px;
		line-height: 24px;
	}

		.stave-wrapper-left {
			width: 50rpx;
			height: 100%;
		}

		.stave-wrapper {
			flex-grow: 1;
			padding: 1px;
			font-size: 14px;
			line-height: 24px;
		}

		.stave-wrapper-right {
			width: 50rpx;
			height: 100%;
		}

</style>
