import { ObjectMap } from "@/utils/ObjectMap.js"
import * as GameModel from './game-model.js'
import { BTs } from '@/store/game-model.js'
import { PredefinedGameCollections } from './game-content.js'

// save app state to persistent storage
function save(state) {
    //console.log("saving state: ", state);

    uni.setStorageSync("Users", state.Users);
	uni.setStorageSync("CurrentUserId",state.CurrentUser.Id);

    //console.log("Users", uni.getStorageSync("Users"));
	//console.log("CurrentUserId", uni.getStorageSync("CurrentUserId"));

    //console.log("app state saved: ", state);
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
		Users: null, // @Array[]

		CurrentUser: null, //@Object
		CurrentGameCollections: null,

		CurrentGameCollection: null, //@Object

		CurrentGame: null, //@Object
        CurrentGameIndex: 0, // Number

		CurrentGameProgress: new GameModel.GameProgress(0, 0, 0, 0, 0, 0),
		CurrentGameItemIndex: 0,

		EOF: null
	},

    mutations: {
		///////////////////////////////////////
		// init app state
		init(state) {
			console.log("initing state", state);
			//console.log("PredefinedGameCollections: ", PredefinedGameCollections);
			
            let users = null;
            let current_user_id = -1;

            try {
                current_user_id = uni.getStorageSync("CurrentUserId");
                let _users = uni.getStorageSync("Users");
                if (_users && _users instanceof Array && _users.length > 0) {
                    users = new Array();
                    _users.forEach((_user) => { 
                        let user = GameModel.NewUserFromJo(_user);
                        //console.log("@@@@@ user = ", user);
                        users.push(user);
                    });
                }
            } catch (e) {
                console.log("try load state from local storage failed: ", e);
            }

            console.log("loaded Users = ", users);
            console.log("loaded CurrentUserId = ", current_user_id);
        
			if (!state.users) {
                if (users && users.length > 0 && (current_user_id >= 0)) {
                    console.log("saved state loaded");

                    // overwrite with built-in game collections, because we're frenquently updating.
                    users[0].GameCollections = PredefinedGameCollections;

                    state.Users = users;
                    state.CurrentUser = state.Users[0];
                } else {
                    console.log("init default state");

                    let user = new GameModel.User(0, "主用户", "icon-url", PredefinedGameCollections, 0, new ObjectMap());
                    console.assert(user.GameCollections && user.GameCollections.length > 0, "no games");
                    console.assert(user.GameCollectionStates && user.GameCollectionStates.mapItemsCount == 0, "game collection state not empty");

                    state.Users = [user];
                    state.CurrentUser = user;

                    save(state);
                }
			}

			console.log("state inited: ", state);
		},

		///////////////////////////////////////
		setCurrentUser(state, user) {
			console.log('setCurrentUser', state, user);
			console.assert(user);

			state.CurrentUser = user;
			state.CurrentGameCollections = user.GameCollections;

            save(state);
		},

        setCurrentGameCollection(state, game_collection) {
			console.log('setCurrentGameCollection', state, game_collection);

            state.CurrentUser.CurrentGameCollectionId = game_collection.Id;
			state.CurrentGameCollection = game_collection;

            save(state);
		},

        // vuex mutations only support one additional parameter.
        // params = { game, index }
        setCurrentGame(state, params) {
            let game = params.game; let index = params.index;
			console.log('setCurrentGame', state, game, index);

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
            state.CurrentGameIndex = index;

			// make sure game progress is reset to default
			GameModel.SetGameProgress(state.CurrentGameProgress, game.MusicItemsCount, 0, 0, 0, 0, 0);
			state.CurrentGameItemIndex = 0;

			save(state);
		},

        setCurrentGameItemIndex(state, index) {
			//console.log('setCurrentGameItemIndex', state, index);
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
		},
        
        // close current game and navigate to next game in current game collection.
        // return false if no game in current game collection.
        // must called inside a game page.
        redirectToGamePage(state, game) {
            let page_url = "";
            if (game.Type.ButtonType == BTs.Any)
                page_url = "/subpkg/pages/game/game-player-intro";
            else
                page_url = "/pages/game/game-player-ex";
            uni.redirectTo({ url: page_url });
        }        
	},

    getters: {
		// currentColor(state) {
		// 	return state.colorList[state.colorIndex]
		// }
	},

    actions: {
        // close current game and navigate to next game in current game collection.
        // return false if no game in current game collection.
        // must called inside a game page.
        navigateToNextGame: function(context) {
            let state = context.state;
            console.log("navigateToNextGame", state);

            let nextIndex = state.CurrentGameIndex + 1;
            if (nextIndex >= state.CurrentGameCollection.Games.length)
                return false;

            let nextGame = state.CurrentGameCollection.Games[nextIndex];
            context.commit('setCurrentGame', { game: nextGame, index: nextIndex} );
            context.commit('redirectToGamePage', nextGame);
        },

        // replay current game again
        // must called inside a game page.
        replayCurrentGame: function(context) {
            let state = context.state;
            console.log("replayCurrentGame", state);

            context.commit('setCurrentGame', { game: state.CurrentGame, index : state.CurrentGameIndex });
            context.commit('redirectToGamePage', state.CurrentGame);
        }
	}
})

export default store
