import logger from '@/utils/logger.js'
import { PKs, Keysigs, Traids, BTs, MITs, MusicItem as MI, GameType as GT, Game, GameCollection as GC } from './game-model.js'

// @func return integer in [min, max)
function RandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
};

// generate a collections of music items according specified condition.
// MICGs = MusicItemCollectionGenerators
const MICGs = {
    // 生成指定八度范围内的所有音名(包括重复音名)
    genNotes: function(octave) {
        let pitchs = PKs.SyllableToPitchs;
        let mit = MITs.Note;

        let music_items = new Array();
        for(let i=0; i<pitchs.length; i++) {
            let note_f = pitchs[i] + "b" + "/" + octave.toString();
            let note = pitchs[i] + "/" + octave.toString();
            let note_s = pitchs[i] + "#" + "/" + octave.toString();
            music_items.push(new MI(mit, note_f, PKs.getPitchName(note_f)));
            music_items.push(new MI(mit, note, PKs.getPitchName(note)));
            music_items.push(new MI(mit, note_s, PKs.getPitchName(note_s)));
        }
        return music_items;
    },

    // 生成指定调式下的单音符音阶
    // 注：[startNote,endNote]为音符的范围
    genNotesByKeysig: function(keysig, startNote, endNote) {
        let ks = Keysigs.getKeysigInfo(keysig);
        let scale_pitchs = Keysigs.getKeysigScaleNotes(keysig);

        let startAN = PKs.NoteToAN(startNote);
        let endAN = PKs.NoteToAN(endNote);

        let mit = MITs.Note;

        let music_items = new Array();
        for(let i=startAN; i<=endAN; i++) {
            let note = PKs.ANtoNote(i, ks.acc);

            let pitch = PKs.getPitchName(note);
            if (!scale_pitchs.includes(pitch))
                continue;

            let mi = new MI(mit, note, pitch);
            music_items.push(mi);
        }

        return music_items;
    },

    // 生成指定调式下的三和弦音阶
    // 注意：[startNote,endNote]为和弦根音的范围, 生成的其他音符可能超过此范围
    // compact_or_octave: 'compact' = 紧凑型(三个键), 'octave' = 八度型(四个键)
    // pillar_or_arpeggio: 'PC' = 柱式和弦, 'AC' = 分解和弦
    // traid_chord_type: 允许的和弦类型, 值有 'maj', 'min', 'aug', 'dim'
    // allow_ci: 是否生成转位和弦
    // add_ci_to_target_value: 是否将转位号码做为MusicItem.TargetValue的前缀
    genTraidChords: function(keysig, startNote, endNote, traid_chord_type,
        compact_or_octave, pillar_or_arpeggio, allow_ci, add_ci_to_target_value) 
    {
        let ks = Keysigs.getKeysigInfo(keysig);
        let scale_pitchs = Keysigs.getKeysigScaleNotes(keysig);

        let startAN = PKs.NoteToAN(startNote);
        let endAN = PKs.NoteToAN(endNote);

        logger.assert(pillar_or_arpeggio == 'PC' || pillar_or_arpeggio == 'AC');
        let mit = (pillar_or_arpeggio == 'PC' ? MITs.PC : MITs.AC);
        logger.assert(compact_or_octave == 'compact' || compact_or_octave == 'octave');
        let width = compact_or_octave;
        let shape = traid_chord_type;
        let cis = allow_ci ? [0,1,2] : [0];

        let music_items = new Array();

        for(let i=startAN; i<=endAN; i++) {
            for(let ci=0;ci<=cis.length;ci++) {
                let rns = Traids.distances[width][ci.toString()][shape]; // RNs

                let chord = "";
                for(let k=0;k<=rns.length;k++) {
                    let an = i + rns[k];
                    chord = (chord.length > 0 ? "," : "") + PKs.ANtoNote(an, ks.acc);
                }

                let ci_prefix = (add_ci_to_target_value ? ci.toString() : "" );
                let mi = new MI(mit, chord, ci_prefix + PKs.getPitchName(chord));
                music_items.push(mi);
            }
        }

        return music_items;
    },

    // 生成C大调全部由白键组成的三和弦。
    // compact_or_octave: 'compact' = 紧凑型(三个键), 'octave' = 八度型(四个键)
    // pillar_or_arpeggio: 'PC' = 柱式和弦, 'AC' = 分解和弦
    // traid_chord_type: 允许的和弦类型, 值有 'maj', 'min', 'aug', 'dim'
    // allow_ci: 是否生成转位和弦
    // add_ci_to_target_value: 是否将转位号码做为MusicItem.TargetValue的前缀
    genCMajWKOnlyTraidChords(octave, 
        compact_or_octave, pillar_or_arpeggio, allow_ci, add_ci_to_target_value) 
    {
        const distances = {
            'compact' : {
                '0' : [ "C/{0},E/{0},G/{0}", "D/{0},F/{0},A/{0}", "E/{0},G/{0},B/{0}", "F/{0},A/{0},C/{1}", "G/{0},B/{0},D/{1}", "A/{0},C/{1},E/{1}", "B/{0},D/{1},F/{1}" ],
                '1' : [ "E/{0},G/{0},C/{1}", "F/{0},A/{0},D/{1}", "G/{0},B/{0},E/{1}", "A/{0},C/{1},F/{1}", "B/{0},D/{1},G/{1}", "C/{1},E/{1},A/{1}", "D/{1},F/{1},B/{1}" ],
                '2' : [ "G/{0},C/{1},E/{1}", "A/{0},D/{1},F/{1}", "B/{0},E/{1},G/{1}", "C/{1},F/{1},A/{1}", "D/{1},G/{1},B/{1}", "E/{1},A/{1},C/{2}", "F/{1},B/{1},D/{2}" ]
            },
            'octave' : {
                '0' : [ "C/{0},E/{0},G/{0},C/{1}", "D/{0},F/{0},A/{0},D/{1}", "E/{0},G/{0},B/{0},E/{1}", "F/{0},A/{0},C/{1},F/{1}", "G/{0},B/{0},D/{1},G/{1}", "A/{0},C/{1},E/{1},A/{1}", "B/{0},D/{1},F/{1},B/{1}" ],
                '1' : [ "E/{0},G/{0},C/{1},E/{1}", "F/{0},A/{0},D/{1},F/{1}", "G/{0},B/{0},E/{1},G/{1}", "A/{0},C/{1},F/{1},A/{1}", "B/{0},D/{1},G/{1},B/{1}", "C/{1},E/{1},A/{1},C/{2}", "D/{1},F/{1},B/{1},D/{2}" ],
                '2' : [ "G/{0},C/{1},E/{1},G/{1}", "A/{0},D/{1},F/{1},A/{1}", "B/{0},E/{1},G/{1},B/{1}", "C/{1},F/{1},A/{1},C/{2}", "D/{1},G/{1},B/{1},D/{2}", "E/{1},A/{1},C/{2},E/{2}", "F/{1},B/{1},D/{2},F/{2}" ]
            }
        };

        let startAN = octave * 12;
        let endAN = startAN + 12;

        logger.assert(pillar_or_arpeggio == 'PC' || pillar_or_arpeggio == 'AC');
        let mit = (pillar_or_arpeggio == 'PC' ? MITs.PC : MITs.AC);
        logger.assert(compact_or_octave == 'compact' || compact_or_octave == 'octave');
        let width = compact_or_octave;

        let cis = allow_ci ? [0,1,2] : [0];

        let music_items = new Array();

        for(let i=startAN; i<=endAN; i++) {
            for(let ci=0;ci<cis.length;ci++) {
                let chords = distances[width][ci.toString()];
                let ci_prefix = (add_ci_to_target_value ? ci.toString() : "" );

                for(let k=0; k<chords.length; k++) {
                    let chord = chords[k];
                    chord = chord.replaceAll("{2}", (octave+2).toString());
                    chord = chord.replaceAll("{1}", (octave+1).toString());
                    chord = chord.replaceAll("{0}", (octave+0).toString());
                    let rootPitch = distances[width]['0'][k][0];
                    let mi = new MI(mit, chord, ci_prefix + rootPitch);
                    music_items.push(mi);
                }
            }
        }

        return music_items;
    }
};

