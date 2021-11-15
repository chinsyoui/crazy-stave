import { ObjectMap } from "@/utils/ObjectMap.js"
import * as GameModel from './game-model.js'
import { PredefinedGameCollections } from './game-content.js'

// save app state to persistent storage
function save(state) {
    console.log("save state: ", state);
	return; 
	
	console.log("save: ", state);
	// TODO 
	uni.setStorageSync("Users", state.Users);
	uni.setStorageSync("CurrentUserId",state.CurrentUser.Id);
	console.log("Users", uni.getStorageSync("Users"));
	console.log("CurrentUserId", uni.getStorageSync("CurrentUserId"));
	console.log("app state saved: ", state);
};

// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
// #endif

// #ifdef VUE3
import { createStore } from 'vuex'
//import { createLogger } from 'vuex'

const store = createStore({
// #endif

///////////////////////////////////////////////////////////////////////////
//    plugins: [createLogger()],
	state: {
		Root: null,
		Users: [], // @Array[]

		CurrentUser: null, //@Object
		CurrentGameCollections: null,

		CurrentGameCollection: null, //@Object
		CurrentGames: null,

		CurrentGame: null, //@Object

		CurrentGameProgress: new GameModel.GameProgress(0, 0, 0, 0, 0, 0),
		CurrentGameItemIndex: 0,

		EOF: null
	},

    mutations: {
		///////////////////////////////////////
		// init app state
		init(state) {
			// console.log("Users", uni.getStorageSync("Users"));
			// console.log("CurrentUserId", uni.getStorageSync("CurrentUserId"));

			// state.Users = uni.getStorageSync("Users");
			// let current_user_id = uni.getStorageSync("CurrentUserId");
			// state.Root = new GameModel.Root(current_user_id, state.Users);
			// state.CurrentUser = state.Users[0];

			console.log('state.init', state);
			console.log('PredefinedGameCollections = ', PredefinedGameCollections);
			
			if (!state.Root) {
				let user = new GameModel.User(0, "主用户", "icon-url", PredefinedGameCollections, 0, new ObjectMap());
				console.assert(user.GameCollections && user.GameCollections.length > 0, "no games");
                console.assert(user.GameCollectionStates && user.GameCollectionStates.mapItemsCount == 0, "game collection state not empty");

				console.log('add default user', user);
                Vue.set(state.Users, state.Users.length, user);

				state.Root = new GameModel.Root(user.id, [ user ]);
				state.Users = state.Root.Users;
				state.CurrentUser = user;

				save(state);
			}

			console.log('state = ', state);
		},

		///////////////////////////////////////
		// load app state from persistent storage
		load(state) {
			console.log("load: ", state);
			// TODO 
			console.log("app state loaded: ", state);
		},
		
		///////////////////////////////////////
		setCurrentUser(state, user) {
			console.log('setCurrentUser', state, user);
			console.assert(user);

			state.Root.CurrentUserId = user.Id;
			state.CurrentUser = user;
			state.CurrentGameCollections = user.GameCollections;

            save(state);
		},

        setCurrentGameCollection(state, game_collection) {
			console.log('setCurrentGameCollection', state, game_collection);

            state.CurrentUser.CurrentGameCollectionId = game_collection.Id;
			state.CurrentGameCollection = game_collection;
			state.CurrentGames = game_collection.Games;

            save(state);
		},

        setCurrentGame(state, game) {
			console.log('setCurrentGame', state, game);

            let gcId = state.CurrentUser.CurrentGameCollectionId;
			let gcStates = state.CurrentUser.GameCollectionStates;
			console.assert(gcStates);

			// if game collection state not exists, create and add it
			let gcState = gcStates.getMapItem(gcId);
			if (!gcState) {
				gcState = new GameModel.GameCollectionState(game.Id, 0, new ObjectMap());
				gcStates.setMapItem(gcId, gcState);
                state.CurrentUser.GameCollectionStatesSize = gcStates.mapItemsCount;
			}

			// now update CurrentGameId anyway
			gcState.CurrentGameId = game.Id;

			// update CurrentGame
			state.CurrentGame = game;

			// make sure game progress is reset to default
			GameModel.SetGameProgress(state.CurrentGameProgress, state.CurrentGame.MusicItemsCount, 0, 0, 0, 0, 0);
			state.CurrentGameItemIndex = 0;

			save(state);
		},

        setCurrentGameItemIndex(state, index) {
			console.log('setCurrentGameItemIndex', state, index);
			state.CurrentGameItemIndex = index;
		},

		///////////////////////////////////////
		onGameFinished(state, game_progress) {
			console.log("onGameFinished", state, game_progress);
			// note: the following line always throw exception setAttribute with 0 blah blah
			// uni.showToast("onGameFinished");

			// update game state by this game progress
			let gcStates = state.CurrentUser.GameCollectionStates;
			console.assert(gcStates);

			// find parent game collection state
			let gcState = gcStates.getMapItem(state.CurrentGameCollection.Id);
			console.assert(gcState);

			// find game state, create if not found
			let game_state = gcState.GameStates.getMapItem(state.CurrentGame.Id);
			if (!game_state) {
				game_state = new GameModel.GameState(0, 0, 0, 0);
				gcState.GameStates.setMapItem(state.CurrentGame.Id, game_state);
			}

			// update game state
			game_state.TotalPlayCount ++;
			game_state.TotalPlayDuration += game_progress.ElapsedSeconds;
			if (game_progress.Score > game_state.HighestScore)
				game_state.HighestScore = game_progress.Score;
			game_state.Stars += game_progress.Stars;

			// update game collection state
			gcState.Stars += game_progress.Stars;

			save(state);
		},

		///////////////////////////////////////
		addUser(state, user) {
			console.log("addUser", state, user);
			// TODO
			uni.showToast("addUser");
		},
		removeUser(state, user) {
			console.log("removeUser", state, user);
			// TODO
			uni.showToast("removeUser");
		},
		addGameCollection(state, game_collection) {
			console.log("addGameCollection", state, game_collection);
			// TODO
			uni.showToast("addGameCollection");
		},
		removeGameCollection(state, game_collection) {
			console.log("removeGameCollection", state, game_collection);
			// TODO
			uni.showToast("removeGameCollection");
		},
		addGame(state, game) {
			console.log("addGame", state, game);
			// TODO
			uni.showToast("addGame");
		},
		removeGame(state, game) {
			console.log("removeGame", state, game);
			// TODO
			uni.showToast("removeGame");
		}		
	},

    getters: {
		// currentColor(state) {
		// 	return state.colorList[state.colorIndex]
		// }
	},

    actions: {
	}
})

export default store
