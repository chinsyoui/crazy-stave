import { BTs, MusicItemType as MIT, MusicItem as MI, GameType as GT, Game, GameCollection as GC, User } from './game-model.js'

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

// // @enum
// export const Buttons = {
// 	AllKeyRootMajorTChords: [
// 		new Button(BTs.AllKeyRootMajorTChord,"C"),
// 		new Button(BTs.AllKeyRootMajorTChord,"C#|Db"),
// 		new Button(BTs.AllKeyRootMajorTChord,"D"),
// 		new Button(BTs.AllKeyRootMajorTChord,"D#|Eb"),
// 		new Button(BTs.AllKeyRootMajorTChord,"E"),
// 		new Button(BTs.AllKeyRootMajorTChord,"E#|Fb"),
// 		new Button(BTs.AllKeyRootMajorTChord,"F"),
// 		new Button(BTs.AllKeyRootMajorTChord,"F#|Gb"),
// 		new Button(BTs.AllKeyRootMajorTChord,"G"),
// 		new Button(BTs.AllKeyRootMajorTChord,"G#|Ab"),
// 		new Button(BTs.AllKeyRootMajorTChord,"A"),
// 		new Button(BTs.AllKeyRootMajorTChord,"A#|Bb"),
// 		new Button(BTs.AllKeyRootMajorTChord,"B"),
// 		new Button(BTs.AllKeyRootMajorTChord,"B#|Cb")
// 	],
// 	WhiteKeyRootMajorTChordWithInversions: [
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"C"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"C/E"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"C/G"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"D"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"D/F#"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"D/A"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"E"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"E/G#"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"E/A"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"F"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"F/A"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"F/C"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"G"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"G/B"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"G/D"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"A"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"A/C#"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"A/E"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"B"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"B/D#"),
// 		new Button(BTs.WhiteKeyRootMajorTChordWithInversion,"B/F#")
// 	],
// 	// TODO
// 	EOF: null
// };

// @enum <Id,Name>
export const MITs = {
	Syllable: new MIT(2,"SyllableName"),// 唱名
	Pitch:  new MIT(3,"PitchName"),		// 音名
	Note: new MIT(4,"Note"),			// one stave note
	PC: new MIT(5,"PillarChord"),		// multiple stave note in a pillar chord
	AC: new MIT(6,"ArpeggioChord")		// multiple stave note in arpeggio chord, optionally under one beam line
};

