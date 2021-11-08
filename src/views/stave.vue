<script module="stave" lang="renderjs">
	import { MusicItem } from '../store/game-model.js'
	import { MITs, GameTypes } from '../store/game-content.js'

	import Vex from 'vexflow';
	const VF = Vex.Flow;

    export default {
		data() {
			return {
				container: null,
				renderer: null,
				staveNotes: new Array() // array of VF.StaveNote
			}
		},
		// 注意,keySig在调用者的html赋值时写成key-sig赋值, 在组件模板及代码里引用时用原始形式keySig
		// 参见：Prop Casing (camelCase vs kebab-case)
		props: {
			clef: String,
			keysig: String,
			musicItems: Array
		},
        mounted() {
        },
        methods: {
			init() {
				console.log("msg from local vexflow: ", Vex.sayHello);

				if (!this.container) {
					this.container = document.getElementById('stave-wrapper');
					// TODO CANVAS init always failed, seems we should update to latest vexflow codes to solve this issue
					// this.renderer = new VF.Renderer(this.container, VF.Renderer.Backends.CANVAS);
					this.renderer = new VF.Renderer(this.container, VF.Renderer.Backends.SVG);
					console.assert(this.renderer, "VexFlow Renderer Init Failed");
					console.log("Create VexFlow Renderer: ", this.renderer.constructor.name);
				}

				console.log("mounted: stave-wrapper size: " + this.container.offsetWidth + " x " + this.container.offsetHeight);

				console.log("stave.vue: init", this.clef, this.keysig, this.musicItems);
				console.assert(this.container);

				console.assert(this.clef == "treble" || this.clef == "bass");
				console.assert(this.keysig);
				console.assert(this.musicItems);
				console.log("props:", this.clef, this.keysig, this.musicItems);

				// 把MusicItems转换为StaveNotes
				this.staveNotes.length = 0;
				this.convertToStaveNotes();

				// render
				let width = this.container.offsetWidth;
				let height = this.container.offsetHeight;
				console.log("resized: vf.render: " + width + " x " + height);
				this.renderer.resize(width, height);

				const context = this.renderer.getContext();
				context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

				const stave = new VF.Stave(0, 0, width);
				stave.addClef(this.clef); // .addTimeSignature("4/4");
				stave.setContext(context).draw();

				VF.Formatter.FormatAndDraw(context, stave, this.staveNotes);

				// var voice = new VF.Voice({ num_beats: this.staveNotes.length, beat_value: 4});
				// voice.addTickables(this.staveNotes);
				// var formatter = new VF.Formatter().joinVoices([voice]).format([voice], width - 20);
				// voice.draw(context,stave);

				console.log("################");
				console.log("render finished");
			},
		    // change current highlighted music item to next music item,
		    // show animations according result (whether user's answner to current question is correct or not)
		    // @func <bool,Number>
		    // @return bool: false means there is no next music item.
		    next(result, new_music_item_index) {
				console.log("Switching to next... Last Result = ", result);
				console.assert(new_music_item_index >=0 && new_music_item_index <= this.staveNotes.length);

				let last_index = new_music_item_index - 1;
				let new_index = new_music_item_index;

				// update old note if exists
				if (last_index >= 0) {
					let last_stave_note = this.staveNotes[last_index];
					if (result)
						last_stave_note.setStyle({ fillStyle: "gray", strokeStyle: "gray" });
					else
						last_stave_note.setStyle({ fillStyle: "yellow", strokeStyle: "yellow" });
					last_stave_note.draw();
					console.log(last_stave_note);
				}

				// update new note if exists
				if (new_index < this.staveNotes.length) {
					let new_stave_note = this.staveNotes[new_index];
					new_stave_note.setStyle({ fillStyle: "red", strokeStyle: "red" });
					new_stave_note.draw();
					console.log(new_stave_note);
				}
		    },

			// private methods:

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
								this.staveNotes.push(note);
							}
							break;
						case MITs.PC: {
								let note = new VF.StaveNote({ keys: value.split(','), clef: this.clef, duration: "q" });
								this.staveNotes.push(note);
							}
							break;
						case MITs.AC: {
								let note = new VF.StaveNote({ keys: value.split(','), clef: this.clef, duration: "q" });
								this.staveNotes.push(note);
								console.log("not implemented yet");
							} 
							break;
						default:
							console.assert("not implemented yet");
							break;
					}
				}

				console.log("Leave convertToStaveNotes", this.staveNotes);
			}
        }
    }
</script>

<template>
	<view class="outer-wrapper">
		<view class="stave-wrapper-left"/>
		<view id="stave-wrapper" class="stave-wrapper"/>
		<!-- <canvas id="stave-wrapper" class="stave-wrapper"/> -->
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
