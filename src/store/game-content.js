import logger from '@/utils/logger.js'
import { PKs, BTs, MITs, MusicItem as MI, GameType as GT, Game, GameCollection as GC, User } from './game-model.js'

// @func return integer in [min, max)
function RandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
};

// functions that can create music item according specified props
// MIC = MusicItemCreator = @func MusicItemCreator: MusicItem create_func(props,index)
const MICs = {
    // ByFixedSong = by fixed string of song, Props = String with notes.
    ByFixedSong : function(props,index) {
        let notes = props.split(',');  // TODO: low performance here
        logger.assert(index >= 0 && index < notes.length);
        return new MI(MITs.Note, notes[index], PKs.getNotePart(notes[index]));
    },
    // ByFixed = use fixed music items specified by template, Props = MusicItem[]
    ByFixed : function(props,index) {
        logger.assert(index >= 0 && index < props.length);
        return props[index];
    },
    // ByST = by random select from static template of music items, Props = MusicItem[]
    ByST : function(props,index) {
        let _index = RandomInt(0,props.length);
        return props[_index];
    },
    // ByDegree = by random generate notes from a base notes and random degrees
    // Props = { MaxNote: "C/6", MIT: 4, BaseNotes: String[], Degrees: ["2m","3M","5p","8p"] }
    // 注: MIT MusicItemType，参见MITs中定义的值。
    ByDegree : function(props,index) {
        //logger.debug("ByDegree: ",props);
        let maxAN = PKs.NoteToAN(props.MaxNote);
        while(true) {
            let lowerNote = props.BaseNotes[RandomInt(0,props.BaseNotes.length)];
            let lowerNoteAN = PKs.NoteToAN(lowerNote);
            let degree = props.Degrees[RandomInt(0,props.Degrees.length)];
            let distance = PKs.DegreeToDistances[degree];
            let upperNoteAN = lowerNoteAN + distance;

            if (upperNoteAN <= maxAN) {
                let upperNote = PKs.ANtoNote(upperNoteAN,"#");
                //logger.debug(lowerNote,degree," => ",lowerNoteAN,distance,upperNoteAN,upperNote);
                let newMI = new MI(props.MIT, (lowerNote + "," + upperNote), degree);
                //logger.debug("newMI = ",newMI);
                return newMI;
            }
        };
    },
    EOF : function(props,index) { return null; }
};

// random generate count music items with specified template music items.
// @class <Props,MusicItemCreator>
// MIG = MusicItemsGenerator
function MIG(props,creator_func_name) {
    this.props = props;
    this.creator_func_name = creator_func_name;
};

const MIGs = {
    NewFixedSong: function(props) { return new MIG(props, "ByFixedSong"); },
    NewFixed: function(props) { return new MIG(props, "ByFixed"); },
    NewST: function(props) { return new MIG(props, "ByST"); },
    ///////////////////////////////////////////////////////////
    //G1: new MIG([], MICs.ByST),
    // TODO
    EOF: null
};

// random generate [count] music items by specified MusicItemGenerator for a game instance
// @func <Count, MusicItemsGenerator>
// @return MusicItem[]
export function GenerateMusicItemsForGameInstance(count, generator) {
    let items = new Array(count);
    for(var i=0; i<count; i++)
        items[i] = MICs[generator.creator_func_name](generator.props,i);
    return items;
};
  
// 一个种类的练习游戏，具有相同的ID/描述及同样一组(用来选择答案的)按钮。
// @enum <Id, DisplayName, ButtonType>
export const GameTypes = {
	Intro: new GT(0, "说明", BTs.Any),
	NoteToPitch: new GT(21, "音符到音名练习", BTs.Pitch),
	NoteToSyllable: new GT(22, "音符到唱名及数字练习", BTs.Syllable),
	NoteToPitchWithSF: new GT(23, "音符到音名练习-带升降号", BTs.PitchWithSF),
	NoteToSyllableWithSF: new GT(24, "音符到唱名练习-带升降号", BTs.SyllableWithSF),
	DoubleNoteDegree:  new GT(31, "双音度数视谱练习", BTs.Degree),
	TCCI: new GT(32, "认识三和弦的转位", BTs.CI), // 与和弦名称，只识别是哪种位置
	CPTChordsNaming: new GT(51, "紧凑型柱式三和弦视谱练习", BTs.WKOnlyTC),
	CPTChordsNaming: new GT(51, "紧凑型柱式三和弦视谱练习", BTs.WKOnlyTCWithCI),
	CATChordsNaming: new GT(52, "紧凑型分解三和弦视谱练习", BTs.WKOnlyTC),
	CATChordsNaming: new GT(52, "紧凑型分解三和弦视谱练习", BTs.WKOnlyTC),
	OPTChordsNaming: new GT(53, "八度型柱式三和弦视谱练习", BTs.WKOnlyTC),
	OPTChordsNaming: new GT(53, "八度型柱式三和弦视谱练习", BTs.WKOnlyTC),
	OATChordsNaming: new GT(54, "八度型分解三和弦视谱练习", BTs.WKOnlyTC),
	OATChordsNaming: new GT(54, "八度型分解三和弦视谱练习", BTs.WKOnlyTC),
	EOF: null
};

const GTs = GameTypes;  // a local alias of GameTypes

// 给定起止音符，生成整个序列
// accidental: "#","b","" （空表示不含升降符号)
function GenerateNotes(lower_note, upper_note, accidental) {
    //logger.debug("GenerateNotes", lower_note, upper_note, accidental);

    let lowerAN = PKs.NoteToAN(lower_note);
    let upperAN = PKs.NoteToAN(upper_note);

    //logger.debug(lowerAN,upperAN);

    let notes = new Array();
    for(let i=lowerAN; i<=upperAN; i++) {
        // if accidental is not allowed, detect and by pass
        if (!accidental || accidental.length==0) {
            let newRN = PKs.RN(i);
            if (PKs.BlackRNs.includes(newRN)) {
                //logger.debug("########### SKIP", i, newRN);
                continue;
            }
        }

        let newNote = PKs.ANtoNote(i, accidental && accidental.length == 1 ? accidental : "#");
        //logger.debug("###########", i, accidental, newNote, notes);
        notes.push(newNote);
    }

    //logger.debug(notes);
    return notes;
};

// const Easy01 = [ // 简易音符集1
// 	new MI(MITs.Note, "C/4", "C"),
// 	new MI(MITs.Note, "D/4", "D"),
// 	new MI(MITs.Note, "E/4", "E"),
// 	new MI(MITs.Note, "F/4", "F"),
// 	new MI(MITs.Note, "G/4", "G"),
// 	new MI(MITs.Note, "A/4", "A"),
// 	new MI(MITs.Note, "B/4", "B")
// ];

const O2WKs = [ // 低音谱，低八度，白键
	new MI(MITs.Note, "C/2", "C"),
	new MI(MITs.Note, "D/2", "D"),
	new MI(MITs.Note, "E/2", "E"),
	new MI(MITs.Note, "F/2", "F"),
	new MI(MITs.Note, "G/2", "G"),
	new MI(MITs.Note, "A/2", "A"),
	new MI(MITs.Note, "B/2", "B")
];

const O2WKOnlyCPTChords = [ // "低音谱，低八度，白键" 为根音及三五音的紧凑型三和弦
	new MI(MITs.PC, "C/2,E/2,G/2", "C"),
	new MI(MITs.PC, "D/2,F/2,A/2", "D"),
	new MI(MITs.PC, "E/2,G/2,B/2", "E"),
	new MI(MITs.PC, "F/2,A/2,C/3", "F"),
	new MI(MITs.PC, "G/2,B/2,D/3", "G"),
	new MI(MITs.PC, "A/2,C/3,E/3", "A"),
	new MI(MITs.PC, "B/2,D/3,F/3", "B")
];

