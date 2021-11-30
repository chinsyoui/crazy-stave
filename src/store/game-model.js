import logger from '@/utils/logger.js'
import { ObjectMap } from "@/utils/ObjectMap.js"

// 术语及缩写：
// 唱名 Syllable Name (可省略Name后缀) 写做1234567但读作(DoReMiFaSolLaXi)
// 音名 Pitch Name (可省略Name后缀) 即CDEFGAB
// 音符 Note
// 度数 Degree
// 和弦 Chord
// 八度 Octave = O
// 紧凑型 Compact = C
// 柱式 Pillar = P
// 分解 Arpeggio = A
// 三和弦 Traid Chord = TC
// 大三和弦 Major Traid Chord = MajTC
// 小三和弦 Minor Traid Chord = MinTC
// 和弦转位 Chord Inversion = CI
// 柱式和弦 Pillar Chord = PC
// 分解和弦 Arpeggio Chord = AC
// 升降号 Accidental = SF (Sharp & Flat)
// 白键 WhiteKey = WK
// 黑键 BlackKey = BK
// 全部黑白键 FullKeys = FK
// 音乐项 MusicItem = MI
// 音乐项的类型 MusicItemTyp = MIT
// 练习的类型 GameType = GT
// 练习集 GameCollection = GC

// NOTE: 和弦字符串中不要有空格。
// NOTE: 音符要用大写，否则有时会和升降号用中的b分不清。

