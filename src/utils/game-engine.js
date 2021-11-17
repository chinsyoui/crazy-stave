import { BTs, MITs } from '@/store/game-model.js'
import { GenerateMusicItemsForGameInstance } from '@/store/game-content.js'

import { WeixinRenderContext } from '@/utils/WeixinRenderContext.js'

// this line will cause all views/* component js codes compile to nothing,
// seems it's caused by the regex strings, now disabled
import { isMiniApp } from '@/utils/global.js'

import Vex from '@/utils/vexflow-debug.js'
const VF = Vex.Flow;

export function GameEngine() {
return {
    ctx: {
        staveClef: "treble",       // default clef
        staveKeysig: "C",          // default keysig
        musicItems: [],            // random generated music items

        vfStaveNotes: [],          // array of VF.StaveNote

        canvasSizing: { width: 640, height: 480 },// sizing of canvas
        canvasElement: null,	   // HtmlCanvasElement (id='stave-wrapper')
        vfRenderContext: null, 	   // VF.RenderContext
        vfRenderer: null,		   // new VF.Renderer(vfRenderContext)

        timer: null,               // timer for elapsed seconds 
        current_question_index: 0, // current question index
        EOF: null
    },

    stopTimer: function() {
        if (this.ctx.timer)
            clearTimeout(this.ctx.timer);
        this.ctx.timer = null;
    },

    startTimer: function(onTimer) {
        if (!this.ctx.timer)
            this.ctx.timer = setInterval( () => { onTimer() }, 1000);
    },

    initGame: function(vue_this, game, timer_func) {
        console.info("initGame: ", game);

        this.ctx.current_question_index = 0;

        this.ctx.staveClef = game.StaveClef;
        this.ctx.staveKeysig = game.StaveKeySig;

        this.ctx.musicItems = GenerateMusicItemsForGameInstance(game.MusicItemsCount, game.MusicItemsGenerator);
        console.log("random generated music items: ", this.ctx.musicItems);

        let _this = this;
        this.initStave(vue_this, function() {
            // start game and focus to first question
            _this.startTimer(timer_func);
            vue_this.$nextTick(function () {
                _this.toggleMusicItem(-1,true,0);
            });
        });
    },

    // return true if game finished
    onAnswnerButtonClicked: function(vue_this, button_type, answner, game_progress) {
        console.log("onAnswnerButtonClicked ===", this.ctx.current_question_index, game_progress.TotalItemCount);

        // game already finished, maybe user click too quickly
        if (this.ctx.current_question_index > game_progress.TotalItemCount - 1)
            return undefined;

        console.assert(answner);
        console.log("onButtonClick: ", answner);

        // OK means this is an introduction game, just finish it
        if (answner == "OK")
            return true;

        console.log("Your Answner to Question[" + this.ctx.current_question_index + "] = " + answner);

        // get the correct answner of current question
        let music_item = this.ctx.musicItems[this.ctx.current_question_index];
        let correct_answner = music_item.TargetValue;

        // 特殊处理: 
        // 和弦转位基本练习按钮只包含转位0/1/2数字，不含和弦名称, 而和弦转位值被编码在答案的第一个字节
        if (button_type == BTs.CI)
            correct_answner = correct_answner[0];
        // 特殊处理: 
        // 双音度数判断基本练习里只包含度数，不含度数的类型(大小纯等)
        if (button_type == BTs.Degree)
            correct_answner = correct_answner[0];

        console.log("The Correct Answner " + this.ctx.current_question_index + " = " + correct_answner);

        // check if user's answner correct or not
        let result = (answner.toUpperCase() === correct_answner.toUpperCase());
        console.log("You Are: " + (result ? "Right" : "Wrong"));

        // update progress
        game_progress.CompletedItemCount ++;
        game_progress.ErrorItemCount += (result ? 0 : 1);
        game_progress.Score += (result ? 10 : 0);

        // switch question: mark old item reuslt, highlight new item if exists
        this.toggleMusicItem(this.ctx.current_question_index, result, this.ctx.current_question_index + 1);
        this.ctx.current_question_index ++;
        vue_this.$store.commit('setCurrentGameItemIndex', this.ctx.current_question_index);

        // check if all questions answnered
        var eof = (this.ctx.current_question_index == game_progress.TotalItemCount);
        if (!eof)
            return false;
            
        // game finished
        this.stopTimer();
        // compute final stars
        game_progress.Stars = this.computeGameStars(game_progress);
        return true;
    },

    computeGameStars: function(game_progress) {
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
    // callback will be called after drawFunc called.
    // drawFunc = function(crc2d)
    // callback = function() can be null
    // will return canvas size as { width, height }
    miniAppCanvasDraw: function(_this, drawFunc, drawFuncParams, callback, callbackParams) {
        //console.log("before wx.createSelectorQuery().selectAll('#the-canvas').node(...)");

        wx.createSelectorQuery().selectAll('#the-canvas').node(res => {
            console.assert(res,"can't select canvas node, selectQuery return null");
            console.assert(res.length, "can't select canvas node, selectQuery return empty");
            console.assert(res[0].node,"can't select canvas node, .node not found in return of selectQuery");

            let node = res[0].node;
            _this.ctx.canvasSizing.width = node.width;
            _this.ctx.canvasSizing.height = node.height;
            const crc2d = node.getContext('2d');

            console.assert(crc2d,"can't get crc2d from ",node);
            //console.log("inside selectorQuery: execute drawFunc with crc2d", drawFunc);

            drawFunc(_this, crc2d, drawFuncParams);
            //console.log("inside selectorQuery: execute callback", callback);
            if (callback) 
                callback(_this, callbackParams);
        }).exec();
        //console.log("after async wx.createSelectorQuery().started");
    },

    initStave: function(vue_this, callback) {
        console.assert(this.ctx.musicItems && this.ctx.musicItems.length);

        console.log("msg from local vexflow: ", Vex.sayHello);
        if (!this.ctx.vfRenderContext) {
            //if (vue_this.$global.isMiniApp()) {
            if (isMiniApp()) {
                this.miniAppCanvasDraw(this, this.mainDrawFunc, null, callback, null);
            } else {
                // TODO not tested in H5 yet
                // this.ctx.canvasElement = document.getElementById("the-canvas").children[0];
                // this.ctx.vfRenderContext = this.ctx.canvasElement.getContext("2d");
                // this.initStavePhase2();
            }
        }
    },

    testDrawFunc: function(_this, crc2d, params) {
        console.log("crc2d = ", crc2d);

        crc2d.moveTo(10, 10);
        crc2d.lineTo(110, 60);
        crc2d.rect(10, 10, 200, 120);
        crc2d.stroke();
    },

    mainDrawFunc: function(_this, crc2d, params) {
        if (!_this.ctx.vfRenderer) {
            _this.ctx.vfRenderContext = new WeixinRenderContext(crc2d, _this.ctx.canvasSizing.width, _this.ctx.canvasSizing.height);
            _this.ctx.vfRenderer = new VF.Renderer(_this.ctx.vfRenderContext, VF.Renderer.Backends.CANVAS);
            console.log("this.$options.vfRenderer = ", _this.ctx.vfRenderer.__proto__);
        }

        console.log(_this.ctx.staveClef, _this.ctx.staveKeysig, _this.ctx.musicItems);

        // 把MusicItems转换为StaveNotes
        _this.ctx.vfStaveNotes = new Array();
        _this.convertMusicItemsToStaveNotes(_this.ctx.musicItems, _this.ctx.staveClef, _this.ctx.vfStaveNotes);

        const context = _this.ctx.vfRenderer.getContext();
        console.log("VF.Renderer.getContext() = ", context.__proto__);

        //context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
        context.font = "10px Arial"; context.setFillStyle("#eed");

        const vfStave = new VF.Stave(0, 0, _this.ctx.canvasSizing.width);
        vfStave.addClef(_this.ctx.staveClef); // .addTimeSignature("4/4");
        vfStave.setContext(context).draw();

        VF.Formatter.FormatAndDraw(context, vfStave, _this.ctx.vfStaveNotes);

        // var voice = new VF.Voice({ num_beats: this.$options..vfStaveNotes.length, beat_value: 4});
        // voice.addTickables(this.$options..vfStaveNotes);
        // var formatter = new VF.Formatter().joinVoices([voice]).format([voice], width - 20);
        // voice.draw(context,stave);

        console.log("render finished");
    },

    // change current highlighted music item to next music item,
    // show animations according result (whether user's answner to current question is correct or not)
    // @func <Number,bool,Number>
    // note: new_music_item_index may be out of range
    toggleMusicItem: function(old_item_index, old_item_result, new_item_index) {
        let params = { old_item_index : old_item_index, old_item_result : old_item_result, new_item_index : new_item_index };
        this.miniAppCanvasDraw(this, this.tickDrawFunc, params, null, null);
    },

    tickDrawFunc: function(_this, crc2d, params) {
        _this.ctx.vfRenderer.ctx.context2D = crc2d;
        const context = _this.ctx.vfRenderer.getContext();

        console.log("Switching to next... Last Result = ", params.old_item_result);
        console.assert(params.new_item_index >=0 && params.new_item_index <= _this.ctx.vfStaveNotes.length);

        // update old note if exists
        if (params.old_item_index >= 0) {
            let last_stave_note = _this.ctx.vfStaveNotes[params.old_item_index];
            if (params.old_item_result)
                last_stave_note.setStyle({ fillStyle: "gray", strokeStyle: "gray" });
            else
                last_stave_note.setStyle({ fillStyle: "yellow", strokeStyle: "yellow" });
            last_stave_note.setContext(context).draw();
            console.log(last_stave_note);
        }

        // update new note if exists
        if (params.new_item_index < _this.ctx.vfStaveNotes.length) {
            let new_stave_note = _this.ctx.vfStaveNotes[params.new_item_index];
            new_stave_note.setStyle({ fillStyle: "red", strokeStyle: "red" });
            new_stave_note.setContext(context).draw();
            console.log(new_stave_note);
        }
    },

    // convert music items to vexflow's stave note objects and append them to vfStaveNotes.
    // <Array,String,Array>
    convertMusicItemsToStaveNotes: function(music_items, stave_clef, vfStaveNotes) {
        console.assert(music_items && music_items.length > 0 && vfStaveNotes && vfStaveNotes.length == 0);
        console.log("Enter convertMusicItemsToStaveNotes", music_items);

        for(let i=0; i<music_items.length; i++) {
            let music_item = music_items[i];
            let value = music_item.SourceValue;

            switch(music_item.Type) {
                case MITs.Syllable:
                case MITs.Pitch:
                    console.assert("not implemented yet");
                    break;
                case MITs.Note: {
                        let note = new VF.StaveNote({ keys: [ value ], clef: stave_clef, duration: "q" });
                        if (value.includes("b"))
                            note = note.addAccidental(0, new VF.Accidental("b"));
                        if (value.includes("#"))
                            note = note.addAccidental(0, new VF.Accidental("#"));
                        vfStaveNotes.push(note);
                    }
                    break;
                case MITs.PC: {
                        let note = new VF.StaveNote({ keys: value.split(','), clef: stave_clef, duration: "q" });
                        vfStaveNotes.push(note);
                    }
                    break;
                case MITs.AC: {
                        let note = new VF.StaveNote({ keys: value.split(','), clef: stave_clef, duration: "q" });
                        vfStaveNotes.push(note);
                        console.log("not implemented yet");
                    } 
                    break;
                default:
                    console.assert("not implemented yet");
                    break;
            }
        }

        console.log("Leave convertMusicItemsToStaveNotes", vfStaveNotes);
    }
};
};