// "低音谱，低八度，白键" 为根音及三五音的紧凑型柱式三和弦, 包括转位
// 值的格式：第一位为0/1/2转位号码,其余字符为和弦名称
const O2WKOnlyCPTChordsWithCI = [
	new MI(MITs.PC, "C/2,E/2,G/2", "0C"),
	new MI(MITs.PC, "E/2,G/2,C/3", "1C/E"),
	new MI(MITs.PC, "G/2,C/3,E/3", "2C/G"),
	new MI(MITs.PC, "D/2,F/2,A/2", "0Dm"),
	new MI(MITs.PC, "F/2,A/2,D/3", "1Dm/F"),
	new MI(MITs.PC, "A/2,D/3,F/3", "2Dm/A"),
	new MI(MITs.PC, "E/2,G/2,B/2", "0Em"),
	new MI(MITs.PC, "G/2,B/2,E/3", "1Em/G"),
	new MI(MITs.PC, "B/2,E/3,G/3", "2Em/B"),
	new MI(MITs.PC, "F/2,A/2,C/3", "0F"),
	new MI(MITs.PC, "A/2,C/3,F/3", "1F/A"),
	new MI(MITs.PC, "C/3,F/3,A/3", "2F/C"),
	new MI(MITs.PC, "G/2,B/2,D/3", "0G"),
	new MI(MITs.PC, "B/2,D/3,G/3", "1G/B"),
	new MI(MITs.PC, "D/3,G/3,B/3", "2G/D"),
	new MI(MITs.PC, "A/2,C/3,E/3", "0Am"),
	new MI(MITs.PC, "C/3,E/3,A/3", "1Am/C"),
	new MI(MITs.PC, "E/3,A/3,C/4", "2Am/E"),
	new MI(MITs.PC, "B/2,D/3,F/3", "0Bsus"),
	new MI(MITs.PC, "D/3,F/3,B/3", "1Bsus/D"),
	new MI(MITs.PC, "F/3,B/3,D/4", "2Bsus/F")
];

// "低音谱，低八度，白键" 为根音及三五音的紧凑型分解三和弦, 包括转位
// 值的格式：第一位为0/1/2转位号码,其余字符为和弦名称
const O2WKOnlyCATChordsWithCI = [
	new MI(MITs.AC, "C/2,E/2,G/2", "0C"),
	new MI(MITs.AC, "E/2,G/2,C/3", "1C/E"),
	new MI(MITs.AC, "G/2,C/3,E/3", "2C/G"),
	new MI(MITs.AC, "D/2,F/2,A/2", "0Dm"),
	new MI(MITs.AC, "F/2,A/2,D/3", "1Dm/F"),
	new MI(MITs.AC, "A/2,D/3,F/3", "2Dm/A"),
	new MI(MITs.AC, "E/2,G/2,B/2", "0Em"),
	new MI(MITs.AC, "G/2,B/2,E/3", "1Em/G"),
	new MI(MITs.AC, "B/2,E/3,G/3", "2Em/B"),
	new MI(MITs.AC, "F/2,A/2,C/3", "0F"),
	new MI(MITs.AC, "A/2,C/3,F/3", "1F/A"),
	new MI(MITs.AC, "C/3,F/3,A/3", "2F/C"),
	new MI(MITs.AC, "G/2,B/2,D/3", "0G"),
	new MI(MITs.AC, "B/2,D/3,G/3", "1G/B"),
	new MI(MITs.AC, "D/3,G/3,B/3", "2G/D"),
	new MI(MITs.AC, "A/2,C/3,E/3", "0Am"),
	new MI(MITs.AC, "C/3,E/3,A/3", "1Am/C"),
	new MI(MITs.AC, "E/3,A/3,C/4", "2Am/E"),
	new MI(MITs.AC, "B/2,D/3,F/3", "0Bsus"),
	new MI(MITs.AC, "D/3,F/3,B/3", "1Bsus/D"),
	new MI(MITs.AC, "F/3,B/3,D/4", "2Bsus/F")
];

// "低音谱，低八度，白键" 为根音及三五音的八度型柱式三和弦, 包括转位
// 值的格式：第一位为0/1/2转位号码,其余字符为和弦名称
const O2WKOnlyOPTChordsWithCI = [
	new MI(MITs.PC, "C/2,E/2,G/2,C/3", "0C"),
	new MI(MITs.PC, "E/2,G/2,C/3,E/3", "1C/E"),
	new MI(MITs.PC, "G/2,C/3,E/3,G/3", "2C/G"),
	new MI(MITs.PC, "D/2,F/2,A/2,D/3", "0Dm"),
	new MI(MITs.PC, "F/2,A/2,D/3,F/3", "1Dm/F"),
	new MI(MITs.PC, "A/2,D/3,F/3,A/3", "2Dm/A"),
	new MI(MITs.PC, "E/2,G/2,B/2,E/3", "0Em"),
	new MI(MITs.PC, "G/2,B/2,E/3,G/3", "1Em/G"),
	new MI(MITs.PC, "B/2,E/3,G/3,B/3", "2Em/B"),
	new MI(MITs.PC, "F/2,A/2,C/3,F/3", "0F"),
	new MI(MITs.PC, "A/2,C/3,F/3,A/3", "1F/A"),
	new MI(MITs.PC, "C/3,F/3,A/3,C/4", "2F/C"),
	new MI(MITs.PC, "G/2,B/2,D/3,G/3", "0G"),
	new MI(MITs.PC, "B/2,D/3,G/3,B/3", "1G/B"),
	new MI(MITs.PC, "D/3,G/3,B/3,D/4", "2G/D"),
	new MI(MITs.PC, "A/2,C/3,E/3,A/3", "0Am"),
	new MI(MITs.PC, "C/3,E/3,A/3,C/4", "1Am/C"),
	new MI(MITs.PC, "E/3,A/3,C/4,E/4", "2Am/E"),
	new MI(MITs.PC, "B/2,D/3,F/3,B/3", "0Bsus"),
	new MI(MITs.PC, "D/3,F/3,B/3,D/4", "1Bsus/D"),
	new MI(MITs.PC, "F/3,B/3,D/4,F/4", "2Bsus/F")
];

// "低音谱，低八度，白键" 为根音及三五音的八度型分解三和弦, 包括转位
// 值的格式：第一位为0/1/2转位号码,其余字符为和弦名称
const O2WKOnlyOATChordsWithCI = [
	new MI(MITs.AC, "C/2,E/2,G/2,C/3", "0C"),
	new MI(MITs.AC, "E/2,G/2,C/3,E/3", "1C/E"),
	new MI(MITs.AC, "G/2,C/3,E/3,G/3", "2C/G"),
	new MI(MITs.AC, "D/2,F/2,A/2,D/3", "0Dm"),
	new MI(MITs.AC, "F/2,A/2,D/3,F/3", "1Dm/F"),
	new MI(MITs.AC, "A/2,D/3,F/3,A/3", "2Dm/A"),
	new MI(MITs.AC, "E/2,G/2,B/2,E/3", "0Em"),
	new MI(MITs.AC, "G/2,B/2,E/3,G/3", "1Em/G"),
	new MI(MITs.AC, "B/2,E/3,G/3,B/3", "2Em/B"),
	new MI(MITs.AC, "F/2,A/2,C/3,F/3", "0F"),
	new MI(MITs.AC, "A/2,C/3,F/3,A/3", "1F/A"),
	new MI(MITs.AC, "C/3,F/3,A/3,C/4", "2F/C"),
	new MI(MITs.AC, "G/2,B/2,D/3,G/3", "0G"),
	new MI(MITs.AC, "B/2,D/3,G/3,B/3", "1G/B"),
	new MI(MITs.AC, "D/3,G/3,B/3,D/4", "2G/D"),
	new MI(MITs.AC, "A/2,C/3,E/3,A/3", "0Am"),
	new MI(MITs.AC, "C/3,E/3,A/3,C/4", "1Am/C"),
	new MI(MITs.AC, "E/3,A/3,C/4,E/4", "2Am/E"),
	new MI(MITs.AC, "B/2,D/3,F/3,B/3", "0Bsus"),
	new MI(MITs.AC, "D/3,F/3,B/3,D/4", "1Bsus/D"),
	new MI(MITs.AC, "F/3,B/3,D/4,F/4", "2Bsus/F")
];