// functions that can create music item according specified props
// MIC = MusicItemCreator = @func MusicItemCreator: MusicItem create_func(props,index)
const MICs = {
    // ByFixedSong = by fixed string of song, Props = String with notes.
    ByFixedSong : function(props,index) {
        let notes = props.split(',');  // TODO: low performance here
        logger.assert(index >= 0 && index < notes.length);
        return new MI(MITs.Note, notes[index], PKs.getPitchName(notes[index]));
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

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

// 低音谱，低八度，白键
const O2WKs = MICGs.genNotesByKeysig("C","C/2","B/2");
// 低音谱，基本八度，白键
const O3WKs = MICGs.genNotesByKeysig("C", "C/3", "B/3");
// 高音谱，基本八度，白键
const O4WKs = MICGs.genNotesByKeysig("C", "C/4", "B/4");
// 高音谱，高八度，白键
const O5WKs = MICGs.genNotesByKeysig("C", "C/5", "B/5");

// 低音谱，两个八度，白键
const O23WKs = [ ...O2WKs,  ...O3WKs ];
// 低音谱，两个八度，上下各再加两个音符，白键
const O23WKsEx = [ new MI(MITs.Note, "B/1", "B"),new MI(MITs.Note, "C/4", "C"),new MI(MITs.Note, "D/4", "D"),new MI(MITs.Note, "E/4", "E"), ...O23WKs ];

// 高音谱，两个八度，白键
const O45WKs = [ ...O4WKs,  ...O5WKs ];
// 高音谱，两个八度，上下再加两个音符，白键
const O45WKsEx = [ new MI(MITs.Note, "A/3", "A"),new MI(MITs.Note, "B/3", "B"),new MI(MITs.Note, "C/6", "C"),new MI(MITs.Note, "D/6", "D"), ...O45WKs ];

const O2WKOnlyCPTChords = MICGs.genCMajWKOnlyTraidChords(2, 'compact', 'PC', false, false);
const O2WKOnlyCATChords = MICGs.genCMajWKOnlyTraidChords(2, 'compact', 'AC', false, false);
const O2WKOnlyCPTChordsWithCI = MICGs.genCMajWKOnlyTraidChords(2, 'compact', 'PC', true, true);
const O2WKOnlyCATChordsWithCI = MICGs.genCMajWKOnlyTraidChords(2, 'compact', 'AC', true, true);
const O2WKOnlyOPTChords = MICGs.genCMajWKOnlyTraidChords(2, 'octave', 'PC', 'AC', false, false);
const O2WKOnlyOPTChordsWithCI = MICGs.genCMajWKOnlyTraidChords(2, 'octave', 'PC', true, true);
const O2WKOnlyOATChords = MICGs.genCMajWKOnlyTraidChords(2, 'octave', 'AC', false, false);
const O2WKOnlyOATChordsWithCI = MICGs.genCMajWKOnlyTraidChords(2, 'octave', 'AC', true, true);

const O4WKOnlyCPTChords = MICGs.genCMajWKOnlyTraidChords(4, 'compact', 'PC', false, false);
const O4WKOnlyCATChords = MICGs.genCMajWKOnlyTraidChords(4, 'compact', 'AC', false, false);
const O4WKOnlyCPTChordsWithCI = MICGs.genCMajWKOnlyTraidChords(4, 'compact', 'PC', true, true);
const O4WKOnlyCATChordsWithCI = MICGs.genCMajWKOnlyTraidChords(4, 'compact', 'AC', true, true);
const O4WKOnlyOPTChords = MICGs.genCMajWKOnlyTraidChords(4, 'octave', 'PC', false, false);
const O4WKOnlyOPTChordsWithCI = MICGs.genCMajWKOnlyTraidChords(4, 'octave', 'PC', true, true);
const O4WKOnlyOATChords = MICGs.genCMajWKOnlyTraidChords(4, 'octave', 'AC', false, false);
const O4WKOnlyOATChordsWithCI = MICGs.genCMajWKOnlyTraidChords(4, 'octave', 'AC', true, true);

const O2FKs = MICGs.genNotes(2);
const O3FKs = MICGs.genNotes(3);
const O4FKs = MICGs.genNotes(4);
const O5FKs = MICGs.genNotes(5);

// 低音谱，两个八度，所有键
const O23FKs = [ ...O2FKs,  ...O3FKs];
// 高音谱，两个八度，所有键
const O45FKs = [ ...O4FKs,  ...O5FKs];

//const HappyBirthday /*25*/ = "G/4,G/4,A/4,G/4,C/5,B/4,G/4,G/4,A/4,G/4,D/5,C/5,G/4,G/4,G/5,E/5,C/5,B/4,A/4,F/5,F/5,E/5,C/5,D/5,C/5";
const LittleStarHalf /*14*/ = "C/4,C/4,G/4,G/4,A/4,A/4,G/4,F/4,F/4,E/4,E/4,D/4,D/4,C/4";
//const LittleStarFull /*42*/ = "C/4,C/4,G/4,G/4,A/4,A/4,G/4,F/4,F/4,E/4,E/4,D/4,D/4,C/4,G/4,G/4,F/4,F/4,E/4,E/4,D/4,G/4,G/4,F/4,F/4,E/4,E/4,D/4,C/4,C/4,G/4,G/4,A/4,A/4,G/4,F/4,F/4,E/4,E/4,D/4,D/4,C/4";

export const PredefinedGameCollections = [
	 // id, display_name, description, icon, games
	new GC(11,"第一章 零基础入门","认识五线谱","",
		[   //  Game: id, type, display_name, clef, keysig, duration, music_items_count, template_music_items
			new Game(1102, BTs.Any, "第一节 入门", "认识五线谱", "treble", "C", "1", 0, []),
			new Game(1105, BTs.Syllable, "第二节 练习", "认识七个唱名", "treble", "C", "1", 7, MIGs.NewFixed(O4WKs)),
			new Game(1106, BTs.Pitch, "第三节 练习", "认识七个音名", "treble", "C", "1", 7, MIGs.NewFixed(O4WKs)),
			new Game(1107, BTs.Syllable, "第四节 练习", "弹奏第一首歌", "treble", "C", "1", 14, MIGs.NewFixedSong(LittleStarHalf)),
			new Game(1104, BTs.Any, "第五节 学习", "音符", "treble", "C", "1", 0, []),
			new Game(1111, BTs.Syllable, "第六节 练习", "音符到唱名 (高音谱基本八度)", "treble", "C", "4", 12, MIGs.NewST(O4WKs)),
            new Game(1121, BTs.Pitch, "第七节 练习", "音符到音名 (高音谱基本八度)", "treble", "C", "4", 12, MIGs.NewST(O4WKs))
		]
	),
	new GC(12,"第二章 认识基本音符","认识五线谱上的所有基本音符","",
		[
			new Game(1101, BTs.Any, "第一节 学习", "认识钢琴键盘", "treble", "C", "1", 0, []),
			new Game(1103, BTs.Any, "第二节 学习", "认识五线谱的谱号", "treble", "C", "1", 0, []),

			new Game(1110, BTs.Any, "第三节 学习", "唱名速记表", "treble", "C", "1", 0, []),
			new Game(1111, BTs.Syllable, "第四节 练习", "音符到唱名 (高音谱基本八度)", "treble", "C", "4", 12, MIGs.NewST(O4WKs)),
			new Game(1112, BTs.Syllable, "第五节 练习", "音符到唱名 (低音谱基本八度)", "bass", "C", "4", 12, MIGs.NewST(O3WKs)),
			new Game(1113, BTs.Syllable, "第六节 练习", "音符到唱名 (高音谱高八度)", "treble", "C", "4", 12, MIGs.NewST(O5WKs)),
			new Game(1114, BTs.Syllable, "第七节 练习", "音符到唱名 (低音谱低八度)", "bass", "C", "4", 12, MIGs.NewST(O2WKs)),

			new Game(1120, BTs.Any, "第八节 学习", "音名速记表", "treble", "C", "1", 0, []),
            new Game(1121, BTs.Pitch, "第九节 练习", "音符到音名 (高音谱基本八度)", "treble", "C", "4", 12, MIGs.NewST(O4WKs)),
			new Game(1122, BTs.Pitch, "第十节 练习", "音符到音名 (低音谱基本八度)", "bass", "C", "4", 12, MIGs.NewST(O3WKs)),
			new Game(1123, BTs.Pitch, "第十一节 练习", "音符到音名 (高音谱高八度)", "treble", "C", "4", 12, MIGs.NewST(O5WKs)),
			new Game(1124, BTs.Pitch, "第十二节 练习", "音符到音名 (低音谱低八度)", "bass", "C", "4", 12, MIGs.NewST(O2WKs))			
		]
	),
	new GC(21,"第三章 速读基本音符","熟练掌握基本音符的阅读","",
		[
			new Game(2100, BTs.Any, "第一节 学习", "快速识别音符的另一个技巧", "treble", "C", "1", 0, []),

			new Game(2115, BTs.Syllable, "第二节 练习", "音符到唱名 (高音谱两个八度)", "treble", "C", "8", 24, MIGs.NewST(O45WKs)), 
			new Game(2116, BTs.Syllable, "第三节 练习", "音符到唱名 (低音谱两个八度)", "bass", "C", "8", 24, MIGs.NewST(O23WKs)),
			new Game(2117, BTs.Syllable, "第四节 练习", "音符到唱名 (高音谱两个八度+)", "treble", "C", "8", 24, MIGs.NewST(O45WKsEx)),
			new Game(2118, BTs.Syllable, "第五节 练习", "音符到唱名 (低音谱两个八度+)", "bass", "C", "8", 24, MIGs.NewST(O23WKsEx)),

            new Game(2111, BTs.Pitch, "第六节 练习", "音符到音名 (高音谱两个八度)", "treble", "C", "8", 24, MIGs.NewST(O45WKs)), 
			new Game(2112, BTs.Pitch, "第七节 练习", "音符到音名 (低音谱两个八度)", "bass", "C", "8", 24, MIGs.NewST(O23WKs)),
			new Game(2113, BTs.Pitch, "第八节 练习", "音符到音名 (高音谱两个八度+)", "treble", "C", "8", 24, MIGs.NewST(O45WKsEx)),
			new Game(2114, BTs.Pitch, "第九节 练习", "音符到音名 (低音谱两个八度+)", "bass", "C", "8", 24, MIGs.NewST(O23WKsEx))
		]
	),
	new GC(41,"第四章 双音练习","学会一次看两个音","",
		[
			new Game(4100, BTs.Any, "第一节 学习", "双音的度数", "treble", "C", "1", 0, []),

            new Game(4111, BTs.Degree, "第二节 练习", "双音度数识别 (柱式型，高音谱)", "treble", "C", "4", 12, 
                new MIG({ MaxNote: "E/6", MIT: MITs.PC, BaseNotes: GenerateNotes("C/4","C/6",""), Degrees: ["2M","3M","4M","5p","6M","7M","8p"]}, "ByDegree")),
			new Game(4112, BTs.Degree, "第三节 练习", "双音度数识别 (柱式型，低音谱)", "bass", "C", "4", 12,
                new MIG({ MaxNote: "E/4", MIT: MITs.PC, BaseNotes: GenerateNotes("C/2","C/4",""), Degrees: ["2M","3M","4M","5p","6M","7M","8p"]}, "ByDegree")),

            new Game(4101, BTs.Any, "第四节 学习", "双音的度数-进阶", "treble", "C", "1", 0, []),

            new Game(4121, BTs.Degree, "第五节 练习", "双音度数识别 (分解型，高音谱)", "treble", "C", "4", 12,
                new MIG({ MaxNote: "E/6", MIT: MITs.AC, BaseNotes: GenerateNotes("C/4","C/6",""), Degrees: ["2M","3M","4M","5p","6M","7M","8p"]}, "ByDegree")),
			new Game(4122, BTs.Degree, "第六节 练习", "双音度数识别 (分解型，低音谱)", "bass", "C", "4", 12,
                new MIG({ MaxNote: "E/4", MIT: MITs.AC, BaseNotes: GenerateNotes("C/2","C/4",""), Degrees: ["2M","3M","4M","5p","6M","7M","8p"]}, "ByDegree"))
		]
	),
	new GC(51,"第五章 多音练习","学会一次看多个音(和弦)","",
		[
			new Game(5100, BTs.Any, "第一节 学习", "认识三和弦及其转位", "treble", "C", "1", 0, []),

			new Game(5111, BTs.CI, "第二节 练习", "三和弦转位 (紧凑柱式型), 高音谱", "treble", "C", "4", 12, MIGs.NewST(O4WKOnlyCPTChordsWithCI)),
			new Game(5112, BTs.CI, "第三节 练习", "三和弦转位 (紧凑分解型), 高音谱", "treble", "C", "4", 8, MIGs.NewST(O4WKOnlyCATChordsWithCI)),
			new Game(5113, BTs.CI, "第四节 练习", "三和弦转位 (紧凑柱式型), 低音谱", "bass", "C", "4", 12, MIGs.NewST(O2WKOnlyCPTChordsWithCI)),
			new Game(5114, BTs.CI, "第五节 练习", "三和弦转位 (紧凑分解型), 低音谱", "bass", "C", "4", 8, MIGs.NewST(O2WKOnlyCATChordsWithCI)),

			// TODO 八度型, 四个键
			new Game(5115, BTs.CI, "第六节 练习", "三和弦转位 (八度柱式型), 高音谱", "treble", "C", "4", 12, MIGs.NewST(O4WKOnlyOPTChordsWithCI)),
			new Game(5116, BTs.CI, "第七节 练习", "三和弦转位 (八度分解型), 高音谱", "treble", "C", "4", 8, MIGs.NewST(O4WKOnlyOATChordsWithCI)),
			new Game(5117, BTs.CI, "第八节 练习", "三和弦转位 (八度柱式型), 低音谱", "bass", "C", "4", 12, MIGs.NewST(O2WKOnlyOPTChordsWithCI)),
			new Game(5118, BTs.CI, "第九节 练习", "三和弦转位 (八度分解型), 低音谱", "bass", "C", "4", 8, MIGs.NewST(O2WKOnlyOATChordsWithCI)),

			new Game(5200, BTs.Any, "第十节 学习", "识别三和弦的根音", "treble", "C", "1", 0, []),

			new Game(5211, BTs.Pitch, "第十一节 练习", "三和弦根音 (紧凑柱式型), 高音谱", "treble", "C", "4", 12, MIGs.NewST(O4WKOnlyCPTChordsWithCI)),
			new Game(5212, BTs.Pitch, "第十二节 练习", "三和弦根音 (紧凑分解型), 高音谱", "treble", "C", "4", 8, MIGs.NewST(O4WKOnlyCATChordsWithCI)),
			new Game(5213, BTs.Pitch, "第十三节 练习", "三和弦根音 (紧凑柱式型), 低音谱", "bass", "C", "4", 12, MIGs.NewST(O2WKOnlyCPTChordsWithCI)),
			new Game(5214, BTs.Pitch, "第十四节 练习", "三和弦根音 (紧凑分解型), 低音谱", "bass", "C", "4", 8, MIGs.NewST(O2WKOnlyCATChordsWithCI)),

			// TODO 八度型, 四个键
			new Game(5215, BTs.Pitch, "第十五节 练习", "三和弦根音 (八度柱式型), 高音谱", "treble", "C", "4", 12, MIGs.NewST(O4WKOnlyOPTChordsWithCI)),
			new Game(5216, BTs.Pitch, "第十六节 练习", "三和弦根音 (八度分解型), 高音谱", "treble", "C", "4", 8, MIGs.NewST(O4WKOnlyOATChordsWithCI)),
			new Game(5217, BTs.Pitch, "第十七节 练习", "三和弦根音 (八度柱式型), 低音谱", "bass", "C", "4", 12, MIGs.NewST(O2WKOnlyOPTChordsWithCI)),
			new Game(5218, BTs.Pitch, "第十八节 练习", "三和弦根音 (八度分解型), 低音谱", "bass", "C", "4", 8, MIGs.NewST(O2WKOnlyOATChordsWithCI))
        ]
	),
	new GC(31,"第六章 调式变化","认识大小调及升降号","",
		[
			new Game(3100, BTs.Any, "第一节 学习", "认识升降号", "treble", "C", "1", 0, []),

			new Game(3111, BTs.SyllableWithSF, "第二节 练习", "带升降号，音符到唱名(高音谱两个八度)", "treble", "C", "4", 24, MIGs.NewST(O45FKs)),
			new Game(3112, BTs.SyllableWithSF, "第三节 练习", "带升降号，音符到唱名(低音谱两个八度)", "bass", "C", "4", 24, MIGs.NewST(O23FKs)),
			new Game(3113, BTs.SyllableWithSF, "第四节 练习", "带升降号，音符到音名(高音谱两个八度)", "treble", "C", "4", 24, MIGs.NewST(O45FKs)),
			new Game(3114, BTs.SyllableWithSF, "第五节 练习", "带升降号，音符到音名(低音谱两个八度)", "bass", "C", "4", 24, MIGs.NewST(O23FKs)),

			new Game(3101, BTs.Any, "第六节 学习", "认识大小调", "treble", "C", "1", 0, []),
			new Game(3102, BTs.Any, "第七节 学习", "所有大调和小调", "treble", "C", "1", 0, []),

            new Game(3121, BTs.SyllableWithSF, "第八节 练习", "G大调，音符到唱名(高音谱两个八度)", "treble", "G", "4", 24, MIGs.NewST(O45WKs)),
			new Game(3122, BTs.SyllableWithSF, "第九节 练习", "F大调，音符到唱名(低音谱两个八度)", "bass", "F", "4", 24, MIGs.NewST(O23WKs)),
			new Game(3123, BTs.SyllableWithSF, "第十节 练习", "D大调，音符到唱名(高音谱两个八度)", "treble", "D", "4", 24, MIGs.NewST(O45WKs)),
			new Game(3124, BTs.SyllableWithSF, "第十一节 练习", "降B大调，音符到唱名(低音谱两个八度)", "bass", "Bb", "4", 24, MIGs.NewST(O23WKs)),
			new Game(3125, BTs.SyllableWithSF, "第十二节 练习", "A大调，音符到唱名(高音谱两个八度)", "treble", "A", "4", 24, MIGs.NewST(O45WKs)),
			new Game(3126, BTs.SyllableWithSF, "第十三节 练习", "降E大调，音符到唱名(低音谱两个八度)", "bass", "Eb", "4", 24, MIGs.NewST(O23WKs)),
			new Game(3127, BTs.SyllableWithSF, "第十四节 练习", "E大调，音符到唱名(高音谱两个八度)", "treble", "E", "4", 24, MIGs.NewST(O45WKs)),
			new Game(3128, BTs.SyllableWithSF, "第十五节 练习", "降A大调，音符到唱名(低音谱两个八度)", "bass", "Ab", "4", 24, MIGs.NewST(O23WKs)),
			new Game(3129, BTs.SyllableWithSF, "第十六节 练习", "B大调，音符到唱名(高音谱两个八度)", "treble", "B", "4", 24, MIGs.NewST(O45WKs)),
			new Game(3130, BTs.SyllableWithSF, "第十七节 练习", "降D大调，音符到唱名(低音谱两个八度)", "bass", "Db", "4", 24, MIGs.NewST(O23WKs)),
			new Game(3131, BTs.SyllableWithSF, "第十八节 练习", "升F大调，音符到唱名(高音谱两个八度)", "treble", "F#", "4", 24, MIGs.NewST(O45WKs)),
			new Game(3132, BTs.SyllableWithSF, "第十九节 练习", "降G大调，音符到唱名(低音谱两个八度)", "bass", "Gb", "4", 24, MIGs.NewST(O23WKs)),
			new Game(3133, BTs.SyllableWithSF, "第二十节 练习", "升C大调，音符到唱名(高音谱两个八度)", "treble", "C#", "4", 24, MIGs.NewST(O45WKs)),
			new Game(3134, BTs.SyllableWithSF, "第二十一节 练习", "降C大调，音符到唱名(低音谱两个八度)", "bass", "Cb", "4", 24, MIGs.NewST(O23WKs))

			// // TODO 根据谱号，识别调号名称，并记住升降音数量及名称
			// new Game(3183, BTs.SyllableWithSF, "第五节 练习", "TODO：熟记12个大调的谱号", "treble", "C", "4", 24, MIGs.NewST(O45FKs)),
			// new Game(3184, BTs.SyllableWithSF, "第六节 练习", "TODO：熟记12个大调的升降音", "bass", "C", "4", 24, MIGs.NewST(O23FKs))
		]
	)
];
