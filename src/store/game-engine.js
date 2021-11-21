import { BTs, MITs } from '@/store/game-model.js'
import { GenerateMusicItemsForGameInstance } from '@/store/game-content.js'

import { WeixinRenderContext } from '@/utils/WeixinRenderContext.js'

// this line will cause all views/* component js codes compile to nothing,
// seems it's caused by the regex strings, now disabled
import { isMiniApp } from '@/utils/global.js'

import Vex from '@/utils/vexflow.js'
const VF = Vex.Flow;

export function GameEngine() {
return {
    ctx: {
        staveClef: "treble",       // default clef
        staveKeysig: "C",          // default keysig
        musicItems: [],            // random generated music items
        notes_per_music_item: 0,   // notes per music item, must be same for all music items
        vfStaveNotes: [],          // array of VF.StaveNote

        canvasSizing: { width: 0, height: 0 },// sizing of canvas
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
        //console.log("random generated music items: ", this.ctx.musicItems);

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
        //console.log("onAnswnerButtonClicked ===", this.ctx.current_question_index, game_progress.TotalItemCount);

        // game already finished, maybe user click too quickly
        if (this.ctx.current_question_index > game_progress.TotalItemCount - 1)
            return undefined;

        console.assert(answner);
        //console.log("onButtonClick: ", answner);

        // OK means this is an introduction game, just finish it
        if (answner == "OK")
            return true;

        //console.log("Your Answner to Question[" + this.ctx.current_question_index + "] = " + answner);

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

        //console.log("The Correct Answner " + this.ctx.current_question_index + " = " + correct_answner);

         // check if user's answner correct or not
        let result = (answner.toUpperCase() === correct_answner.toUpperCase());
        console.log("Question[" + this.ctx.current_question_index + "] = " + (result ? "Right" : "Wrong"));

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
        if (game_progress.CompletedItemCount < game_progress.TotalItemCount)
            return 0;
        if (game_progress.ErrorItemCount == 0)
            return 3;
        if (game_progress.ErrorItemCount == 1)
            return 2;
        if (game_progress.ErrorItemCount == 2)
            return 1;
        return 0;
    },

    /////////////////////////////////////
    /* stave related methods following */ 

    // async run canvas draw func under mp-weixin,
    // callback will be called after drawFunc called.
    // drawFunc = function(crc2d, drawFuncParams)
    // callback = function(callbackParams), can be null
    miniAppCanvasDraw: function(_this, drawFunc, drawFuncParams, callback, callbackParams) {
        //console.log("before wx.createSelectorQuery().selectAll('#the-canvas').node(...)");

        wx.createSelectorQuery().select('#the-canvas').fields({ node: true, size: true }, function (res) {
            console.assert(res && res.node,"can't select canvas node");

            let node = res.node;
            //console.log("canvas sizing = ", res.width, res.height);
            //console.log("canvas.node sizing = ", node.width, node.height);

            // set canvas drawing surface size as same with canvas html element size if not set yet.
            if (_this.ctx.canvasSizing.width == 0 || _this.ctx.canvasSizing.height == 0) {
                _this.ctx.canvasSizing.width = res.width / 1.5;  // NOTE: quick and dirty fix
                _this.ctx.canvasSizing.height = res.height / 2;  // NOTE: quick and dirty fix
                node.width = _this.ctx.canvasSizing.width; 
                node.height = _this.ctx.canvasSizing.height;
            }

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

        //console.log("msg from local vexflow: ", Vex.sayHello);
        if (!this.ctx.vfRenderContext) {
            //if (vue_this.$global.isMiniApp()) {
            if (isMiniApp())
                this.miniAppCanvasDraw(this, this.mainDrawFunc, null, callback, null);
            else {
                console.log("not implemented yet");
            }
        }
    },

    testDrawFunc: function(_this, crc2d, params) {
        //console.log("crc2d = ", crc2d);
        crc2d.moveTo(0, 0);
        crc2d.lineTo(_this.ctx.canvasSizing.width, _this.ctx.canvasSizing.height);
        crc2d.rect(10, 10, _this.ctx.canvasSizing.width-20, _this.ctx.canvasSizing.height-20);
        crc2d.stroke();
    },

    mainDrawFunc: function(_this, crc2d, params) {
        if (!_this.ctx.vfRenderer) {
            _this.ctx.vfRenderContext = new WeixinRenderContext(crc2d, _this.ctx.canvasSizing.width, _this.ctx.canvasSizing.height);
            _this.ctx.vfRenderer = new VF.Renderer(_this.ctx.vfRenderContext, VF.Renderer.Backends.CANVAS);
            //console.log("this.$options.vfRenderer = ", _this.ctx.vfRenderer.__proto__);
        }

        //console.log(_this.ctx.staveClef, _this.ctx.staveKeysig, _this.ctx.musicItems);

        // 把MusicItems转换为StaveNotes
        _this.ctx.vfStaveNotes = new Array();
        _this.convertMusicItemsToStaveNotes(_this.ctx.musicItems, _this.ctx.staveClef, _this.ctx.vfStaveNotes);
        _this.ctx.notes_per_music_item = _this.ctx.vfStaveNotes.length / _this.ctx.musicItems.length;
        console.assert(Number.isInteger(_this.ctx.notes_per_music_item)); // must be integer

        const context = _this.ctx.vfRenderer.getContext();
        //console.log("VF.Renderer.getContext() = ", context.__proto__);

        //console.log("stave width = ", _this.ctx.canvasSizing.width);
        const vfStave = new VF.Stave(0, 0, _this.ctx.canvasSizing.width);
        vfStave.addClef(_this.ctx.staveClef); // .addTimeSignature("4/4");
        vfStave.setContext(context).draw();

        VF.Formatter.FormatAndDraw(context, vfStave, _this.ctx.vfStaveNotes);
        //console.log("render finished");
    },

    // change style of current music item (according if user's answner correct or not), and highlight next music item.
    // @func <Number,bool,Number>
    // note: if index of (old or new) music item doesn't exist, we just ignore it.
    toggleMusicItem: function(old_item_index, old_item_result, new_item_index) {
        let params = { old_item_index : old_item_index, old_item_result : old_item_result, new_item_index : new_item_index };
        this.miniAppCanvasDraw(this, this.tickDrawFunc, params, null, null);
    },

    // draw music item of one tick (one question/answner)
    tickDrawFunc: function(_this, crc2d, params) {
        _this.ctx.vfRenderer.ctx.context2D = crc2d;
        const context = _this.ctx.vfRenderer.getContext();

        //console.log("Switching to next... Last Result = ", params.old_item_result);
        console.assert(params.new_item_index >=0 && params.new_item_index <= _this.ctx.musicItems.length);
        
        // update old note(s) if exists
        if (params.old_item_index >= 0) {
            let old_notes_index_start = params.old_item_index * _this.ctx.notes_per_music_item;
            for(let i=0;i<_this.ctx.notes_per_music_item;i++) {
                let old_stave_note = _this.ctx.vfStaveNotes[old_notes_index_start+i];
                let color = (params.old_item_result ? "gray" : "red");
                old_stave_note.setStyle({ fillStyle: color, strokeStyle: color });
                old_stave_note.setContext(context).draw();
                console.log(old_stave_note);
            }
        }

        // update new note(s) if exists
        if (params.new_item_index < _this.ctx.musicItems.length) {
            let new_notes_index_start = params.new_item_index * _this.ctx.notes_per_music_item;
            for(let i=0;i<_this.ctx.notes_per_music_item;i++) {
                let new_stave_note = _this.ctx.vfStaveNotes[new_notes_index_start+i];
                new_stave_note.setStyle({ fillStyle: "blue", strokeStyle: "blue" });
                new_stave_note.setContext(context).draw();
                console.log(new_stave_note);
            }
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
                        let keys = value.split(',');
                        for(let key of keys) {
                            let note = new VF.StaveNote({ keys: [key], clef: stave_clef, duration: "q" });
                            vfStaveNotes.push(note);
                        }
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