const O2WKOnlyCATChords = [ // "低音谱，低八度，白键" 为根音及三五音的紧凑型分解三和弦
	new MI(MITs.AC, "C/2,E/2,G/2", "C"),
	new MI(MITs.AC, "D/2,F/2,A/2", "D"),
	new MI(MITs.AC, "E/2,G/2,B/2", "E"),
	new MI(MITs.AC, "F/2,A/2,C/3", "F"),
	new MI(MITs.AC, "G/2,B/2,D/3", "G"),
	new MI(MITs.AC, "A/2,C/3,E/3", "A"),
	new MI(MITs.AC, "B/2,D/3,F/3", "B")
];

const O2WKOnlyOPTChords = [ // "低音谱，低八度，白键" 为根音及三五音的八度型柱式三和弦
	new MI(MITs.PC, "C/2,G/2,C/3", "C"),
	new MI(MITs.PC, "D/2,A/2,D/3", "D"),
	new MI(MITs.PC, "E/2,B/2,E/3", "E"),
	new MI(MITs.PC, "F/2,C/3,F/3", "F"),
	new MI(MITs.PC, "G/2,D/3,G/3", "G"),
	new MI(MITs.PC, "A/2,E/3,A/3", "A"),
	new MI(MITs.PC, "B/2,F/3,B/3", "B")
];

const O2WKOnlyOATChords = [ // "低音谱，低八度，白键" 为根音及三五音的八度型分解三和弦
	new MI(MITs.AC, "C/2,G/2,C/3", "C"),
	new MI(MITs.AC, "D/2,A/2,D/3", "D"),
	new MI(MITs.AC, "E/2,B/2,E/3", "E"),
	new MI(MITs.AC, "F/2,C/3,F/3", "F"),
	new MI(MITs.AC, "G/2,D/3,G/3", "G"),
	new MI(MITs.AC, "A/2,E/3,A/3", "A"),
	new MI(MITs.AC, "B/2,F/3,B/3", "B")
];

const O3WKs = [ // 低音谱，基本八度，白键
	new MI(MITs.Note, "C/3", "C"),
	new MI(MITs.Note, "D/3", "D"),
	new MI(MITs.Note, "E/3", "E"),
	new MI(MITs.Note, "F/3", "F"),
	new MI(MITs.Note, "G/3", "G"),
	new MI(MITs.Note, "A/3", "A"),
	new MI(MITs.Note, "B/3", "B")
];

const O3WKOnlyCPTChords = [ // "低音谱，基本八度，白键" 为根音及三五音的紧凑型柱式三和弦
	new MI(MITs.PC, "C/3,E/3,G/3", "C"),
	new MI(MITs.PC, "D/3,F/3,A/3", "Dm"),
	new MI(MITs.PC, "E/3,G/3,B/3", "Em"),
	new MI(MITs.PC, "F/3,A/3,C/4", "F"),
	new MI(MITs.PC, "G/3,B/3,D/4", "G"),
	new MI(MITs.PC, "A/3,C/4,E/4", "Am"),
	new MI(MITs.PC, "B/3,D/4,F/4", "Bsus")
];

const O3WKOnlyCATChords = [ // "低音谱，基本八度，白键" 为根音及三五音的紧凑型分解三和弦
	new MI(MITs.AC, "C/3,E/3,G/3", "C"),
	new MI(MITs.AC, "D/3,F/3,A/3", "D"),
	new MI(MITs.AC, "E/3,G/3,B/3", "E"),
	new MI(MITs.AC, "F/3,A/3,C/4", "F"),
	new MI(MITs.AC, "G/3,B/3,D/4", "G"),
	new MI(MITs.AC, "A/3,C/4,E/4", "A"),
	new MI(MITs.AC, "B/3,D/4,F/4", "B")
];

const O3WKOnlyOPTChords = [ // "低音谱，基本八度，白键" 为根音及三五音的八度型柱式三和弦
	new MI(MITs.PC, "C/3,G/3,C/4", "C"),
	new MI(MITs.PC, "D/3,A/3,D/4", "D"),
	new MI(MITs.PC, "E/3,B/3,E/4", "E"),
	new MI(MITs.PC, "F/3,C/4,F/4", "F"),
	new MI(MITs.PC, "G/3,D/4,G/4", "G"),
	new MI(MITs.PC, "A/3,E/4,A/4", "A"),
	new MI(MITs.PC, "B/3,F/4,B/4", "B")
];

const O3WKOnlyOATChords = [ // "低音谱，基本八度，白键" 为根音及三五音的八度型分解三和弦
	new MI(MITs.AC, "C/3,G/3,C/4", "C"),
	new MI(MITs.AC, "D/3,A/3,D/4", "D"),
	new MI(MITs.AC, "E/3,B/3,E/4", "E"),
	new MI(MITs.AC, "F/3,C/4,F/4", "F"),
	new MI(MITs.AC, "G/3,D/4,G/4", "G"),
	new MI(MITs.AC, "A/3,E/4,A/4", "A"),
	new MI(MITs.AC, "B/3,F/4,B/4", "B")
];

const O4WKs = [ // 高音谱，基本八度，白键
	new MI(MITs.Note, "C/4", "C"),
	new MI(MITs.Note, "D/4", "D"),
	new MI(MITs.Note, "E/4", "E"),
	new MI(MITs.Note, "F/4", "F"),
	new MI(MITs.Note, "G/4", "G"),
	new MI(MITs.Note, "A/4", "A"),
	new MI(MITs.Note, "B/4", "B")
];

const O4WKOnlyCPTChords = [ // "高音谱，基本八度，白键" 为根音及三五音的紧凑型柱式三和弦
	new MI(MITs.PC, "C/4,E/4,G/4", "C"),
	new MI(MITs.PC, "D/4,F/4,A/4", "D"),
	new MI(MITs.PC, "E/4,G/4,B/4", "E"),
	new MI(MITs.PC, "F/4,A/4,C/5", "F"),
	new MI(MITs.PC, "G/4,B/4,D/5", "G"),
	new MI(MITs.PC, "A/4,C/5,E/5", "A"),
	new MI(MITs.PC, "B/4,D/5,F/5", "B")
];

