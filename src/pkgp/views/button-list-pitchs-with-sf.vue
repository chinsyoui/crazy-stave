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
				//console.log("onButtonClick", value);
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
	}

		.button-list-line1 {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: center;
			align-items: center;
			height: 2.5rem;
			width: 100%;
		}

			.button-accidental {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 2.8rem;
                height: 2.5rem;
                margin: 2px;
				background-color: #F1F1F1;
                box-sizing: border-box;
				border: 2px solid black;
			}
	
				.button-accidental-text-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
				}

					.button-accidental-text {
                        flex-wrap: nowrap;
                        font-size: 3em;
                        overflow: hidden;
					}

		.button-list-line2 {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: center;
            align-items: center;
            height: 3.5rem;
            width: 100%;
		}

			.button-pitch {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 3.5rem;
                height: 3rem;
                margin-left: 1.3rem;
                margin-right: 1.3rem;
                background-color: #F1F1F1;
                box-sizing: border-box;
                border: 3px solid black;
			}

				.button-pitch-text-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
				}

					.button-pitch-text {
                        flex-wrap: nowrap;
                        font-size: 2em;
                        overflow: hidden;
					}

        .button-hover {
			background-color: #818181;
        }

</style>
