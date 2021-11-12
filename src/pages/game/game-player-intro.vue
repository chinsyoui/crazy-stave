<script>
    import Intro1100 from "@/views/intro-1100.vue";
    import Intro1101 from "@/views/intro-1101.vue";
    import Intro4100 from "@/views/intro-4100.vue";

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
			CurrentGame: state => state.CurrentGame,
			CurrentGameProgress: state => state.CurrentGameProgress
		}),

        mounted() {
			// mounted does not guarantee that all child components have also been mounted，this way can make sure it.
			this.$nextTick(function () {
				this.onEntireViewRendered();
		  })
		},

		methods: {
			onEntireViewRendered() {
				console.log("CurrentGame = ", this.CurrentGame);
			},
			onButtonClick: function(value) {
				this.onGameFinished();
				this.navigateBack();
			},
			onBackClick: function() {
				this.onGameFinished(); // 返回就认为学完了
				this.navigateBack();
			},
			onGameFinished: function() {
				// TODO we may update this.CurrentGameProgress if we want
				this.$store.commit('onGameFinished', this.CurrentGameProgress);
			},
			navigateBack: function() {
				uni.reLaunch({ url: '/pages/game/game-list' });
			}
		},
	}
</script>

<template>
	<view class="content">
		<view class="outermost-top-bar"/>
		<view class="title-wrapper" @click="onBackClick()">
			<text class="title">{{Title}} - {{ CurrentUser.DisplayName }} - {{ CurrentGameCollection.DisplayName }} - {{ CurrentGame.DisplayName }}</text>
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
			<text class="introduction">TODO: Introduction Text Here</text>			
		</block>
		<view class="outermost-bottom-bar"/>
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
				/* border: 1px solid red; */
			}

		.introduction {
			margin: 3em 3em;
			font-size: 1em;
		}

		.outermost-bottom-bar {
			height: 2rem;
		}
</style>