// "高音谱，基本八度，白键" 为根音及三五音的紧凑型柱式三和弦, 包括转位
// 值的格式：第一位为0/1/2转位号码,其余字符为和弦名称
const O4WKOnlyCPTChordsWithCI = [
	new MI(MITs.PC, "C/4,E/4,G/4", "0C"),
	new MI(MITs.PC, "E/4,G/4,C/5", "1C/E"),
	new MI(MITs.PC, "G/4,C/5,E/5", "2C/G"),
	new MI(MITs.PC, "D/4,F/4,A/4", "0Dm"),
	new MI(MITs.PC, "F/4,A/4,D/5", "1Dm/F"),
	new MI(MITs.PC, "A/4,D/5,F/5", "2Dm/A"),
	new MI(MITs.PC, "E/4,G/4,B/4", "0Em"),
	new MI(MITs.PC, "G/4,B/4,E/5", "1Em/G"),
	new MI(MITs.PC, "B/4,E/5,G/5", "2Em/B"),
	new MI(MITs.PC, "F/4,A/4,C/5", "0F"),
	new MI(MITs.PC, "A/4,C/5,F/5", "1F/A"),
	new MI(MITs.PC, "C/5,F/5,A/5", "2F/C"),
	new MI(MITs.PC, "G/4,B/4,D/5", "0G"),
	new MI(MITs.PC, "B/4,D/5,G/5", "1G/B"),
	new MI(MITs.PC, "D/5,G/5,B/5", "2G/D"),
	new MI(MITs.PC, "A/4,C/5,E/5", "0Am"),
	new MI(MITs.PC, "C/5,E/5,A/5", "1Am/C"),
	new MI(MITs.PC, "E/5,A/5,C/6", "2Am/E"),
	new MI(MITs.PC, "B/4,D/5,F/5", "0Bsus"),
	new MI(MITs.PC, "D/5,F/5,B/5", "1Bsus/D"),
	new MI(MITs.PC, "F/5,B/5,D/6", "2Bsus/F")
];

// "高音谱，基本八度，白键" 为根音及三五音的八度型柱式三和弦, 包括转位
// 值的格式：第一位为0/1/2转位号码,其余字符为和弦名称
const O4WKOnlyOPTChordsWithCI = [
	new MI(MITs.PC, "C/4,E/4,G/4,C/5", "0C"),
	new MI(MITs.PC, "E/4,G/4,C/5,E/5", "1C/E"),
	new MI(MITs.PC, "G/4,C/5,E/5,G/5", "2C/G"),
	new MI(MITs.PC, "D/4,F/4,A/4,D/5", "0Dm"),
	new MI(MITs.PC, "F/4,A/4,D/5,F/5", "1Dm/F"),
	new MI(MITs.PC, "A/4,D/5,F/5,A/5", "2Dm/A"),
	new MI(MITs.PC, "E/4,G/4,B/4,E/5", "0Em"),
	new MI(MITs.PC, "G/4,B/4,E/5,G/5", "1Em/G"),
	new MI(MITs.PC, "B/4,E/5,G/5,B/5", "2Em/B"),
	new MI(MITs.PC, "F/4,A/4,C/5,F/5", "0F"),
	new MI(MITs.PC, "A/4,C/5,F/5,A/5", "1F/A"),
	new MI(MITs.PC, "C/5,F/5,A/5,C/6", "2F/C"),
	new MI(MITs.PC, "G/4,B/4,D/5,G/5", "0G"),
	new MI(MITs.PC, "B/4,D/5,G/5,B/5", "1G/B"),
	new MI(MITs.PC, "D/5,G/5,B/5,D/6", "2G/D"),
	new MI(MITs.PC, "A/4,C/5,E/5,A/5", "0Am"),
	new MI(MITs.PC, "C/5,E/5,A/5,C/6", "1Am/C"),
	new MI(MITs.PC, "E/5,A/5,C/6,E/6", "2Am/E"),
	new MI(MITs.PC, "B/4,D/5,F/5,B/5", "0Bsus"),
	new MI(MITs.PC, "D/5,F/5,B/5,D/6", "1Bsus/D"),
	new MI(MITs.PC, "F/5,B/5,D/6,F/6", "2Bsus/F")
];

// "高音谱，基本八度，白键" 为根音及三五音的紧凑型分解三和弦, 包括转位
// 值的格式：第一位为0/1/2转位号码,其余字符为和弦名称
const O4WKOnlyCATChordsWithCI = [
	new MI(MITs.AC, "C/4,E/4,G/4", "0C"),
	new MI(MITs.AC, "E/4,G/4,C/5", "1C/E"),
	new MI(MITs.AC, "G/4,C/5,E/5", "2C/G"),
	new MI(MITs.AC, "D/4,F/4,A/4", "0Dm"),
	new MI(MITs.AC, "F/4,A/4,D/5", "1Dm/F"),
	new MI(MITs.AC, "A/4,D/5,F/5", "2Dm/A"),
	new MI(MITs.AC, "E/4,G/4,B/4", "0Em"),
	new MI(MITs.AC, "G/4,B/4,E/5", "1Em/G"),
	new MI(MITs.AC, "B/4,E/5,G/5", "2Em/B"),
	new MI(MITs.AC, "F/4,A/4,C/5", "0F"),
	new MI(MITs.AC, "A/4,C/5,F/5", "1F/A"),
	new MI(MITs.AC, "C/5,F/5,A/5", "2F/C"),
	new MI(MITs.AC, "G/4,B/4,D/5", "0G"),
	new MI(MITs.AC, "B/4,D/5,G/5", "1G/B"),
	new MI(MITs.AC, "D/5,G/5,B/5", "2G/D"),
	new MI(MITs.AC, "A/4,C/5,E/5", "0Am"),
	new MI(MITs.AC, "C/5,E/5,A/5", "1Am/C"),
	new MI(MITs.AC, "E/5,A/5,C/6", "2Am/E"),
	new MI(MITs.AC, "B/4,D/5,F/5", "0Bsus"),
	new MI(MITs.AC, "D/5,F/5,B/5", "1Bsus/D"),
	new MI(MITs.AC, "F/5,B/5,D/6", "2Bsus/F")
];

// "高音谱，基本八度，白键" 为根音及三五音的八度型分解三和弦, 包括转位
// 值的格式：第一位为0/1/2转位号码,其余字符为和弦名称
const O4WKOnlyOATChordsWithCI = [
	new MI(MITs.AC, "C/4,E/4,G/4,C/5", "0C"),
	new MI(MITs.AC, "E/4,G/4,C/5,E/5", "1C/E"),
	new MI(MITs.AC, "G/4,C/5,E/5,G/5", "2C/G"),
	new MI(MITs.AC, "D/4,F/4,A/4,D/5", "0Dm"),
	new MI(MITs.AC, "F/4,A/4,D/5,F/5", "1Dm/F"),
	new MI(MITs.AC, "A/4,D/5,F/5,A/5", "2Dm/A"),
	new MI(MITs.AC, "E/4,G/4,B/4,E/5", "0Em"),
	new MI(MITs.AC, "G/4,B/4,E/5,G/5", "1Em/G"),
	new MI(MITs.AC, "B/4,E/5,G/5,B/5", "2Em/B"),
	new MI(MITs.AC, "F/4,A/4,C/5,F/5", "0F"),
	new MI(MITs.AC, "A/4,C/5,F/5,A/5", "1F/A"),
	new MI(MITs.AC, "C/5,F/5,A/5,C/6", "2F/C"),
	new MI(MITs.AC, "G/4,B/4,D/5,G/5", "0G"),
	new MI(MITs.AC, "B/4,D/5,G/5,B/5", "1G/B"),
	new MI(MITs.AC, "D/5,G/5,B/5,D/6", "2G/D"),
	new MI(MITs.AC, "A/4,C/5,E/5,A/5", "0Am"),
	new MI(MITs.AC, "C/5,E/5,A/5,C/6", "1Am/C"),
	new MI(MITs.AC, "E/5,A/5,C/6,E/6", "2Am/E"),
	new MI(MITs.AC, "B/4,D/5,F/5,B/5", "0Bsus"),
	new MI(MITs.AC, "D/5,F/5,B/5,D/6", "1Bsus/D"),
	new MI(MITs.AC, "F/5,B/5,D/6,F/6", "2Bsus/F")
];