// 一个种类的练习游戏，具有相同的ID/描述及同样一组(用来选择答案的)按钮。
// @enum <Id, DisplayName, ButtonType>
export const GameTypes = {
	Intro: new GT(0, "说明", BTs.Any),
	// SyllableToPitch: new GameType(12, "唱名到音名练习", BTs.Pitch),
	// PitchToSyllable: new GameType(14, "音名到唱名练习", BTs.Syllable),
	NoteToPitch: new GT(21, "音符到音名练习", BTs.Pitch),
	NoteToSyllable: new GT(22, "音符到唱名及数字练习", BTs.Syllable),
	NoteToPitchWithSF: new GT(23, "音符到音名练习-带升降号", BTs.PitchWithSF),
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

// 预定义的五线谱音符模板集
//  VF.StaveNote( {clef: "treble", keys: ["E#/5"], duration: "8d" })
//     .addAccidental(0, new VF.Accidental("#")).addDotToAll();
//  上面代码的意思是：将第5个八度里的E#音符，以1/8音符带付点，显示在高音谱上，升号#也显示出来
	  
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

// 值的格式：第一位为0/1/2转位号码,其余字符为和弦名称
const O2WKOnlyCPTChordsWithCI = [ // "低音谱，低八度，白键" 为根音及三五音的紧凑型柱式三和弦, 包括转位
	new MI(MITs.PC, "C/2,E/2,G/2", "0C"),
	new MI(MITs.PC, "E/2,G/2,C/3", "1C/E"),
	new MI(MITs.PC, "G/2,C/3,E/3", "2C/G"),
	new MI(MITs.PC, "D/2,F/2,A/2", "0Dm"),
	new MI(MITs.PC, "F/2,A/2,D/3", "1Dm/F"),
	new MI(MITs.PC, "A/2,D/3,F/3", "2Dm/A"),
	new MI(MITs.PC, "E/2,G/2,B/2", "0Em"),
	new MI(MITs.PC, "G/2,B/2,E/3", "1Em/G"),
	new MI(MITs.PC, "B/2,E/3,G/3", "2Em/B"),
	new MI(MITs.PC, "F/2,A/2,C/2", "0F"),
	new MI(MITs.PC, "A/2,C/2,F/3", "1F/A"),
	new MI(MITs.PC, "C/2,F/3,A/3", "2F/C"),
	new MI(MITs.PC, "G/2,B/2,D/3", "0G"),
	new MI(MITs.PC, "B/2,D/3,G/3", "1G/B"),
	new MI(MITs.PC, "D/3,G/3,B/3", "2G/D"),
	new MI(MITs.PC, "A/2,C/3,E/3", "0Am"),
	new MI(MITs.PC, "C/3,E/3,A/3", "1Am/C"),
	new MI(MITs.PC, "E/3,A/3,C/4", "2Am/E"),
	new MI(MITs.PC, "B/2,D/3,F/3", "0Bsus"),
	new MI(MITs.PC, "D/3,F/3,B/3", "1Bsus/D"),
	new MI(MITs.PC, "B/3,D/4,F/4", "2Bsus/B")
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

// 值的格式：第一位为0/1/2转位号码,其余字符为和弦名称
const O4WKOnlyCPTChordsWithCI = [ // "高音谱，基本八度，白键" 为根音及三五音的紧凑型柱式三和弦, 包括转位
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
	new MI(MITs.PC, "B/5,D/6,F/6", "2Bsus/B")
];

const O4WKOnlyCATChords = [ // "高音谱，基本八度，白键" 为根音及三五音的紧凑型分解三和弦
	new MI(MITs.AC, "C/4,E/4,G/4", "C"),
	new MI(MITs.AC, "D/4,F/4,A/4", "D"),
	new MI(MITs.AC, "E/4,G/4,B/4", "E"),
	new MI(MITs.AC, "F/4,A/4,C/5", "F"),
	new MI(MITs.AC, "G/4,B/4,D/5", "G"),
	new MI(MITs.AC, "A/4,C/5,E/5", "A"),
	new MI(MITs.AC, "B/4,D/5,F/5", "B")
];

const O4WKOnlyOPTChords = [ // "高音谱，基本八度，白键" 为根音及三五音的八度型柱式三和弦
	new MI(MITs.PC, "C/4,G/4,C/5", "C"),
	new MI(MITs.PC, "D/4,A/4,D/5", "D"),
	new MI(MITs.PC, "E/4,B/4,E/5", "E"),
	new MI(MITs.PC, "F/4,C/5,F/5", "F"),
	new MI(MITs.PC, "G/4,D/5,G/5", "G"),
	new MI(MITs.PC, "A/4,E/5,A/5", "A"),
	new MI(MITs.PC, "B/4,F/5,B/5", "B")
];


const O4WKOnlyOATChords = [ // "高音谱，基本八度，白键" 为根音及三五音的八度型分解三和弦
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

const O5WKOnlyCPTChords = [ // "高音谱，高八度，白键" 为根音及三五音的紧凑型柱式三和弦
	new MI(MITs.PC, "C/5,E/5,G/5", "C"),
	new MI(MITs.PC, "D/5,F/5,A/5", "D"),
	new MI(MITs.PC, "E/5,G/5,B/5", "E"),
	new MI(MITs.PC, "F/5,A/5,C/6", "F"),
	new MI(MITs.PC, "G/5,B/5,D/6", "G"),
	new MI(MITs.PC, "A/5,C/6,E/6", "A"),
	new MI(MITs.PC, "B/5,D/6,F/6", "B")
];


const O5WKOnlyCATChords = [ // "高音谱，高八度，白键" 为根音及三五音的紧凑型分解三和弦
	new MI(MITs.AC, "C/5,E/5,G/5", "C"),
	new MI(MITs.AC, "D/5,F/5,A/5", "D"),
	new MI(MITs.AC, "E/5,G/5,B/5", "E"),
	new MI(MITs.AC, "F/5,A/5,C/6", "F"),
	new MI(MITs.AC, "G/5,B/5,D/6", "G"),
	new MI(MITs.AC, "A/5,C/6,E/6", "A"),
	new MI(MITs.AC, "B/5,D/6,F/6", "B")
];


const O5WKOnlyOPTChords = [ // "高音谱，高八度，白键" 为根音及三五音的八度型柱式三和弦
	new MI(MITs.PC, "C/5,G/5,C/6", "C"),
	new MI(MITs.PC, "D/5,A/5,D/6", "D"),
	new MI(MITs.PC, "E/5,B/5,E/6", "E"),
	new MI(MITs.PC, "F/5,C/5,F/6", "F"),
	new MI(MITs.PC, "G/5,D/6,G/6", "G"),
	new MI(MITs.PC, "A/5,E/6,A/6", "A"),
	new MI(MITs.PC, "B/5,F/6,B/6", "B")
];

const O5WKOnlyOATChords = [ // "高音谱，高八度，白键" 为根音及三五音的八度型分解三和弦
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
const O23WKsEx = [ ...O23WKs ];  // 低音谱，两个八度，上下各再加两个音符，白键

const O45WKs = [ ...O4WKs,  ...O5WKs ]; // 高音谱，两个八度，白键
// TODO
const O45WKsEx = [ ...O45WKs ];  // 高音谱，两个八度，上下再加两个音符，白键

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

export const PredefinedGameCollections = [
	 // id, display_name, description, icon, games
	new GC(11,"第一章","零基础入门","",
		[   //  Game: id, type, display_name, clef, keysig, music_items_count, template_music_items
			new Game(1100, GTs.Intro, "预备知识", "treble", "C", 0, []),
			new Game(1101, GTs.Intro, "基本介绍：五线谱，音符，唱名，音名", "treble", "C", 0, []),

			new Game(1111, GTs.NoteToPitch, "音符到音名(高音谱基本八度)", "treble", "C", 12, O4WKs),
			new Game(1112, GTs.NoteToPitch, "音符到音名(低音谱基本八度)", "bass", "C", 12, O3WKs),
			new Game(1113, GTs.NoteToPitch, "音符到音名(高音谱高八度)", "treble", "C", 12, O5WKs),
			new Game(1114, GTs.NoteToPitch, "音符到音名(低音谱低八度)", "bass", "C", 12, O2WKs),
			
			new Game(1115, GTs.NoteToSyllable, "音符到唱名(高音谱基本八度)", "treble", "C", 12, O4WKs),
			new Game(1116, GTs.NoteToSyllable, "音符到唱名(低音谱基本八度)", "bass", "C", 12, O3WKs),
			new Game(1117, GTs.NoteToSyllable, "音符到唱名(高音谱高八度)", "treble", "C", 12, O5WKs),
			new Game(1118, GTs.NoteToSyllable, "音符到唱名(低音谱低八度)", "bass", "C", 12, O2WKs)
		]
	),
	new GC(21,"第二章","音符练习","",
		[
			new Game(2100, GTs.Intro, "基本介绍：快速识别音符的技巧", "treble", "C", 0, []),

			new Game(2111, GTs.NoteToPitch, "音符到音名(高音谱两个八度)", "treble", "C", 24, O45WKs), 
			new Game(2112, GTs.NoteToPitch, "音符到音名(低音谱两个八度)", "bass", "C", 24, O23WKs),
			new Game(2113, GTs.NoteToPitch, "音符到音名(高音谱两个八度+)", "treble", "C", 24, O45WKsEx),
			new Game(2114, GTs.NoteToPitch, "音符到音名(低音谱两个八度+)", "bass", "C", 24, O23WKsEx),

			new Game(2115, GTs.NoteToSyllable, "音符到唱名(高音谱两个八度)", "treble", "C", 24, O45WKs), 
			new Game(2116, GTs.NoteToSyllable, "音符到唱名(低音谱两个八度)", "bass", "C", 24, O23WKs),
			new Game(2117, GTs.NoteToSyllable, "音符到唱名(高音谱两个八度+)", "treble", "C", 24, O45WKsEx),
			new Game(2118, GTs.NoteToSyllable, "音符到唱名(低音谱两个八度+)", "bass", "C", 24, O23WKsEx)
		]
	),
	new GC(31,"第三章","基本练习-升降号及调式","",
		[
			new Game(3100, GTs.Intro, "认识升降号", "treble", "C", 0, []),
			new Game(3101, GTs.Intro, "认识调式", "treble", "C", 0, []),

			new Game(3111, GTs.NoteToPitchWithSF, "带升降号，音符到音名(高音谱两个八度)", "treble", "C", 24, O45FKs),
			new Game(3112, GTs.NoteToPitchWithSF, "带升降号，音符到音名(低音谱两个八度)", "bass", "C", 24, O23FKs),
			
			// TODO 根据谱号，识别调号名称，并记住升降音数量及名称
			new Game(3113, GTs.NoteToPitchWithSF, "TODO：熟记12个大调的谱号", "treble", "C", 24, O45FKs),
			new Game(3114, GTs.NoteToPitchWithSF, "TODO：熟记12个大调的升降音", "bass", "C", 24, O23FKs)
		]
	),
	new GC(41,"第四章","基本练习：度数","",
		[
			new Game(4100, GTs.Intro, "认识度数", "treble", "C", 0, []),

			new Game(4111, GTs.DoubleNoteDegree, "双音度数识别(高音谱两个八度)", "treble", "C", 24, O45WKs),
			new Game(4112, GTs.DoubleNoteDegree, "双音度数识别(低音谱两个八度)", "bass", "C", 24, O23WKs)
		]
	),
	new GC(51,"第五章","基本练习：三和弦及转位","",
		[
			new Game(5100, GTs.Intro, "认识三和弦及转位", "treble", "C", 0, []),

			new Game(5111, GTs.TCCI, "视谱：三和弦转位（紧凑柱式型), 高音谱", "treble", "C", 12, O4WKOnlyCPTChordsWithCI),
			new Game(5112, GTs.TCCI, "视谱：三和弦转位（紧凑分解型), 高音谱", "treble", "C", 12, O4WKOnlyCPTChordsWithCI),
			new Game(5113, GTs.TCCI, "视谱：三和弦转位（紧凑柱式型), 低音谱", "bass", "C", 12, O2WKOnlyCPTChordsWithCI),
			new Game(5114, GTs.TCCI, "视谱：三和弦转位（紧凑分解型), 低音谱", "bass", "C", 12, O2WKOnlyCPTChordsWithCI),

			// TODO 八度型, 四个键
			new Game(5115, GTs.TCCI, "视谱：三和弦转位（八度柱式型), 高音谱", "treble", "C", 12, O4WKOnlyCPTChordsWithCI),
			new Game(5116, GTs.TCCI, "视谱：三和弦转位（八度分解型), 高音谱", "treble", "C", 12, O4WKOnlyCPTChordsWithCI),
			new Game(5117, GTs.TCCI, "视谱：三和弦转位（八度柱式型), 低音谱", "bass", "C", 12, O2WKOnlyCPTChordsWithCI),
			new Game(5118, GTs.TCCI, "视谱：三和弦转位（八度分解型), 低音谱", "bass", "C", 12, O2WKOnlyCPTChordsWithCI)
		]
	),
	new GC(61,"第六章","三和弦-基本练习","",
		[
			new Game(6100, GTs.Intro, "基本介绍：和弦及转位", "treble", "C", 0, []),

			new Game(6111, GTs.CPTChordsNaming, "紧凑柱式三和弦练习(低音谱基本八度)", "bass", "C", 12, O3WKOnlyCPTChords),
			new Game(6112, GTs.CATChordsNaming, "紧凑分解三和弦练习(低音谱基本八度)", "bass", "C", 12, O3WKOnlyCATChords),
			new Game(6113, GTs.OPTChordsNaming, "八度柱式三和弦练习(低音谱基本八度)", "bass", "C", 12, O3WKOnlyOPTChords),
			new Game(6114, GTs.OATChordsNaming, "八度分解三和弦练习(低音谱基本八度)", "bass", "C", 12, O3WKOnlyOATChords),

            new Game(6115, GTs.CPTChordsNaming, "紧凑柱式三和弦练习(高音谱基本八度)", "treble", "C", 12, O4WKOnlyCPTChords),
			new Game(6116, GTs.CATChordsNaming, "紧凑分解三和弦练习(高音谱基本八度)", "treble", "C", 12, O4WKOnlyCATChords),
			new Game(6117, GTs.OPTChordsNaming, "八度柱式三和弦练习(高音谱基本八度)", "treble", "C", 12, O4WKOnlyOPTChords),
			new Game(6118, GTs.OATChordsNaming, "八度分解三和弦练习(高音谱基本八度)", "treble", "C", 12, O4WKOnlyOATChords)
		]
	),
	new GC(71,"第七章","三和弦-中级练习","",
		[
			new Game(7100, GTs.Intro, "基本介绍：各种常用和弦织体", "treble", "C", 0, []),

            new Game(7111, GTs.CPTChordsNaming, "紧凑柱式三和弦练习(低音谱两个八度)", "bass", "C", 12, O23WKOnlyCPTChords),
			new Game(7112, GTs.CATChordsNaming, "紧凑分解三和弦练习(低音谱两个八度)", "bass", "C", 12, O23WKOnlyCATChords),
			new Game(7113, GTs.OPTChordsNaming, "八度柱式三和弦练习(低音谱两个八度)", "bass", "C", 12, O23WKOnlyOPTChords),
			new Game(7114, GTs.OATChordsNaming, "八度分解三和弦练习(低音谱两个八度)", "bass", "C", 12, O23WKOnlyOATChords),

            new Game(7115, GTs.CPTChordsNaming, "紧凑柱式三和弦练习(高音谱两个八度)", "treble", "C", 12, O45WKOnlyCPTChords),
			new Game(7116, GTs.CATChordsNaming, "紧凑分解三和弦练习(高音谱两个八度)", "treble", "C", 12, O45WKOnlyCATChords),
			new Game(7117, GTs.OPTChordsNaming, "八度柱式三和弦练习(高音谱两个八度)", "treble", "C", 12, O45WKOnlyOPTChords),
			new Game(7118, GTs.OATChordsNaming, "八度分解三和弦练习(高音谱两个八度)", "treble", "C", 12, O45WKOnlyOATChords)
		]
	),
	new GC(81,"第八章","三和弦-高级练习","",
		[
			new Game(8100, GTs.Indroduction, "基本介绍: 和弦快速识谱技巧", "treble", "C", 0, []),

			new Game(8111, GTs.CPTChordsNaming, "紧凑柱式三和弦练习(低音谱两个八度)(带升降号)", "bass", "C", 12, O23FKs),
			new Game(8112, GTs.CATChordsNaming, "紧凑分解三和弦练习(低音谱两个八度)(带升降号)", "bass", "C", 12, O23FKs),
			new Game(8113, GTs.OPTChordsNaming, "八度柱式三和弦练习(低音谱两个八度)(带升降号)", "bass", "C", 12, O23FKs),
			new Game(8114, GTs.OATChordsNaming, "八度分解三和弦练习(低音谱两个八度)(带升降号)", "bass", "C", 12, O23FKs),

            new Game(8115, GTs.CPTChordsNaming, "紧凑柱式三和弦练习(高音谱两个八度)(带升降号)", "treble", "C", 12, O45FKs),
			new Game(8116, GTs.CATChordsNaming, "紧凑分解三和弦练习(高音谱两个八度)(带升降号)", "treble", "C", 12, O45FKs),
			new Game(8117, GTs.OPTChordsNaming, "八度柱式三和弦练习(高音谱两个八度)(带升降号)", "treble", "C", 12, O45FKs),
			new Game(8118, GTs.OATChordsNaming, "八度分解三和弦练习(高音谱两个八度)(带升降号)", "treble", "C", 12, O45FKs)
		]
	)
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
