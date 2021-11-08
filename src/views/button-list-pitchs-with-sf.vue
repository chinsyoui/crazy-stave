<script>
    export default {
		data() {
			return {
				TextOfAccidentalButtons: [ "b","#","b","#","b","#","b","#","b","#","b","#","b","#" ],
				ValueOfAccidentalButtons: [ "Cb","C#","Db","D#","Eb","E#","Fb","F#","Gb","G#","Ab","A#","Bb","B#" ],
				TextOfPitchButtons: [ "C","D","E","F","G","A","B" ],
				ValueOfPitchButtons: [ "C","D","E","F","G","A","B" ]
			}
		},
		props: [],
        mounted() {
        },
        methods: {
			onButtonClick(value) {
				console.log("onButtonClick", value);
				this.$emit("buttonClick", value);
			}
        }
    }
</script>

<template>
	<view class="button-list">
		<view class="button-list-line1">
			<block v-for="(value,index) in TextOfAccidentalButtons" v-bind:key="index">
				<view class="button-accidental" hover-class="button-hover" @click="onButtonClick(ValueOfAccidentalButtons[index])">
					<view class="button-accidental-text-wrapper">
						<text class="button-accidental-text">{{ value }}</text>
					</view>
				</view>
			</block>
		</view>
		<view class="button-list-line2">
			<block v-for="(value,index) in TextOfPitchButtons" v-bind:key="index">
				<view class="button-pitch" hover-class="button-hover" @click="onButtonClick(ValueOfPitchButtons[index])">
					<view class="button-accidental-text-wrapper">
					 	<text class="button-accidental-text">{{ value }}</text>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<style scoped>
	.button-list {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
		height: 6rem;
		width: 100%;
		border: 1px solid red;
	}

		.button-list-line1 {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: center;
			align-items: center;
			height: 2rem;
			width: 100%;
			border: 1px solid red;
		}

			.button-accidental {
				padding-left: 1vmax;
				padding-right: 1vmax;
				display: block;
				min-width: 0.25rem;
				min-height: 1rem;
				margin: 3px;
				background-color: #F1F1F1;
				border: 3px solid black;
			}
	
				.button-accidental-text-wrapper {
					display: flex;
					justify-content: center;
					vertical-align: sub;
					//border: 1px solid red;
				}

					.button-accidental-text {
						flex-wrap: nowrap;
						font-size: 1em;
						overflow: hidden;
						vertical-align: sub;
						height: auto;
						//border: 1px solid blue;
					}

		.button-list-line2 {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: center;
			align-items: center;
			height: 4rem;
			width: 100%;
			border: 1px solid red;
		}

			.button-pitch {
				padding-left: 1vmax;
				padding-right: 1vmax;
				display: block;
				min-width: 2rem;
				min-height: 2rem;
				margin: 0.7rem;
				background-color: #F1F1F1;
				border: 3px solid black;
			}

				.button-pitch-text-wrapper {
					display: flex;
					justify-content: center;
					vertical-align: sub;
					//border: 1px solid red;
				}

					.button-pitch-text {
						flex-wrap: nowrap;
						font-size: 1.5em;
						overflow: hidden;
						vertical-align: sub;
						height: auto;
						//border: 1px solid blue;
					}
</style>
