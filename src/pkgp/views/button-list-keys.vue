<script>
	import { mapState } from 'vuex'
	import { PKs } from '@/store/game-model.js'

    export default {
		data() {
			return {}
		},
		props: {
            Texts: Array   // must be String[12]
        },
		computed: {
            ...mapState({
                PKs: state => PKs
    		})
        },
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
            <block v-for="(value, index) in PKs.WhiteRNs" v-bind:key="index">
                <view class="button-white" hover-class="button-hover" @click="onButtonClick(value)">
                    <view class="button-text-wrapper">
                        <text class="button-white-text">{{ Texts[value] }}</text>
                    </view>
                </view>
            </block>
        </view>
        <view class="layer-black" style="z-index: 1; width: 84vw; height: 100%;">
            <view class="button-black" hover-class="button-hover" style="position: absolute; top: 0px; left: 8vw" @click="onButtonClick(1)">
                <view class="button-text-wrapper">
                    <text class="button-black-text">{{ Texts[1] }}</text>
                </view>
            </view>
            <view class="button-black" hover-class="button-hover" style="position: absolute; top: 0px; left: 20vw" @click="onButtonClick(3)">
                <view class="button-text-wrapper">
                    <text class="button-black-text">{{ Texts[3] }}</text>
                </view>
            </view>
            <view class="button-black" hover-class="button-hover" style="position: absolute; top: 0px; left: 44vw" @click="onButtonClick(6)">
                <view class="button-text-wrapper">
                    <text class="button-black-text">{{ Texts[6] }}</text>
                </view>
            </view>
            <view class="button-black" hover-class="button-hover" style="position: absolute; top: 0px; left: 56vw" @click="onButtonClick(8)">
                <view class="button-text-wrapper">
                    <text class="button-black-text">{{ Texts[8] }}</text>
                </view>
            </view>
            <view class="button-black" hover-class="button-hover" style="position: absolute; top: 0px; left: 68vw" @click="onButtonClick(10)">
                <view class="button-text-wrapper">
                    <text class="button-black-text">{{ Texts[10] }}</text>
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
