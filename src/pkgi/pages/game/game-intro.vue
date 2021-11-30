<script>
    import logger from '@/utils/logger.js'
	import * as GameModel from '@/store/game-model.js'

    import Intro1100 from "@/pkgi/views/intro-1100.vue"
    import Intro1101 from "@/pkgi/views/intro-1101.vue"
    import Intro1102 from "@/pkgi/views/intro-1102.vue"
    import Intro1103 from "@/pkgi/views/intro-1103.vue"
    import Intro1104 from "@/pkgi/views/intro-1104.vue"
    import Intro1110 from "@/pkgi/views/intro-1110.vue"
    import Intro1120 from "@/pkgi/views/intro-1120.vue"
    import Intro2100 from "@/pkgi/views/intro-2100.vue"
    import Intro3100 from "@/pkgi/views/intro-3100.vue"
    import Intro3101 from "@/pkgi/views/intro-3101.vue"
    import Intro4100 from "@/pkgi/views/intro-4100.vue"
    import Intro4101 from "@/pkgi/views/intro-4101.vue"
    import Intro5100 from "@/pkgi/views/intro-5100.vue"

    import { mapState } from 'vuex'
	
	export default {
        components: {
            Intro1100,
            Intro1101,
            Intro1102,
            Intro1103,
            Intro1104,
            Intro1110,
            Intro1120,
            Intro2100,
            Intro3100,
            Intro3101,
            Intro4100,
            Intro4101,
            Intro5100
        },

        data() {
			return {
				Title: '基本知识学习'
			}
		},

		// mapped reactive fields here
		computed: mapState({
			CurrentUser: state => state.CurrentUser,
			CurrentGameCollection: state => state.CurrentGameCollection,
			CurrentGame: state => state.CurrentGame, 
            hasPrevGame: state => (state.CurrentGameIndex > 0),
            hasNextGame: state => (state.CurrentGameIndex < state.CurrentGameCollection.Games.length - 1)
		}),

        mounted() {
			// mounted does not guarantee that all child components have also been mounted，this way can make sure it.
			this.$nextTick(function () {
				this.onEntireViewRendered();
            });
		},

        onUnload() {
            logger.info('PostGameAction', "back");
            this.onGameFinished();
        },

        gameFinished: false,

		methods: {
			onEntireViewRendered: function() {
				logger.info("CurrentGame = ", this.CurrentGame);
			},

			onPrevButtonClick: function(value) {
                logger.info('PostGameAction', "prev");
				this.onGameFinished();
                this.$store.dispatch("navigateToPrevGame");
			},

            onNextButtonClick: function(value) {
                logger.info('PostGameAction', "next");
				this.onGameFinished();
                this.$store.dispatch("navigateToNextGame");
			},

			onBackClick: function() {
                logger.info('PostGameAction', "back");
				this.onGameFinished(); // 返回就认为学完了
                uni.navigateBack();
			},

            onGameFinished: function() {
                if (this.$options.gameFinished)
                    return;
                this.$options.gameFinished = true;

                let gp = new GameModel.GameProgress(1,1,0,1,10,1);
				this.$store.commit('onGameFinished', gp);
			}
		}
	}
</script>

<template>
    <view class="container-flex-rows" style="display: flex; flex-direction: row; width: 100%; height: 100%">
        <view class="left-bar" style="width: 50px; height: 100%"/>
        <view class="content-center" style="flex-grow: 1; display: flex; flex-direction: column; width: 100%; height: 100%">
            <view class="top-bar title-wrapper" @click="onBackClick()">
                <text class="title">{{Title}} - {{ CurrentGameCollection.DisplayName }} - {{ CurrentGame.DisplayName }}</text>
            </view>
            <view class="container-center" style="flex-grow: 1; padding: 1em 1em 1em 1em">
                <block v-if="CurrentGame.Id==1100">
                    <Intro1100/>
                </block>
                <block v-else-if="CurrentGame.Id==1101">
                    <Intro1101/>
                </block>
                <block v-else-if="CurrentGame.Id==1102">
                    <Intro1102/>
                </block>
                <block v-else-if="CurrentGame.Id==1103">
                    <Intro1103/>
                </block>
                <block v-else-if="CurrentGame.Id==1104">
                    <Intro1104/>
                </block>
                <block v-else-if="CurrentGame.Id==1110">
                    <Intro1110/>
                </block>
                <block v-else-if="CurrentGame.Id==1120">
                    <Intro1120/>
                </block>
                <block v-else-if="CurrentGame.Id==2100">
                    <Intro2100/>
                </block>
                <block v-else-if="CurrentGame.Id==3100">
                    <Intro3100/>
                </block>
                <block v-else-if="CurrentGame.Id==3101">
                    <Intro3101/>
                </block>
                <block v-else-if="CurrentGame.Id==4100">
                    <Intro4100/>
                </block>
                <block v-else-if="CurrentGame.Id==4101">
                    <Intro4101/>
                </block>
                <block v-else-if="CurrentGame.Id==5100">
                    <Intro5100/>
                </block>
                <block v-else>
                    <view class="text-area" style="display: flex; justify-content: center; align-items: center">
                        <text class="introduction">请稍等</text>
                    </view>
                </block>
            </view>
            <view class="bottom-bar" style="display: flex; flex-direction: row; width: 100%; height: 2em">
                <view v-if="hasPrevGame" class="bottom-bar-left title-wrapper" style="height: 2em" @click="onPrevButtonClick()">
                    <text class="title">上一节</text>
                </view>
                <view class="bottom-bar-center" style="flex-grow: 1"/>
                <view v-if="hasNextGame" class="bottom-bar-right title-wrapper" style="height: 2em" @click="onNextButtonClick()">
                    <text class="title">下一节</text>
                </view>
            </view>
        </view>
        <view class="right-bar" style="width: 50px; height: 100%"/>
    </view>
</template>

<style>
    .title-wrapper {
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
    }

    .title {
        text-overflow: ellipsis;
        font-size: 1.1em;
        color: blue;
    }

    .introduction {
        margin: 3em 3em;
        font-size: 1em;
    }
</style>