// "高音谱，基本八度，白键" 为根音及三五音的紧凑型分解三和弦
const O4WKOnlyCATChords = [ 
	new MI(MITs.AC, "C/4,E/4,G/4", "C"),
	new MI(MITs.AC, "D/4,F/4,A/4", "D"),
	new MI(MITs.AC, "E/4,G/4,B/4", "E"),
	new MI(MITs.AC, "F/4,A/4,C/5", "F"),
	new MI(MITs.AC, "G/4,B/4,D/5", "G"),
	new MI(MITs.AC, "A/4,C/5,E/5", "A"),
	new MI(MITs.AC, "B/4,D/5,F/5", "B")
];

// "高音谱，基本八度，白键" 为根音及三五音的八度型柱式三和弦
const O4WKOnlyOPTChords = [
	new MI(MITs.PC, "C/4,G/4,C/5", "C"),
	new MI(MITs.PC, "D/4,A/4,D/5", "D"),
	new MI(MITs.PC, "E/4,B/4,E/5", "E"),
	new MI(MITs.PC, "F/4,C/5,F/5", "F"),
	new MI(MITs.PC, "G/4,D/5,G/5", "G"),
	new MI(MITs.PC, "A/4,E/5,A/5", "A"),
	new MI(MITs.PC, "B/4,F/5,B/5", "B")
];

// "高音谱，基本八度，白键" 为根音及三五音的八度型分解三和弦
const O4WKOnlyOATChords = [
	new MI(MITs.AC, "C/4,G/4,C/5", "C"),
	new MI(MITs.AC, "D/4,A/4,D/5", "D"),
	new MI(MITs.AC, "E/4,B/4,E/5", "E"),
	new MI(MITs.AC, "F/4,C/5,F/5", "F"),
	new MI(MITs.AC, "G/4,D/5,G/5", "G"),
	new MI(MITs.AC, "A/4,E/5,A/5", "A"),
	new MI(MITs.AC, "B/4,F/5,B/5", "B")
];

const O5WKs = [ // 高音谱，高八度，白键
	new MI(MITs.Note, "C/5", "C"),
	new MI(MITs.Note, "D/5", "D"),
	new MI(MITs.Note, "E/5", "E"),
	new MI(MITs.Note, "F/5", "F"),
	new MI(MITs.Note, "G/5", "G"),
	new MI(MITs.Note, "A/5", "A"),
	new MI(MITs.Note, "B/5", "B")
];

// "高音谱，高八度，白键" 为根音及三五音的紧凑型柱式三和弦
const O5WKOnlyCPTChords = [
	new MI(MITs.PC, "C/5,E/5,G/5", "C"),
	new MI(MITs.PC, "D/5,F/5,A/5", "D"),
	new MI(MITs.PC, "E/5,G/5,B/5", "E"),
	new MI(MITs.PC, "F/5,A/5,C/6", "F"),
	new MI(MITs.PC, "G/5,B/5,D/6", "G"),
	new MI(MITs.PC, "A/5,C/6,E/6", "A"),
	new MI(MITs.PC, "B/5,D/6,F/6", "B")
];

// "高音谱，高八度，白键" 为根音及三五音的紧凑型分解三和弦
const O5WKOnlyCATChords = [
	new MI(MITs.AC, "C/5,E/5,G/5", "C"),
	new MI(MITs.AC, "D/5,F/5,A/5", "D"),
	new MI(MITs.AC, "E/5,G/5,B/5", "E"),
	new MI(MITs.AC, "F/5,A/5,C/6", "F"),
	new MI(MITs.AC, "G/5,B/5,D/6", "G"),
	new MI(MITs.AC, "A/5,C/6,E/6", "A"),
	new MI(MITs.AC, "B/5,D/6,F/6", "B")
];

// "高音谱，高八度，白键" 为根音及三五音的八度型柱式三和弦
const O5WKOnlyOPTChords = [
	new MI(MITs.PC, "C/5,G/5,C/6", "C"),
	new MI(MITs.PC, "D/5,A/5,D/6", "D"),
	new MI(MITs.PC, "E/5,B/5,E/6", "E"),
	new MI(MITs.PC, "F/5,C/5,F/6", "F"),
	new MI(MITs.PC, "G/5,D/6,G/6", "G"),
	new MI(MITs.PC, "A/5,E/6,A/6", "A"),
	new MI(MITs.PC, "B/5,F/6,B/6", "B")
];

// "高音谱，高八度，白键" 为根音及三五音的八度型分解三和弦
const O5WKOnlyOATChords = [
	new MI(MITs.AC, "C/5,G/5,C/6", "C"),
	new MI(MITs.AC, "D/5,A/5,D/6", "D"),
	new MI(MITs.AC, "E/5,B/5,E/6", "E"),
	new MI(MITs.AC, "F/5,C/6,F/6", "F"),
	new MI(MITs.AC, "G/5,D/6,G/6", "G"),
	new MI(MITs.AC, "A/5,E/6,A/6", "A"),
	new MI(MITs.AC, "B/5,F/6,B/6", "B")
];

const O2FKs = [   // 低音谱，低八度，所有键
	new MI(MITs.Note, "Cb/2", "Cb"),
	new MI(MITs.Note, "C/2", "C"),
	new MI(MITs.Note, "C#/2", "C#"),
	new MI(MITs.Note, "Db/2", "Db"),
	new MI(MITs.Note, "D/2", "D"),
	new MI(MITs.Note, "D#/2", "D#"),
	new MI(MITs.Note, "Eb/2", "Eb"),
	new MI(MITs.Note, "E/2", "E"),
	new MI(MITs.Note, "E#/2", "E#"),
	new MI(MITs.Note, "Fb/2", "Fb"),
	new MI(MITs.Note, "F/2", "F"),
	new MI(MITs.Note, "F#/2", "F#"),
	new MI(MITs.Note, "Gb/2", "Gb"),
	new MI(MITs.Note, "G/2", "G"),
	new MI(MITs.Note, "G#/2", "G#"),
	new MI(MITs.Note, "Ab/2", "Ab"),
	new MI(MITs.Note, "A/2", "A"),
	new MI(MITs.Note, "A#/2", "A#"),
	new MI(MITs.Note, "Bb/2", "Bb"),
	new MI(MITs.Note, "B/2", "B"),
	new MI(MITs.Note, "B#/2", "B#")
];

const O3FKs = [   // 低音谱，基本八度，所有键
	new MI(MITs.Note, "Cb/3", "Cb"),
	new MI(MITs.Note, "C/3", "C"),
	new MI(MITs.Note, "C#/4", "C#"),
	new MI(MITs.Note, "Db/3", "Db"),
	new MI(MITs.Note, "D/3", "D"),
	new MI(MITs.Note, "D#/3", "D#"),
	new MI(MITs.Note, "Eb/3", "Eb"),
	new MI(MITs.Note, "E/3", "E"),
	new MI(MITs.Note, "E#/3", "E#"),
	new MI(MITs.Note, "Fb/3", "Fb"),
	new MI(MITs.Note, "F/3", "F"),
	new MI(MITs.Note, "F#/3", "F#"),
	new MI(MITs.Note, "Gb/3", "Gb"),
	new MI(MITs.Note, "G/3", "G"),
	new MI(MITs.Note, "G#/3", "G#"),
	new MI(MITs.Note, "Ab/3", "Ab"),
	new MI(MITs.Note, "A/3", "A"),
	new MI(MITs.Note, "A#/3", "A#"),
	new MI(MITs.Note, "Bb/3", "Bb"),
	new MI(MITs.Note, "B/3", "B"),
	new MI(MITs.Note, "B#/3", "B#")
];

