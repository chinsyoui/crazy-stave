<script>
	import { mapState } from 'vuex'
    import logger from '@/utils/logger.js'
	import { PKs } from '@/store/game-model.js'

    export default {
		data() {
			return {
                CorrectButtonIndex: -1   // >=0时表示正确的按钮的索引
            }
		},
		props: {
            Texts: Array   // must be String[12]
        },
		computed: {
            isHint() {
                return function(button_index) {
                    let ret = (button_index === this.CorrectButtonIndex);
    				//logger.debug("isHint", button_index, this.CorrectButtonIndex, ret);
                    return ret;
                }
			},

            ...mapState({
                PKs: state => PKs
    		})
        },
        methods: {
			onButtonClick(value) {
				//logger.debug("onButtonClick", value);
				this.$emit("buttonClick", value);
                this.CorrectButtonIndex = -1;  // 清除提示
			},
            showHint(correct_button_index) {
                //logger.debug("showHint");
                this.CorrectButtonIndex = correct_button_index;
            }            
        }
    }
</script>

<template>
	<view class="button-list" style="position: relative; width: 84vw; height: 100%; min-height:16vw;">
        <view class="layer-white" style="z-index: auto; width: 84vw; height: 100%; display: flex; flex-direction: row; justify-content: center; align-items: stretch; background-color: transparent;">
            <block v-for="(value, index) in PKs.WhiteRNs" v-bind:key="index">
                <view v-bind:class="{ hint: isHint(value) }" class="button-white" hover-class="button-hover" @click="onButtonClick(value)">
                    <view class="button-text-wrapper">
                        <text v-bind:class="{ hint: isHint(value) }" class="button-white-text">{{ Texts[value] }}</text>
                    </view>
                </view>
            </block>
        </view>
        <view class="layer-black" style="z-index: 1; width: 84vw; height: 100%;">
            <view v-bind:class="{ hint: isHint(1) }" class="button-black" hover-class="button-hover" style="position: absolute; top: 0px; left: 8vw" @click="onButtonClick(1)">
                <view class="button-text-wrapper">
                    <text v-bind:class="{ hint: isHint(1) }" class="button-black-text">{{ Texts[1] }}</text>
                </view>
            </view>
            <view v-bind:class="{ hint: isHint(3) }" class="button-black" hover-class="button-hover" style="position: absolute; top: 0px; left: 20vw" @click="onButtonClick(3)">
                <view class="button-text-wrapper">
                    <text v-bind:class="{ hint: isHint(3) }" class="button-black-text">{{ Texts[3] }}</text>
                </view>
            </view>
            <view v-bind:class="{ hint: isHint(6) }" class="button-black" hover-class="button-hover" style="position: absolute; top: 0px; left: 44vw" @click="onButtonClick(6)">
                <view class="button-text-wrapper">
                    <text v-bind:class="{ hint: isHint(6) }" class="button-black-text">{{ Texts[6] }}</text>
                </view>
            </view>
            <view v-bind:class="{ hint: isHint(8) }" class="button-black" hover-class="button-hover" style="position: absolute; top: 0px; left: 56vw" @click="onButtonClick(8)">
                <view class="button-text-wrapper">
                    <text v-bind:class="{ hint: isHint(8) }" class="button-black-text">{{ Texts[8] }}</text>
                </view>
            </view>
            <view v-bind:class="{ hint: isHint(10) }" class="button-black" hover-class="button-hover" style="position: absolute; top: 0px; left: 68vw" @click="onButtonClick(10)">
                <view class="button-text-wrapper">
                    <text v-bind:class="{ hint: isHint(10) }" class="button-black-text">{{ Texts[10] }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<style scoped>
    .button-white.hint {
        background-color: #CCFFFF;
    }

    .button-black.hint {
        background-color: #CCFFFF;
    }

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
        background-color: #333333;
    }

        .button-hover {
			background-color: #CCFFFF;
        }

        .button-text-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .button-white-text.hint {
            color: blue;
        }

        .button-black-text.hint {
            color: blue;
        }

        .button-white-text {
            color: black;
        }

        .button-black-text {
            color: white;
        }

        .button-white-text {
            padding-bottom: 0.5vw;
            white-space: nowrap;
            font-size: 3em;
            overflow: hidden;
        }

        .button-black-text {
            padding-bottom: 0.5vw;
            white-space: nowrap;
            font-size: 2.5vw;
            overflow: hidden;
        }
</style>
