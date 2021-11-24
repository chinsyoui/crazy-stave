<script>
    import logger from '@/utils/logger.js'

    export default {
		data() {
			return {
                CorrectButtonIndex: -1,   // >=0时表示正确的按钮的索引
				TextOfButtons: [ "二度","三度","四度","五度","六度","七度","八度" ]
			}
		},
		computed: {
            isHint() {
                return function(button_index) {
                    let ret = (button_index === this.CorrectButtonIndex);
    				//logger.debug("isHint", button_index, this.CorrectButtonIndex, ret);
                    return ret;
                }
			}
        },
        methods: {
			onButtonClick(value) {
				//console.log("onButtonClick", value);
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
	<view class="button-list">
		<block v-for="(value, index) in TextOfButtons" v-bind:key="index">
			<view v-bind:class="{ hint: isHint(index) }" class="button" hover-class="button-hover" @click="onButtonClick(index)">
				<view class="button-text-wrapper">
					<text v-bind:class="{ hint: isHint(index) }" class="button-text">{{ value }}</text>
				</view>
			</view>
		</block>
	</view>
</template>

<style scoped>
	.button-list {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
		height: 8vw;
		width: 100%;
	}

        .button.hint {
            background-color: #CCFFFF;
        }

		.button {
            display: flex;
            justify-content: center;
            align-items: center;
			min-width: 8vw;
			min-height: 8vw;
			margin: 10px;
			background-color: #F1F1F1;
            box-sizing: border-box;
			border: 3px solid black;
		}

        .button-hover {
			background-color: #CCFFFF;
        }

            .button-text.hint {
                color: blue;
            }

			.button-text-wrapper {
				display: flex;
                justify-content: center;
                align-items: center;
			}

				.button-text {
					flex-wrap: nowrap;
					font-size: 1.6em;
					overflow: hidden;
				}
</style>