const O4FKs = [   // 高音谱，基本八度，所有键
	new MI(MITs.Note, "Cb/4", "Cb"),
	new MI(MITs.Note, "C/4", "C"),
	new MI(MITs.Note, "C#/4", "C#"),
	new MI(MITs.Note, "Db/4", "Db"),
	new MI(MITs.Note, "D/4", "D"),
	new MI(MITs.Note, "D#/4", "D#"),
	new MI(MITs.Note, "Eb/4", "Eb"),
	new MI(MITs.Note, "E/4", "E"),
	new MI(MITs.Note, "E#/4", "E#"),
	new MI(MITs.Note, "Fb/4", "Fb"),
	new MI(MITs.Note, "F/4", "F"),
	new MI(MITs.Note, "F#/4", "F#"),
	new MI(MITs.Note, "Gb/4", "Gb"),
	new MI(MITs.Note, "G/4", "G"),
	new MI(MITs.Note, "G#/4", "G#"),
	new MI(MITs.Note, "Ab/4", "Ab"),
	new MI(MITs.Note, "A/4", "A"),
	new MI(MITs.Note, "A#/4", "A#"),
	new MI(MITs.Note, "Bb/4", "Bb"),
	new MI(MITs.Note, "B/4", "B"),
	new MI(MITs.Note, "B#/4", "B#")
];

const O5FKs = [   // 高音谱，高八度，所有键
	new MI(MITs.Note, "Cb/5", "Cb"),
	new MI(MITs.Note, "C/5", "C"),
	new MI(MITs.Note, "C#/5", "C#"),
	new MI(MITs.Note, "Db/5", "Db"),
	new MI(MITs.Note, "D/5", "D"),
	new MI(MITs.Note, "D#/5", "D#"),
	new MI(MITs.Note, "Eb/5", "Eb"),
	new MI(MITs.Note, "E/5", "E"),
	new MI(MITs.Note, "E#/5", "E#"),
	new MI(MITs.Note, "Fb/5", "Fb"),
	new MI(MITs.Note, "F/5", "F"),
	new MI(MITs.Note, "F#/5", "F#"),
	new MI(MITs.Note, "Gb/5", "Gb"),
	new MI(MITs.Note, "G/5", "G"),
	new MI(MITs.Note, "G#/5", "G#"),
	new MI(MITs.Note, "Ab/5", "Ab"),
	new MI(MITs.Note, "A/5", "A"),
	new MI(MITs.Note, "A#/5", "A#"),
	new MI(MITs.Note, "Bb/5", "Bb"),
	new MI(MITs.Note, "B/5", "B"),
	new MI(MITs.Note, "B#/5", "B#")
];

const O23WKs = [ ...O2WKs,  ...O3WKs ]; // 低音谱，两个八度，白键
// TODO
const O23WKsEx = [ new MI(MITs.Note, "B/1", "B"),new MI(MITs.Note, "C/4", "C"),new MI(MITs.Note, "D/4", "D"),new MI(MITs.Note, "E/4", "E"), ...O23WKs ];  // 低音谱，两个八度，上下各再加两个音符，白键

const O45WKs = [ ...O4WKs,  ...O5WKs ]; // 高音谱，两个八度，白键
// TODO
const O45WKsEx = [ new MI(MITs.Note, "A/3", "A"),new MI(MITs.Note, "B/3", "B"),new MI(MITs.Note, "C/6", "C"),new MI(MITs.Note, "D/6", "D"), ...O45WKs ];  // 高音谱，两个八度，上下再加两个音符，白键

const O23WKOnlyCPTChords = [ ...O2WKOnlyCPTChords, ...O3WKOnlyCPTChords ];
const O23WKOnlyCATChords = [ ...O2WKOnlyCATChords, ...O3WKOnlyCATChords ];
const O45WKOnlyCPTChords = [ ...O4WKOnlyCPTChords, ...O5WKOnlyCPTChords ];
const O45WKOnlyCATChords = [ ...O4WKOnlyCATChords, ...O5WKOnlyCATChords ];

const O23WKOnlyOPTChords = [ ...O2WKOnlyOPTChords, ...O3WKOnlyOPTChords ];
const O23WKOnlyOATChords = [ ...O2WKOnlyOATChords, ...O3WKOnlyOATChords ];
const O45WKOnlyOPTChords = [ ...O4WKOnlyOPTChords, ...O5WKOnlyOPTChords ];
const O45WKOnlyOATChords = [ ...O4WKOnlyOATChords, ...O5WKOnlyOATChords ];

const O23FKs = [ ...O2FKs,  ...O3FKs]; // 低音谱，两个八度，所有键
const O45FKs = [ ...O4FKs,  ...O5FKs]; // 高音谱，两个八度，所有键

//const HappyBirthday /*25*/ = "G/4,G/4,A/4,G/4,C/5,B/4,G/4,G/4,A/4,G/4,D/5,C/5,G/4,G/4,G/5,E/5,C/5,B/4,A/4,F/5,F/5,E/5,C/5,D/5,C/5";
const LittleStarHalf /*14*/ = "C/4,C/4,G/4,G/4,A/4,A/4,G/4,F/4,F/4,E/4,E/4,D/4,D/4,C/4";
//const LittleStarFull /*42*/ = "C/4,C/4,G/4,G/4,A/4,A/4,G/4,F/4,F/4,E/4,E/4,D/4,D/4,C/4,G/4,G/4,F/4,F/4,E/4,E/4,D/4,G/4,G/4,F/4,F/4,E/4,E/4,D/4,C/4,C/4,G/4,G/4,A/4,A/4,G/4,F/4,F/4,E/4,E/4,D/4,D/4,C/4";

