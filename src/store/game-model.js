if (!console.assert) console.assert = (condition, ...info) => { if (!condition) console.log("assertion failed:", info); };

// user press button to choose their answner for current question,
// there are many different type of button sets, buttons in each set are same type,
// @enum ButtonType = Number

// here are all button types we supported.
// @enum 注释掉的是已经设计好但当前不支持的
export const BTs = {
	Any: 0,							 // 任意按钮，用于介绍性界面
	Syllable: 2,					 // 7个唱名按钮
	SyllableWithSF : 3,		 		 // 七个数字，每个包括升降号，一共21个按钮，两行排列
	Pitch: 5,						 // 7个音名按钮
	PitchWithSF: 6,			 		 // 七个音名，每个包括升降号，一共21个按钮，两行排列
	Degree: 10,						 // 两个音符之间的度数，常用的有2/3/4/5/6/8度(不分大小度)
	CI: 11,				 			 // 三和弦转位, 常见的有0/1/2三种
	// TCWithCI: 7,   				 // 3个三和弦位置按钮：原位，第一转位，第二转位
	WKOnlyTC: 20,      				 // 7个只包含白键的三和弦钮,不带转位: C,Dm,Em,F,G,Am,Bsus
	WKOnlyWithCI: 21,      			 // 21个只包含白键的三和弦钮,以及转位
	WKRootMajTC: 22, 				 // 7个以白键为根音的大三和弦按钮,不带转位: C,D,E,F,G,A,B
	WKRootMajTCWithCI: 23, 			 // 21个以白键为根音的大三和弦,以及转位
	WKRootMinTC: 24, 			     // 7个以白键为根音的小三和弦,不带转位: Cm,Dm,Em,Fm,Gm,Am,Bm
	WKRootMinTCWithCI: 25, 			 // 21个以白键为根音的小三和弦,以及转位
	FKRootMajTC: 26,   				 // 12个大三和弦,不带转位: C,C#/Db,D,D#/Eb,E,F,F#/Gb,G,G#/Ab,A,A#/Bb,B/Cb
	FKRootMajTCWithCI: 27,   		 // 36个大三和弦,带转位: C,C#/Db,D,D#/Eb,E,F,F#/Gb,G,G#/Ab,A,A#/Bb,B/Cb
	FKRootMinTC: 28,   			     // 12个小三和弦按钮,不带转位: Cm,C#m/Dbm,Dm,D#m/Ebm,Em,Fm,F#m/Gbm,Gm,G#m/Abm,Am,A#m/Bbm,Bm/Cbm
	WKRootMajTCWithCI: 30, 			// 所有以白键位根音的大三和弦按钮，带转位，共21个
	// FKRootMajTCWithCI: 31,   	// 所有大三和弦按钮，带转位，共36个
	// FingeringType: 50,			// 12个指法按钮(三和弦的紧凑型及八度型): 左手531/521/542/532/321, 右手135/125/123/124/245
	EOF: 99
};

// let gt1 = new GameType();
// if (gt1 instanceof GameType)

// a music item is one question displayed that require user to answner,
// user answner this question by press one button among a list of displayed buttons.
// music item have many types, each type has a unique id and a name.
//@class <Number, String>
export function MusicItemType(id, name) {
	this.Id = id;
	this.Name = name;
    return this;
};

// a music item is a question that user can answner.
// each music item has a type, source value is displayed to user,
// target is used to match the answner, which is hidden to user.
//@class <MusicItemType, String, String>
export function MusicItem(type, source_value, target_value) {
	this.Type = type;
	this.SourceValue = source_value;
	this.TargetValue = target_value;
    return this;
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
    return this;
};

// 一个五线谱练习游戏，有:
//   一个ID/名称,
//   一个类型，同时关联指定了MusicItem的类型及按钮的类型ButtonType
//   一个谱号，一个调号，
//   一个MusicItem的总个数，以及一个用来生成MusicItem的生成器
// 当练习游戏开始时，将用该生成器来随机生成实际游戏中的音乐项。
//@class <Number, GameType, String, String, String, String, Number, String>
export function Game(id, type, display_name, description, stave_clef, stave_keysig, music_items_count, music_items_generaor) {
	this.Id = id;
	this.Type = type;
	this.DisplayName = display_name;
    this.Description = description;
	this.StaveClef = stave_clef;
	this.StaveKeySig = stave_keysig;
	this.MusicItemsCount = music_items_count;
	this.MusicItemsGenerator = music_items_generaor;
    return this;
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
    return this;
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
    return this;
};

// a game collection state.
// @class <Number, Number, Map<Number,GameState>>
// @param current_game_id: latest/current played game's id
// @param stars: total stars user earned in corresponding GameCollection
// @param game_states: a map <GameId, GameState> stores played games' states
export function GameCollectionState(current_game_id, stars, game_states) {
	this.CurrentGameId = current_game_id;
	this.Stars = stars;
	this.GameStates = game_states;
    return this;
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
    return this;
};

export function SetGameProgress(game_progress, 
	total_item_count, completed_item_count, error_item_count, elapsed_seconds, score, stars) {
	game_progress.TotalItemCount = total_item_count;
	game_progress.CompletedItemCount = completed_item_count;
	game_progress.ErrorItemCount = error_item_count;
	game_progress.ElapsedSeconds = elapsed_seconds;
	game_progress.Score = score;
	game_progress.Stars = stars;
}

// user (aka. the game player, the user that answner questions, etc).
// each user have a unique id, a display name, a icon, its own game collections and play states.
// @class (Number, String, String, GameCollection[], Number, Map<Number,GameCollectionState>)
// @param game_collections: array of game collections for this user, include both predefined game collections and custom defined game collections
// @param current_game_collection_id: latest/current played game collection's id
// @param game_collection_states: a map <GameCollectionId, GameCollectionState> stores played game collections' states
export function User(id, display_name, icon, game_collections, current_game_collection_id, game_collection_states) {
	this.Id = id;
	this.DisplayName = display_name;
	this.Icon = icon;
	this.GameCollections = game_collections;
	this.CurrentGameCollectionId = current_game_collection_id;
	this.GameCollectionStates = game_collection_states;
    // patch: mp-weixin: vue template can't found 'size’ property in this.GameCollectionStates, don't know why, just fix it
    this.GameCollectionStatesSize = this.GameCollectionStates.size;
    return this;
};

export function Root(current_user_id, users) {
	this.CurrentUserId = current_user_id;
	this.Users = users;
    return this;
}