// 钢琴88个键的编号：
// 键所在八度的编号[0~9]    ON(octave number)   = (int)(AN/12)
// 键的八度内相对编号[0~11] RN(relative number) = AN 'mod' 12
// 键的绝对位置编号[9~96]   AN(absolute number) = (ON-1)*12+RN
// 音符的标准音名表示法: C/4, D#/3, Fb/2  (斜杠/的后面为八度编号)
// 度数表示法: 5x, 其中x为: p=纯, m=减/小, M=增/大
export const PKs = { // PKs = PianoKeys
    // TODO: 理论上，每个大小调的转换表都不一样
    PitchToSyllables: { "C": 1, "D": 2, "E": 3, "F": 4, "G": 5, "A": 6, "B": 7 },
    SyllableToPitchs: [ "C", "D", "E", "F", "G", "A", "B"],

    // 转换表：键的相对位置->音名，黑键用#或者为b
    RNtoPitchs: {
        "@" : ['C',' ','D',' ','E','F',' ','G',' ','A',' ','B'],
        "#" : ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
        "b" : ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']
    },
    PitchToRNs: { "C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11 },

    // 转换表：度数表示法->键的绝对位置的差
    DegreeToDistances: { '1p' : 0, '2m' : 1, '2M' : 2, '3m' : 3, '3M' :  4, '4m' :  5, '4M' :  6,
                         '5m' : 6, '5p' : 7, '6m' : 8, '6M' : 9, '7m' : 10, '7M' : 11, '8p' : 12 },

    ON: function(AN) { return Math.floor(AN/12); },
    RN: function(AN) { return AN % 12; },
    AN: function(ON,RN) { return ON*12+RN; },

    // 五个黑键的RN值
    BlackRNs: [1,3,6,8,10],
    // 七个白键的RN值
    WhiteRNs: [0,2,4,5,7,9,11],

    // get the pitch name part of standard note notation (eg. Db/4 -> Db)
    getPitchName: function(note) {
        return note.substring(0,note.indexOf('/'));
    },

    // 将音符(标准音名表示法)转换为其AN值
    NoteToAN: function(note) {
        logger.assert(note && (note.length == 3 || note.length == 4));
        let RN = PKs.PitchToRNs[note[0]];
        let accidental = 0;
        if (note.length == 4) // has accidental
            accidental = (note[1] == '#') ? 1 : ((note[1] == 'b') ? -1 : 0);
        let ON = note.charCodeAt(note.length-1) - 48; // '0' = 48
        let AN = PKs.AN(ON,RN);
        //logger.debug("NoteToAN", note, RN, accidental, ON, AN);
        return AN;
    },

    // 将音符(C/Db等)转换为其RN值, 音符可选包含八度编号(eg. Db Db/2都行)
    NoteToRN: function(note) {
        logger.assert(note && (note.length > 0));
        let RN = PKs.PitchToRNs[note[0]];
        let accidental = 0;
        if (note.length > 1) // has accidental
            accidental = (note[1] == '#') ? 1 : ((note[1] == 'b') ? -1 : 0);
        return (RN + accidental + 12) % 12;
    },

    // 将AN值转换为音符的标准音名表示法，因为会出现同音多名，因此需要时会采用符合指定升降号的名称。
    // accidental: "#","b","@"(at符号表示不期望出现升降号)
    ANtoNote: function(AN, accidental) {
        logger.assert(AN >=10 && AN <=97);

        let ON = PKs.ON(AN);
        let RN = PKs.RN(AN);
        let baseWithAccidental = PKs.RNtoPitchs[accidental][RN];
        let octave = String.fromCharCode(ON + 48); // '0' = 48
        let note = baseWithAccidental + "/" + octave;
        //logger.debug("ANtoNote", AN, ON, RN, baseWithAccidental, octave, note);
        return note;
    },

    // 以一个音符为基础，生成指定度数(向上)的新的音符。
    // 音符均使用用标准音名表示法, 度数使用标准度数表示法。
    // accidental 表示如果遇到同音多名时使用哪个名称。
    NewNote: function(base_note, degree, accidental) {
        let AN = PKS.NoteToAN(base_note) + PKs.DegreeToDistances[degree];
        return PKs.ANtoNote(AN, accidental);
    }
};

// 谱号
export const Keysigs = {
    // 大调音阶的RN值递进关系(距前一个音)
    majorDistances: [ 2,2,1,2,2,2,1 ],  // 全全半全全全半
    // 大调音阶的RN值递进关系(距根音)
    majorDistancesToRootPitch: [ 2,4,5,7,9,11,12 ], 
    // 小调音阶的RN值递进关系(距前一个音)
    minorDistances: [ 2,1,2,2,1,2,2 ],  // 全半全全半全全
    // 小调音阶的RN值递进关系(距根音)
    minorDistancesToRootPitch: [ 2,3,5,7,8,10,12 ], 

    // 带#号的大调
    sMajors: ["G","D","A","E","B","F#","C#"],
    // 带b号的大调
    fMajors: ["F","Bb","Eb","Ab","Db","Gb","Cb"],

    // 带#号的小调
    sMinors: ["Dm","Gm","Cm","Fm","Bbm","Ebm","Abm"],
    // 带b号的小调
    fMinors: ["Em","Bm","F#m","C#m","G#m","D#m","A#m"],

    // 获取所有大调的调号
    getAllMajorKeysigs: function() {
        return ["C", ...this.sMajors, ...this.fMajors];
    },

    // 获取所有小调的调号
    getAllMinorKeysigs: function() {
        return ["Am", ...this.sMinors, ...this.fMinors];
    },

    // 获取某个调式的信息: 大调还是小调, 根音名，升降号，升降音名的数组
    getKeysigInfo: function(keysig) {
        return {
            isMinor: (keysig.indexOf("m") >= 0),
            rootPitch: (keysig.indexOf("m") >= 0) ? keysig.substring(0, keysig.length - 1) : keysig,
            acc: this.getKeysigAcc(keysig),
            accPitchs: this.getKeysigAccPitchs(keysig)
        }
    },

    // 获取某个调号的升降号: #或b, @表示无升降号
    getKeysigAcc: function(keysig) {
        if (keysig == "C" || keysig == "Am")
            return "@"; // 表示无升降号

        let isMinor = (keysig[keysig.length-1] == "m");
        if (isMinor) {
            let index = this.sMinors.indexOf(keysig);
            return (index >= 0 ? "#" : "b");
        } else {
            let index = this.sMajors.indexOf(keysig);
            return (index >= 0 ? "#" : "b");
        }
    },

    // 获取某个调号的根音的音名
    getKeysigRootPitch(keysig) {
        let isMinor = (keysig.indexOf("m") >= 0);
        let startPitch = isMinor ? keysig.substring(0, keysig.length - 1) : keysig;
        return startPitch;
    },

    // 获取某个调号对应的升降音的音名的字符串数组，空数组表示该调无升降音。
    getKeysigAccPitchs: function(keysig) {
        // Vex.Flow.getKeySignatures() -> { F: { acc: 'b', num: 1 } ... }
        // Vex.Flow.keySignature("F") -> { acc: "b", num: 1 }
        // Vex.Flow.keySignature("Ebm") -> { acc: "b", num: 5 }

        const keysigAccs = { 
            '#' : [ "F","C","G","D","A","E","B" ],
            'b' : [ "B","E","A","D","G","C","F" ]
        };

        if (keysig == "C" || keysig == "Am")
            return [];

        let isMinor = (keysig[keysig.length-1] == "m");
        let index = -1;
        if (isMinor) {
            index = this.sMinors.indexOf(keysig);
            if (index >= 0)
                return keysigAccs['#'].slice(0,index+1);
            index = this.fMinors.indexOf(keysig);
            if (index >= 0)
                return keysigAccs['b'].slice(0,index+1);
        } else {
            index = this.sMajors.indexOf(keysig);
            if (index >= 0)
                return keysigAccs['#'].slice(0,index+1);
            index = this.fMajors.indexOf(keysig);
            if (index >= 0)
                return keysigAccs['b'].slice(0,index+1);
        }

        logger.assert(false,"invalid keysig");
        return [];
    },

    // 获取某个调号对应的音名组成的音阶，不含八度编号. 
    // eg. F -> F G A Bb C D E
    getKeysigScalePitchs: function(keysig) {
        let acc = this.getKeysigAcc(keysig);
        let isMinor = (keysig.indexOf("m") >= 0);
        let startPitch = isMinor ? keysig.substring(0, keysig.length - 1) : keysig;

        let pitchs = new Array();
        let an = PKs.NoteToAN(startPitch + "/4");  // 随便用一个八度编号做为开始
        for(let i=0;i<7;i++) {
            pitchs.push(PKs.getPitchName(PKs.ANtoNote(an,acc)));
            an += (isMinor ? this.minorDistances[i] : this.majorDistances[i]);
        }
        return pitchs;
    },

    // 获取某个调号对应的音阶，包含八度编号，以指定的八度编号开始
    // eg. F,2 -> F/2 G/2 A/2 Bb/2 C/3 D/3 E/3
    getKeysigScaleNotes: function(keysig, octave) {
        let acc = this.getKeysigAcc(keysig);
        let isMinor = (keysig.indexOf("m") >= 0);
        let startPitch = isMinor ? keysig.substring(0, keysig.length - 1) : keysig;

        let notes = new Array();
        let an = PKs.NoteToAN(startPitch + "/" + octave);
        for(let i=0;i<7;i++) {
            notes.push(PKs.ANtoNote(an,acc));
            an += (isMinor ? this.minorDistances[i] : this.majorDistances[i]);
        }
        return notes;
    }
};

// TCT = TraidChordType
// type: can be maj,min,aug,dim
export const TCTs = {
    // 各个和弦中音的距离关系(RN值)
    distances: {
        compact: {    // 紧凑型,三个键
            '0' : {   // 原位
                maj: [0,4,7],
                min: [0,3,7],
                aug: [0,4,8],
                dim: [0,3,6]
            },
            '1' : {   // 第一转位
                maj: [4,7,12],
                min: [3,7,12],
                aug: [4,8,12],
                dim: [3,6,12]
            },
            '2' : {   // 第二转位
                maj: [7,12,16],
                min: [7,12,15],
                aug: [8,12,16],
                dim: [6,12,15]
            }
        },
        octave: {    // 紧凑型,四个键(第四音为最低音的高八度音)
            '0' : {
                maj: [0,4,7,12],
                min: [0,3,7,12],
                aug: [0,4,8,12],
                dim: [0,3,6,12]
            },
            '1' : {
                maj: [4,7,12,16],
                min: [3,7,12,15],
                aug: [4,8,12,16],
                dim: [3,6,12,15]
            },
            '2' : {
                maj: [7,12,16,19],
                min: [7,12,15,19],
                aug: [8,12,16,20],
                dim: [6,12,15,18]
            }
        }
    }
};

// MIT = Music Item Type
export const MITs = {
	Note: 4,        // one stave note
	PC: 5,          // multiple stave note in a pillar chord
	AC: 6           // multiple stave note in arpeggio chord, optionally under one beam line
};

// user press button to choose their answner for current question,
// there are many different type of button sets, buttons in each set are same type,
// @enum ButtonType = Number

// here are all button types we supported.
// @enum 注释掉的是已经设计好但当前不支持的
export const BTs = {
	Any: 0,							 // 任意按钮，用于介绍性界面
	Syllable: 2,					 // 钢琴键盘一组12个，7个白键上显示唱名
	SyllableWithSF : 3,		 		 // 钢琴键盘一组12个，12个键上都显示唱名
	Pitch: 5,						 // 钢琴键盘一组12个，7个白键上显示音名
	PitchWithSF: 6,			 		 // 钢琴键盘一组12个，12个键上都显示音名
	Degree: 10,						 // 两个音符之间的度数，常用的有2/3/4/5/6/7/8度(不分大小度)
	CI: 11,				 			 // 三和弦转位, 有0/1/2三种
	WKOnlyTC: 20,      				 // 钢琴键盘一组12个，7个白键上显示三和弦名称(不带转位): C,Dm,Em,F,G,Am,B°
	// WKOnlyWithCI: 21,      			 // 21个只包含白键的三和弦钮,以及转位
	WKRootMajTC: 22, 				 // 钢琴键盘一组12个，7个白键上显示三和弦名称(不带转位): C,D,E,F,G,A,B
	// WKRootMajTCWithCI: 23, 			 // 21个以白键为根音的大三和弦,以及转位
	// WKRootMinTC: 24, 			     // 7个以白键为根音的小三和弦,不带转位: Cm,Dm,Em,Fm,Gm,Am,Bm
	// WKRootMinTCWithCI: 25, 			 // 21个以白键为根音的小三和弦,以及转位
	// FKRootMajTC: 26,   				 // 12个大三和弦,不带转位: C,C#/Db,D,D#/Eb,E,F,F#/Gb,G,G#/Ab,A,A#/Bb,B/Cb
	// FKRootMajTCWithCI: 27,   		 // 36个大三和弦,带转位: C,C#/Db,D,D#/Eb,E,F,F#/Gb,G,G#/Ab,A,A#/Bb,B/Cb
	// FKRootMinTC: 28,   			     // 12个小三和弦按钮,不带转位: Cm,C#m/Dbm,Dm,D#m/Ebm,Em,Fm,F#m/Gbm,Gm,G#m/Abm,Am,A#m/Bbm,Bm/Cbm
	// WKRootMajTCWithCI: 30, 			// 所有以白键位根音的大三和弦按钮，带转位，共21个
	// FKRootMajTCWithCI: 31,   	// 所有大三和弦按钮，带转位，共36个
	// FingeringType: 50,			// 12个指法按钮(三和弦的紧凑型及八度型): 左手531/521/542/532/321, 右手135/125/123/124/245
	EOF: 99,

    // check if button type is one of 12 piano key.
    IsPK: function(button_type) {
        return button_type in [ BTs.Syllable, BTs.SyllableWithSF, BTs.Pitch, BTs.PitchWithSF, BTs.WKOnlyTC, BTs.WKRootMajTC ];
    }
};

// a music item is a question that user can answner.
// each music item has a type, source value is displayed to user,
// target is used to match the answner, which is hidden to user.
//@class <Number, String, String>
export function MusicItem(type, source_value, target_value) {
	this.Type = type;
	this.SourceValue = source_value;
	this.TargetValue = target_value;
};

// a game is one collection of simillar questions (music items),
// user answner each question by same set of buttons.
// each type of game contains a unique id, a display name and zeor to multiple buttons.
// note some special games are introduction usage which don't have any buttons.
//@class <String, String, Number>
export function GameType(id, display_name, button_type) {
	this.Id = id;
	this.DisplayName = display_name;
	this.ButtonType = button_type;
};

// 一个五线谱练习游戏，有:
//   一个ID/名称,
//   一个类型，同时关联指定了MusicItem的类型及按钮的类型ButtonType
//   一个谱号，一个调号，一个音符时长(1/2/4/8/16/32)
//   一个MusicItem的总个数，以及一个用来生成MusicItem的生成器
// 当练习游戏开始时，将用该生成器来随机生成实际游戏中的音乐项。
//@class <Number, GameType, String, String, String, String, String, Number, String>
export function Game(id, type, display_name, description, stave_clef, stave_keysig, stave_duration, music_items_count, music_items_generaor) {
	this.Id = id;
	this.Type = type;
	this.DisplayName = display_name;
    this.Description = description;
	this.StaveClef = stave_clef;
	this.StaveKeySig = stave_keysig;
    this.StaveDuration = stave_duration;
	this.MusicItemsCount = music_items_count;
	this.MusicItemsGenerator = music_items_generaor;
};

// a game collection contains a set of games, 
// and a unique id, a display name, a description, and an icon.
//@class <Number, String, String, String, Game[]>
export function GameCollection(id, display_name, description, icon, games) {
	this.Id = id;
	this.DisplayName = display_name;
	this.Description = description;
	this.Icon = icon;
	this.Games = games;
};

// a game state stores one user's play statistics and state for one game.
// how many times user played this game, how many duration elapsed when play this game, 
// the highest score in one game play, how many stars earns in this game.
//@class <Number, Number, Number, Number>
export function GameState(total_play_count, total_play_duration, highest_score, stars) {
	this.TotalPlayCount = total_play_count;
	this.TotalPlayDuration = total_play_duration;
	this.HighestScore = highest_score;
	this.Stars = stars;
};

// a game collection state.
// @class <Number, Number, ObjectMap<Number,GameState>>
// @param current_game_id: latest/current played game's id
// @param stars: total stars user earned in corresponding GameCollection
// @param game_states: a ObjectMap <GameId, GameState> stores played games' states
export function GameCollectionState(current_game_id, stars, game_states) {
	this.CurrentGameId = current_game_id;
	this.Stars = stars;
	this.GameStates = game_states;
};

// game progess store current playing game's progress,
// once a game is completed, will update to game state.
//@class <Number, Number, Number, Number, Number, Number>
export function GameProgress(total_item_count, completed_item_count, error_item_count, elapsed_seconds, score, stars) {
	this.TotalItemCount = total_item_count;
	this.CompletedItemCount = completed_item_count;
	this.ErrorItemCount = error_item_count;
	this.ElapsedSeconds = elapsed_seconds;
	this.Score = score;
	this.Stars = stars;
};

export function SetGameProgress(game_progress,
	total_item_count, completed_item_count, error_item_count, elapsed_seconds, score, stars) {
	game_progress.TotalItemCount = total_item_count;
	game_progress.CompletedItemCount = completed_item_count;
	game_progress.ErrorItemCount = error_item_count;
	game_progress.ElapsedSeconds = elapsed_seconds;
	game_progress.Score = score;
	game_progress.Stars = stars;
};

// user (aka. the game player, the user that answner questions, etc).
// each user have a unique id, a display name, a icon, its own game collections and play states.
// @class (Number, String, String, GameCollection[], Number, ObjectMap<Number,GameCollectionState>)
// @param game_collections: array of game collections for this user, include both predefined game collections and custom defined game collections
// @param current_game_collection_id: latest/current played game collection's id
// @param game_collection_states: a ObjectMap<GameCollectionId, GameCollectionState> stores played game collections' states
export function User(id, display_name, icon, game_collections, current_game_collection_id, game_collection_states) {
	this.Id = id;
	this.DisplayName = display_name;
	this.Icon = icon;
	this.GameCollections = game_collections;
	this.CurrentGameCollectionId = current_game_collection_id;
	this.GameCollectionStates = game_collection_states;
    // patch: mp-weixin: vue template can't found 'size’ property in this.GameCollectionStates, don't know why, just fix it
    this.GameCollectionStatesSize = this.GameCollectionStates.mapItemsCount;
};

export function NewUserFromJo(jo) {
    let gcStates = new ObjectMap();
    gcStates.loadFromJo(jo.GameCollectionStates, (value) => {
        let game_states = new ObjectMap();
        game_states.loadFromJo(value.GameStates, null);
        let gcState = new GameCollectionState(value.CurrentGameId,value.Stars,game_states);
        return gcState;
    });
    let user = new User(jo.Id,jo.DisplayName,jo.Icon,jo.GameCollections,jo.CurrentGameCollectionId,gcStates);
    return user;
};
