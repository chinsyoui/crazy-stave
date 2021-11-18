<script>
	import * as GameModel from '@/store/game-model.js'

    import Intro1100 from "@/views/intro-1100.vue"
    import Intro1101 from "@/views/intro-1101.vue"
    import Intro4100 from "@/views/intro-4100.vue"

    import { mapState } from 'vuex'
	
	export default {
        components: {
            Intro1100,
            Intro1101,
            Intro4100
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
			CurrentGame: state => state.CurrentGame
		}),

        mounted() {
			// mounted does not guarantee that all child components have also been mounted，this way can make sure it.
			this.$nextTick(function () {
				this.onEntireViewRendered();
            });
		},

        onUnload() {
            console.log("onUnload", this);
            this.onGameFinished();
        },

        gameFinished: false,

		methods: {
			onEntireViewRendered: function() {
				console.log("CurrentGame = ", this.CurrentGame);
			},

			onButtonClick: function(value) {
				this.onGameFinished();
                this.$store.dispatch("navigateToNextGame");
			},

			onBackClick: function() {
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
	<view class="content">
		<view class="outermost-top-bar"/>
		<view class="title-wrapper" @click="onBackClick()">
			<text class="title">{{Title}} - {{ CurrentGameCollection.DisplayName }} - {{ CurrentGame.DisplayName }}</text>
		</view>
		<block v-if="CurrentGame.Id==1100">
			<Intro1100/>
		</block>
		<block v-else-if="CurrentGame.Id==1101">
			<Intro1101/>
		</block>
		<block v-else-if="CurrentGame.Id==4100">
			<Intro4100/>
		</block>
		<block v-else>
			<text class="introduction">这里是一段文字</text>			
		</block>
		<view class="outermost-bottom-bar">
            <view class="button" v-on:click.stop="onButtonClick('next')">
                <text class="button-text">下一节</text>
            </view>
        </view>
	</view>
</template>

<style>
	.content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* border: 1px solid red; */
	}

		.outermost-top-bar {
			height: 1rem;
		}

		.title-wrapper {
			display: flex;
			flex-wrap: nowrap;
			justify-content: center;
			/* border: 1px solid red; */
		}

			.title {
				text-overflow: ellipsis;
				font-size: 1.1em;
				color: black;
			}

		.introduction {
			margin: 3em 3em;
			font-size: 1em;
		}

		.outermost-bottom-bar {
            display: flex;
            flex-direction:row-reverse;
			height: 2rem;
            width: 100%;
		}

            .button {
                font-size: 1.5em;
                padding-right: 3em;
                padding-bottom: 1em;
            }

</style>
