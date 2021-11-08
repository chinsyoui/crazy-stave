<script>
	import { mapState, mapMutations, mapActions } from 'vuex'
	
	export default {
		data() {
			return {
				Title: 'Game-Player-Intro'
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
				console.log(this.Title + "." + "onButtonClick: ", value);
				this.onGameFinished();
				this.navigateBack();
			},
			onBackClick: function() {
				this.navigateBack();
			},
			onGameFinished: function() {
				// TODO we may update this.CurrentGameProgress if we ant
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
		<block v-if="CurrentGameCollection.Id==0">
			<intro-0/>
		</block>
		<block v-if="CurrentGameCollection.Id==10">
			<intro-1/>
		</block>
		<block v-if="CurrentGameCollection.Id>10">
			<text class="introduction"> TODO: Introduction Text Here</text>			
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
		border: 1px solid red;
	}

		.outermost-top-bar {
			height: 2rem;
		}

		.title-wrapper {
			display: flex;
			flex-wrap: nowrap;
			justify-content: center;
			border: 1px solid red;
		}

			.title {
				text-overflow: ellipsis;
				font-size: 1em;
				color: #8f8f94;
				border: 1px solid red;
			}

		.introduction {
			margin: 3em 3em;
			font-size: 1em;
		}

		.outermost-bottom-bar {
			height: 2rem;
		}
</style>
