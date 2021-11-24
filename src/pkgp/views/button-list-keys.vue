<script>
    export default {
		data() {
			return {
				TextOfWhiteButtons: [ "C","D","E","F","G","A","B" ],
				ValueOfWhiteButtons: [ "C","D","E","F","G","A","B" ],
				TextOfBlackButtons: [ "C#/Db","D#/Eb","F#/Gb","G#/Ab","A#/Bb" ],
				ValueOfBlackButtons: [ "Db","Eb","Gb","Ab","Bb" ]
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
	<view class="button-list" style="position: relative; width: 84vw; height: 100%; min-height:16vw;">
        <view class="layer-white" style="z-index: auto; width: 84vw; height: 100%; display: flex; flex-direction: row; justify-content: center; align-items: stretch; background-color: transparent;">
            <block v-for="(value, index) in TextOfWhiteButtons" v-bind:key="index">
                <view class="button-white" hover-class="button-hover" @click="onButtonClick(ValueOfWhiteButtons[index])">
                    <view class="button-text-wrapper">
                        <text class="button-white-text">{{ value }}</text>
                    </view>
                </view>
            </block>
        </view>
        <view class="layer-black" style="z-index: 1; width: 84vw; height: 100%;">
            <view class="button-black" hover-class="button-hover" style="position: absolute; top: 0px; left: 8vw" @click="onButtonClick(ValueOfBlackButtons[0])">
                <view class="button-text-wrapper">
                    <text class="button-black-text">{{ TextOfBlackButtons[0] }}</text>
                </view>
            </view>
            <view class="button-black" hover-class="button-hover" style="position: absolute; top: 0px; left: 20vw" @click="onButtonClick(ValueOfBlackButtons[1])">
                <view class="button-text-wrapper">
                    <text class="button-black-text">{{ TextOfBlackButtons[1] }}</text>
                </view>
            </view>
            <view class="button-black" hover-class="button-hover" style="position: absolute; top: 0px; left: 44vw" @click="onButtonClick(ValueOfBlackButtons[2])">
                <view class="button-text-wrapper">
                    <text class="button-black-text">{{ TextOfBlackButtons[2] }}</text>
                </view>
            </view>
            <view class="button-black" hover-class="button-hover" style="position: absolute; top: 0px; left: 56vw" @click="onButtonClick(ValueOfBlackButtons[3])">
                <view class="button-text-wrapper">
                    <text class="button-black-text">{{ TextOfBlackButtons[3] }}</text>
                </view>
            </view>
            <view class="button-black" hover-class="button-hover" style="position: absolute; top: 0px; left: 68vw" @click="onButtonClick(ValueOfBlackButtons[4])">
                <view class="button-text-wrapper">
                    <text class="button-black-text">{{ TextOfBlackButtons[4] }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<style scoped>
    .button-white {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        width: 12vw;
        height: 16vw;
        box-sizing: border-box;
        border: 3px solid black;
        background-color: transparent;
    }

    .button-black {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        width: 8vw;
        height: 8vw;
        box-sizing: border-box;
        border: 3px solid black;
        background-color: black;
    }

        .button-hover {
			background-color: #818181;
        }

        .button-text-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .button-white-text {
            white-space: nowrap;
            font-size: 3em;
            overflow: hidden;
            color: black;
        }

        .button-black-text {
            white-space: nowrap;
            font-size: 1em;
            overflow: hidden;
            color: white;
        }
</style>
