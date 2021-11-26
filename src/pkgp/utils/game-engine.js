import logger from '@/utils/logger.js'
import { PKs, BTs, MITs } from '@/store/game-model.js'
import { GenerateMusicItemsForGameInstance } from '@/store/game-content.js'

// this line will cause all views/* component js codes compile to nothing,
// seems it's caused by the regex strings, now disabled
import { isMiniApp } from '@/utils/global.js'

import Vex from '@/pkgp/utils/vexflow.js'
import { WeixinRenderContext } from '@/pkgp/utils/WeixinRenderContext.js'

const VF = Vex.Flow;

export function GameEngine() {
return {
    ctx: {
        staveClef: "treble",       // default clef
        staveKeysig: "C",          // default keysig
        staveDuration: "4",        // default duration is 1/4
        musicItems: [],            // random generated music items
        notes_per_music_item: 0,   // notes per music item, must be same for all music items
        vfStaveNotes: [],          // array of VF.StaveNote

        canvasSizing: { width: 0, height: 0 },// sizing of canvas
        canvasElement: null,	   // HtmlCanvasElement (id='stave-wrapper')
        vfRenderContext: null, 	   // VF.RenderContext
        vfRenderer: null,		   // new VF.Renderer(vfRenderContext)

        ac: null, //  wx.InnerAudioContext

        timer: null,               // timer for elapsed seconds 
        current_question_index: 0, // current question index
        EOF: null
    },

    destroy: function() {
        if (this.ctx.ac)
            this.ctx.ac.destroy();
        this.ctx.ac = null;
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
        logger.info("initGame: ", game);

        this.ctx.current_question_index = 0;

        this.ctx.staveClef = game.StaveClef;
        this.ctx.staveKeysig = game.StaveKeySig;
        this.ctx.staveDuration = game.StaveDuration;

        this.ctx.musicItems = GenerateMusicItemsForGameInstance(game.MusicItemsCount, game.MusicItemsGenerator);
        //logger.debug("random generated music items: ", this.ctx.musicItems);

        if (!this.ctx.ac) {
            this.ctx.ac = wx.createInnerAudioContext({ useWebAudioImplement : false });
            this.ctx.ac.autoplay = false;
            this.ctx.ac.onPlay(() => { 
                // logger.debug('play note'); 
            });
            this.ctx.ac.onError((res) => {
                logger.warn("play note error: ", res.errCode, res.errMsg);
            })
        }
   
        let _this = this;
        this.initStave(vue_this, function() {
            // start game and focus to first question
            _this.startTimer(timer_func);
            vue_this.$nextTick(function () {
                _this.toggleMusicItem(-1,true,0);
            });
        });
    },

    // return the button index (a Integer) of current question's answner
    getCurrentQuestionCorrectButtonIndex: function(button_type) {
        let music_item = this.ctx.musicItems[this.ctx.current_question_index];
        let correct_answner = music_item.TargetValue;

        let button_index = -1;

        // 特殊处理: 和弦转位基本练习按钮只包含转位0/1/2数字，不含和弦名称, 而和弦转位值被编码在答案的第一个字节
        if (button_type == BTs.CI)
            button_index = parseInt(correct_answner[0]);   // 转换成0开头的按钮索引
        // 特殊处理: 双音度数判断基本练习里只包含度数，不含度数的类型(大小纯等)
        else if (button_type == BTs.Degree)
            button_index = parseInt(correct_answner[0])-2; // 转换成0开头的按钮索引
        // 其他类型correct_answner都是一个音符值，把其转换为RN值，以便和answner(是0开头的按钮索引，亦即RN值)做比较
        else
            button_index = PKs.NoteToRN(correct_answner);
        return button_index;
    },

    playSoundEffect: function(name) { 
        logger.assert(this.ctx.ac);
        try {
            this.ctx.ac.stop();
            this.ctx.ac.src = "pkgp/static/" + name + ".mp3";
            this.ctx.ac.play();
        }catch(e) {
            logger.warn(e);
        }
    },

    // when note is empty, play error sound effect
    tryPlayNoteSoundEffect: function(note) { 
        if (note.length == 0)
            this.playSoundEffect("error");
        else {
            let an = PKs.NoteToAN(note);
            let rn = PKs.RN(an);
            let on = PKs.ON(an);
            let file = (PKs.RNtoPitchs['#'][rn] + on).replace("#","s");
            this.playSoundEffect("mkeys/"+file);
        }
    },

    // return true if game finished
    onAnswnerButtonClicked: function(vue_this, button_type, answner, game_progress) {
        //logger.debug("onAnswnerButtonClicked ===", this.ctx.current_question_index, game_progress.TotalItemCount);

        // game already finished, maybe user click too quickly
        if (this.ctx.current_question_index > game_progress.TotalItemCount - 1)
            return undefined;

        //logger.debug("onButtonClick: ", answner);

        // OK means this is an introduction game, just finish it
        if (answner == "OK")
            return true;

        //logger.debug("Your Answner to Question[" + this.ctx.current_question_index + "] = " + answner);

        // get the correct answner of current question
        let correct_button_index = this.getCurrentQuestionCorrectButtonIndex(button_type);

        //logger.debug("The Correct Answner " + this.ctx.current_question_index + " = " + correct_button_index);

         // check if user's answner correct or not
        let result = (answner === correct_button_index);
        logger.debug("Question[" + this.ctx.current_question_index + "] = " + (result ? "Right" : "Wrong") + answner + "/" + correct_button_index);

        switch(button_type) {
            case BTs.Syllable:
            case BTs.SyllableWithSF:
            case BTs.Pitch:
            case BTs.PitchWithSF: {
                logger.assert(this.ctx.ac);
                if (result) {
                    // play note sound if user answner is correct, or error sound if user answner is incorrect
                    let music_item = this.ctx.musicItems[this.ctx.current_question_index];
                    this.tryPlayNoteSoundEffect(music_item.SourceValue);
                } else {
                    this.playSoundEffect("incorrect");
                }
                break;
            }
            default:
                this.playSoundEffect(result ? "correct" : "incorrect");
                break;
        }

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
        //logger.debug("before wx.createSelectorQuery().selectAll('#the-canvas').node(...)");

        wx.createSelectorQuery().select('#the-canvas').fields({ node: true, size: true }, function (res) {
            logger.assert(res && res.node,"can't select canvas node");

            let node = res.node;
            //logger.debug("canvas sizing = ", res.width, res.height);
            //logger.debug("canvas.node sizing = ", node.width, node.height);

            // set canvas drawing surface size as same with canvas html element size if not set yet.
            if (_this.ctx.canvasSizing.width == 0 || _this.ctx.canvasSizing.height == 0) {
                let wRatio = (res.width > 800 ? 1.2 : 1);
                _this.ctx.canvasSizing.width = Math.floor(res.width / wRatio);  // NOTE: quick and dirty fix
                let hRatio = (res.height > 200 ? 1.2 : 1);
                _this.ctx.canvasSizing.height = Math.floor(res.height /hRatio); // NOTE: quick and dirty fix
                node.width = _this.ctx.canvasSizing.width; 
                node.height = _this.ctx.canvasSizing.height;

                logger.info("Resize Canvas: Element Size = " + Math.floor(res.width) + "x" + Math.floor(res.height) +", Drawing Size = " + node.width + "x" + node.height);
            }

            const crc2d = node.getContext('2d');
            logger.assert(crc2d,"can't get crc2d from ",node);
            //logger.debug("inside selectorQuery: execute drawFunc with crc2d", drawFunc);

            drawFunc(_this, crc2d, drawFuncParams);
            //logger.debug("inside selectorQuery: execute callback", callback);
            if (callback)
                callback(_this, callbackParams);
        }).exec();
        //logger.debug("after async wx.createSelectorQuery().started");
    },

    initStave: function(vue_this, callback) {
        logger.assert(this.ctx.musicItems && this.ctx.musicItems.length);

        if (!this.ctx.vfRenderContext) {
            //if (vue_this.$global.isMiniApp()) {
            if (isMiniApp())
                this.miniAppCanvasDraw(this, this.mainDrawFunc, null, callback, null);
            else {
                logger.debug("not implemented yet");
            }
        }
    },

    testDrawFunc: function(_this, crc2d, params) {
        //logger.debug("crc2d = ", crc2d);
        crc2d.moveTo(0, 0);
        crc2d.lineTo(_this.ctx.canvasSizing.width, _this.ctx.canvasSizing.height);
        crc2d.rect(10, 10, _this.ctx.canvasSizing.width-20, _this.ctx.canvasSizing.height-20);
        crc2d.stroke();
    },

    mainDrawFunc: function(_this, crc2d, params) {
        if (!_this.ctx.vfRenderer) {
            _this.ctx.vfRenderContext = new WeixinRenderContext(crc2d, _this.ctx.canvasSizing.width, _this.ctx.canvasSizing.height);
            _this.ctx.vfRenderer = new VF.Renderer(_this.ctx.vfRenderContext, VF.Renderer.Backends.CANVAS);
            //logger.debug("this.$options.vfRenderer = ", _this.ctx.vfRenderer.__proto__);
        }

        //logger.debug(_this.ctx.staveClef, _this.ctx.staveKeysig, this.ctx.staveDuration, _this.ctx.musicItems);

        // 把MusicItems转换为StaveNotes
        _this.ctx.vfStaveNotes = new Array();
        _this.convertMusicItemsToStaveNotes(_this.ctx.musicItems, _this.ctx.staveClef, _this.ctx.staveDuration, _this.ctx.vfStaveNotes);
        _this.ctx.notes_per_music_item = _this.ctx.vfStaveNotes.length / _this.ctx.musicItems.length;
        logger.assert(Number.isInteger(_this.ctx.notes_per_music_item)); // must be integer

        const context = _this.ctx.vfRenderer.getContext();
        //logger.debug("VF.Renderer.getContext() = ", context.__proto__);

        //logger.debug("stave width = ", _this.ctx.canvasSizing.width);
        const vfStave = new VF.Stave(0, Math.floor(_this.ctx.canvasSizing.height - 120)/2, _this.ctx.canvasSizing.width);
        vfStave.addClef(_this.ctx.staveClef); // .addTimeSignature("4/4");
        vfStave.setContext(context).draw();

        VF.Formatter.FormatAndDraw(context, vfStave, _this.ctx.vfStaveNotes);

        // const formatter = VF.Formatter();
        // formatter.joinVoices([voice]);
        // // const width = 250; //formatter.preCalculateMinTotalWidth([voice]);
        // const width = formatter.preCalculateMinTotalWidth([voice]);
        // formatter.format([voice]);
        // const stave = f.Stave({ y: 40, width: width + Stave.defaultPadding });
        // stave.draw();
        // voice.draw(f.getContext(), stave);
      
        // if (_this.ctx.musicItems[0].Type == MITs.AC) {
        //     var beams = VF.Beam.generateBeams(_this.ctx.vfStaveNotes);
        //     beams.forEach(function(beam) { beam.setContext(context).draw(); });
        // }

        //logger.debug("render finished");
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

        //logger.debug("Switching to next... Last Result = ", params.old_item_result);
        logger.assert(params.new_item_index >=0 && params.new_item_index <= _this.ctx.musicItems.length);
        
        // update old note(s) if exists
        if (params.old_item_index >= 0) {
            let old_notes_index_start = params.old_item_index * _this.ctx.notes_per_music_item;
            for(let i=0;i<_this.ctx.notes_per_music_item;i++) {
                let old_stave_note = _this.ctx.vfStaveNotes[old_notes_index_start+i];
                let color = (params.old_item_result ? "gray" : "red");
                old_stave_note.setStyle({ fillStyle: color, strokeStyle: color });
                old_stave_note.setContext(context).draw();
                //logger.debug(old_stave_note);
            }
        }

        // update new note(s) if exists
        if (params.new_item_index < _this.ctx.musicItems.length) {
            let new_notes_index_start = params.new_item_index * _this.ctx.notes_per_music_item;
            for(let i=0;i<_this.ctx.notes_per_music_item;i++) {
                let new_stave_note = _this.ctx.vfStaveNotes[new_notes_index_start+i];
                new_stave_note.setStyle({ fillStyle: "blue", strokeStyle: "blue" });
                new_stave_note.setContext(context).draw();
                //logger.debug(new_stave_note);
            }
        }
    },

    // convert music items to vexflow's stave note objects and append them to vfStaveNotes.
    // <Array,String,Array>
    convertMusicItemsToStaveNotes: function(music_items, stave_clef, stave_duration, vfStaveNotes) {
        logger.assert(music_items && music_items.length > 0 && vfStaveNotes && vfStaveNotes.length == 0);
        logger.debug("Enter convertMusicItemsToStaveNotes", music_items);

        for(let i=0; i<music_items.length; i++) {
            let music_item = music_items[i];
            let value = music_item.SourceValue;

            switch(music_item.Type) {
                case MITs.Note: {
                        let note = new VF.StaveNote({ keys: [ value ], clef: stave_clef, duration: stave_duration });
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
                    logger.assert("Invalid MIT");
                    break;
            }
        }

        logger.debug("Leave convertMusicItemsToStaveNotes", vfStaveNotes);
    }
};
};