export const PredefinedGameCollections = [
	 // id, display_name, description, icon, games
	new GC(11,"第一章","零基础入门","",
		[   //  Game: id, type, display_name, clef, keysig, music_items_count, template_music_items
			// new Game(1100, GTs.Intro, "第一节 学习", "预备知识", "treble", "C", 0, []),
			new Game(1102, GTs.Intro, "第一节 入门", "认识五线谱", "treble", "C", 0, []),
			new Game(1105, GTs.NoteToSyllable, "第二节 练习", "认识七个唱名", "treble", "C", 7, MIGs.NewFixed(O4WKs)),
			new Game(1106, GTs.NoteToPitch, "第三节 练习", "认识七个音名", "treble", "C", 7, MIGs.NewFixed(O4WKs)),
			new Game(1107, GTs.NoteToSyllable, "第四节 练习", "弹奏第一首歌", "treble", "C", 14, MIGs.NewFixedSong(LittleStarHalf)),

			new Game(1101, GTs.Intro, "第五节 学习", "钢琴键盘", "treble", "C", 0, []),
			new Game(1103, GTs.Intro, "第六节 学习", "谱号", "treble", "C", 0, []),
			new Game(1104, GTs.Intro, "第六节 学习", "音符", "treble", "C", 0, []),

			new Game(1110, GTs.Intro, "第七节 学习", "唱名速记表", "treble", "C", 0, []),
			new Game(1111, GTs.NoteToSyllable, "第八节 练习", "音符到唱名 (高音谱基本八度)", "treble", "C", 12, MIGs.NewST(O4WKs)),
			new Game(1112, GTs.NoteToSyllable, "第九节 练习", "音符到唱名 (低音谱基本八度)", "bass", "C", 12, MIGs.NewST(O3WKs)),
			new Game(1113, GTs.NoteToSyllable, "第十节 练习", "音符到唱名 (高音谱高八度)", "treble", "C", 12, MIGs.NewST(O5WKs)),
			new Game(1114, GTs.NoteToSyllable, "第十一节 练习", "音符到唱名 (低音谱低八度)", "bass", "C", 12, MIGs.NewST(O2WKs)),

			new Game(1120, GTs.Intro, "第十二节 学习", "音名速记表", "treble", "C", 0, []),
            new Game(1121, GTs.NoteToPitch, "第十三节 练习", "音符到音名 (高音谱基本八度)", "treble", "C", 12, MIGs.NewST(O4WKs)),
			new Game(1122, GTs.NoteToPitch, "第十四节 练习", "音符到音名 (低音谱基本八度)", "bass", "C", 12, MIGs.NewST(O3WKs)),
			new Game(1123, GTs.NoteToPitch, "第十五节 练习", "音符到音名 (高音谱高八度)", "treble", "C", 12, MIGs.NewST(O5WKs)),
			new Game(1124, GTs.NoteToPitch, "第十六节 练习", "音符到音名 (低音谱低八度)", "bass", "C", 12, MIGs.NewST(O2WKs))			
		]
	),
	new GC(21,"第二章","基本音符练习","",
		[
			new Game(2100, GTs.Intro, "第一节 学习", "快速识别音符的另一个技巧", "treble", "C", 0, []),

			new Game(2115, GTs.NoteToSyllable, "第二节 练习", "音符到唱名 (高音谱两个八度)", "treble", "C", 24, MIGs.NewST(O45WKs)), 
			new Game(2116, GTs.NoteToSyllable, "第三节 练习", "音符到唱名 (低音谱两个八度)", "bass", "C", 24, MIGs.NewST(O23WKs)),
			new Game(2117, GTs.NoteToSyllable, "第四节 练习", "音符到唱名 (高音谱两个八度+)", "treble", "C", 24, MIGs.NewST(O45WKsEx)),
			new Game(2118, GTs.NoteToSyllable, "第五节 练习", "音符到唱名 (低音谱两个八度+)", "bass", "C", 24, MIGs.NewST(O23WKsEx)),

            new Game(2111, GTs.NoteToPitch, "第六节 练习", "音符到音名 (高音谱两个八度)", "treble", "C", 24, MIGs.NewST(O45WKs)), 
			new Game(2112, GTs.NoteToPitch, "第七节 练习", "音符到音名 (低音谱两个八度)", "bass", "C", 24, MIGs.NewST(O23WKs)),
			new Game(2113, GTs.NoteToPitch, "第八节 练习", "音符到音名 (高音谱两个八度+)", "treble", "C", 24, MIGs.NewST(O45WKsEx)),
			new Game(2114, GTs.NoteToPitch, "第九节 练习", "音符到音名 (低音谱两个八度+)", "bass", "C", 24, MIGs.NewST(O23WKsEx))
		]
	),
	new GC(31,"第三章","高级音符练习","",
		[
			new Game(3100, GTs.Intro, "第一节 学习", "认识升降号", "treble", "C", 0, []),

			new Game(3111, GTs.NoteToSyllableWithSF, "第二节 练习", "带升降号，音符到唱名(高音谱两个八度)", "treble", "C", 24, MIGs.NewST(O45FKs)),
			new Game(3112, GTs.NoteToSyllableWithSF, "第三节 练习", "带升降号，音符到唱名(低音谱两个八度)", "bass", "C", 24, MIGs.NewST(O23FKs)),

			new Game(3121, GTs.NoteToPitchWithSF, "第四节 练习", "带升降号，音符到音名(高音谱两个八度)", "treble", "C", 24, MIGs.NewST(O45FKs)),
			new Game(3122, GTs.NoteToPitchWithSF, "第五节 练习", "带升降号，音符到音名(低音谱两个八度)", "bass", "C", 24, MIGs.NewST(O23FKs))

			// new Game(3101, GTs.Intro, "第二节 学习", "认识调式", "treble", "C", 0, []),
			// TODO 根据谱号，识别调号名称，并记住升降音数量及名称
			// new Game(3133, GTs.NoteToPitchWithSF, "第五节 练习", "TODO：熟记12个大调的谱号", "treble", "C", 24, MIGs.NewST(O45FKs)),
			// new Game(3134, GTs.NoteToPitchWithSF, "第六节 练习", "TODO：熟记12个大调的升降音", "bass", "C", 24, MIGs.NewST(O23FKs))
		]
	),
	new GC(41,"第四章","双音练习","",
		[
			new Game(4100, GTs.Intro, "第一节 学习", "双音的度数", "treble", "C", 0, []),

            new Game(4111, GTs.DoubleNoteDegree, "第二节 练习", "双音度数识别 (柱式型，高音谱)", "treble", "C", 12,
                new MIG({ MaxNote: "E/6", MIT: MITs.PC, BaseNotes: GenerateNotes("C/4","C/6",""), Degrees: ["2M","3M","4M","5p","6M","7M","8p"]}, "ByDegree")),
			new Game(4112, GTs.DoubleNoteDegree, "第三节 练习", "双音度数识别 (柱式型，低音谱)", "bass", "C", 12,
                new MIG({ MaxNote: "E/4", MIT: MITs.PC, BaseNotes: GenerateNotes("C/2","C/4",""), Degrees: ["2M","3M","4M","5p","6M","7M","8p"]}, "ByDegree")),

            new Game(4101, GTs.Intro, "第四节 学习", "双音的度数-进阶", "treble", "C", 0, []),

            new Game(4121, GTs.DoubleNoteDegree, "第五节 练习", "双音度数识别 (分解型，高音谱)", "treble", "C", 12,
                new MIG({ MaxNote: "E/6", MIT: MITs.AC, BaseNotes: GenerateNotes("C/4","C/6",""), Degrees: ["2M","3M","4M","5p","6M","7M","8p"]}, "ByDegree")),
			new Game(4122, GTs.DoubleNoteDegree, "第六节 练习", "双音度数识别 (分解型，低音谱)", "bass", "C", 12,
                new MIG({ MaxNote: "E/4", MIT: MITs.AC, BaseNotes: GenerateNotes("C/2","C/4",""), Degrees: ["2M","3M","4M","5p","6M","7M","8p"]}, "ByDegree"))
		]
	),
	new GC(51,"第五章","多音练习：三和弦及转位","",
		[
			new Game(5100, GTs.Intro, "第一节 学习", "认识三和弦及转位", "treble", "C", 0, []),

			new Game(5111, GTs.TCCI, "第二节 练习", "三和弦转位（紧凑柱式型), 高音谱", "treble", "C", 12, MIGs.NewST(O4WKOnlyCPTChordsWithCI)),
			new Game(5112, GTs.TCCI, "第三节 练习", "三和弦转位（紧凑分解型), 高音谱", "treble", "C",8, MIGs.NewST(O4WKOnlyCATChordsWithCI)),
			new Game(5113, GTs.TCCI, "第四节 练习", "三和弦转位（紧凑柱式型), 低音谱", "bass", "C", 12, MIGs.NewST(O2WKOnlyCPTChordsWithCI)),
			new Game(5114, GTs.TCCI, "第五节 练习", "三和弦转位（紧凑分解型), 低音谱", "bass", "C", 8, MIGs.NewST(O2WKOnlyCATChordsWithCI)),

			// TODO 八度型, 四个键
			new Game(5115, GTs.TCCI, "第六节 练习", "三和弦转位（八度柱式型), 高音谱", "treble", "C", 12, MIGs.NewST(O4WKOnlyOPTChordsWithCI)),
			new Game(5116, GTs.TCCI, "第七节 练习", "三和弦转位（八度分解型), 高音谱", "treble", "C", 8, MIGs.NewST(O4WKOnlyOATChordsWithCI)),
			new Game(5117, GTs.TCCI, "第八节 练习", "三和弦转位（八度柱式型), 低音谱", "bass", "C", 12, MIGs.NewST(O2WKOnlyOPTChordsWithCI)),
			new Game(5118, GTs.TCCI, "第九节 练习", "三和弦转位（八度分解型), 低音谱", "bass", "C", 8, MIGs.NewST(O2WKOnlyOATChordsWithCI))
		]
	)
	// new GC(61,"第六章","三和弦-基本练习","",
	// 	[
	// 		new Game(6100, GTs.Intro, "第一节 学习", "基本介绍：和弦及转位", "treble", "C", 0, []),

	// 		new Game(6111, GTs.CPTChordsNaming, "第二节 练习", "紧凑柱式三和弦练习(低音谱基本八度)", "bass", "C", 12, MIGs.NewST(O3WKOnlyCPTChords)),
	// 		new Game(6112, GTs.CATChordsNaming, "第三节 练习", "紧凑分解三和弦练习(低音谱基本八度)", "bass", "C", 12, MIGs.NewST(O3WKOnlyCATChords)),
	// 		new Game(6113, GTs.OPTChordsNaming, "第四节 练习", "八度柱式三和弦练习(低音谱基本八度)", "bass", "C", 12, MIGs.NewST(O3WKOnlyOPTChords)),
	// 		new Game(6114, GTs.OATChordsNaming, "第五节 练习", "八度分解三和弦练习(低音谱基本八度)", "bass", "C", 12, MIGs.NewST(O3WKOnlyOATChords)),

    //         new Game(6115, GTs.CPTChordsNaming, "第六节 练习", "紧凑柱式三和弦练习(高音谱基本八度)", "treble", "C", 12, MIGs.NewST(O4WKOnlyCPTChords)),
	// 		new Game(6116, GTs.CATChordsNaming, "第七节 练习", "紧凑分解三和弦练习(高音谱基本八度)", "treble", "C", 12, MIGs.NewST(O4WKOnlyCATChords)),
	// 		new Game(6117, GTs.OPTChordsNaming, "第八节 练习", "八度柱式三和弦练习(高音谱基本八度)", "treble", "C", 12, MIGs.NewST(O4WKOnlyOPTChords)),
	// 		new Game(6118, GTs.OATChordsNaming, "第九节 练习", "八度分解三和弦练习(高音谱基本八度)", "treble", "C", 12, MIGs.NewST(O4WKOnlyOATChords))
	// 	]
	// ),
	// new GC(71,"第七章","三和弦-中级练习","",
	// 	[
	// 		new Game(7100, GTs.Intro, "第一节 知识学习", "基本介绍：各种常用和弦织体", "treble", "C", 0, []),

    //         new Game(7111, GTs.CPTChordsNaming, "第二节 练习", "紧凑柱式三和弦练习(低音谱两个八度)", "bass", "C", 12, MIGs.NewST(O23WKOnlyCPTChords)),
	// 		new Game(7112, GTs.CATChordsNaming, "第三节 练习", "紧凑分解三和弦练习(低音谱两个八度)", "bass", "C", 12, MIGs.NewST(O23WKOnlyCATChords)),
	// 		new Game(7113, GTs.OPTChordsNaming, "第四节 练习", "八度柱式三和弦练习(低音谱两个八度)", "bass", "C", 12, MIGs.NewST(O23WKOnlyOPTChords)),
	// 		new Game(7114, GTs.OATChordsNaming, "第五节 练习", "八度分解三和弦练习(低音谱两个八度)", "bass", "C", 12, MIGs.NewST(O23WKOnlyOATChords)),

    //         new Game(7115, GTs.CPTChordsNaming, "第六节 练习", "紧凑柱式三和弦练习(高音谱两个八度)", "treble", "C", 12, MIGs.NewST(O45WKOnlyCPTChords)),
	// 		new Game(7116, GTs.CATChordsNaming, "第七节 练习", "紧凑分解三和弦练习(高音谱两个八度)", "treble", "C", 12, MIGs.NewST(O45WKOnlyCATChords)),
	// 		new Game(7117, GTs.OPTChordsNaming, "第八节 练习", "八度柱式三和弦练习(高音谱两个八度)", "treble", "C", 12, MIGs.NewST(O45WKOnlyOPTChords)),
	// 		new Game(7118, GTs.OATChordsNaming, "第九节 练习", "八度分解三和弦练习(高音谱两个八度)", "treble", "C", 12, MIGs.NewST(O45WKOnlyOATChords))
	// 	]
	// ),
	// new GC(81,"第八章","三和弦-高级练习","",
	// 	[
	// 		new Game(8100, GTs.Indroduction, "第一节 知识学习", "基本介绍: 和弦快速识谱技巧", "treble", "C", 0, []),

	// 		new Game(8111, GTs.CPTChordsNaming, "第二节 练习", "紧凑柱式三和弦练习(低音谱两个八度)(带升降号)", "bass", "C", 12, MIGs.NewST(O23FKs)),
	// 		new Game(8112, GTs.CATChordsNaming, "第三节 练习", "紧凑分解三和弦练习(低音谱两个八度)(带升降号)", "bass", "C", 12, MIGs.NewST(O23FKs)),
	// 		new Game(8113, GTs.OPTChordsNaming, "第四节 练习", "八度柱式三和弦练习(低音谱两个八度)(带升降号)", "bass", "C", 12, MIGs.NewST(O23FKs)),
	// 		new Game(8114, GTs.OATChordsNaming, "第五节 练习", "八度分解三和弦练习(低音谱两个八度)(带升降号)", "bass", "C", 12, MIGs.NewST(O23FKs)),

    //         new Game(8115, GTs.CPTChordsNaming, "第六节 练习", "紧凑柱式三和弦练习(高音谱两个八度)(带升降号)", "treble", "C", 12, MIGs.NewST(O45FKs)),
	// 		new Game(8116, GTs.CATChordsNaming, "第七节 练习", "紧凑分解三和弦练习(高音谱两个八度)(带升降号)", "treble", "C", 12, MIGs.NewST(O45FKs)),
	// 		new Game(8117, GTs.OPTChordsNaming, "第八节 练习", "八度柱式三和弦练习(高音谱两个八度)(带升降号)", "treble", "C", 12, MIGs.NewST(O45FKs)),
	// 		new Game(8118, GTs.OATChordsNaming, "第九节 练习", "八度分解三和弦练习(高音谱两个八度)(带升降号)", "treble", "C", 12, MIGs.NewST(O45FKs))
	// 	]
	// )
	// new GC(91,"第九章","快速基本练习","",
	// 	[
	// 		new Game(9100, GTs.Intro, "基本介绍", "treble", "C", 0, [])
	// 	]
	// ),
	// new GC(92,"第十章","快速基本练习","",
	// 	[
	// 		new Game(9200, GTs.Intro, "基本介绍", "treble", "C", 0, [])
	// 	]
	// ),
	// new GC(93,"第十一章","快速基本练习","",
	// 	[
	// 		new Game(9300, GTs.Intro, "基本介绍", "treble", "C", 0, [])
	// 	]
	// ),
	// new GC(94,"第十二章","快速混合练习","",
	// 	[
	// 		new Game(9400, GTs.Intro, "基本介绍", "treble", "C", 0, [])
	// 	]
	// )
];
