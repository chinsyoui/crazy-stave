<script>
    export default {
		data() {
			return {
				TextOfButtons: [ "二度","三度","四度","五度","六度","七度","八度" ],
				ValueOfButtons: [ "2","3","4","5","6","7","8" ]
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
		<block v-for="(value, index) in TextOfButtons" v-bind:key="index">
			<view class="button" hover-class="button-hover" @click="onButtonClick(ValueOfButtons[index])">
				<view class="button-text-wrapper">
					<text class="button-text">{{ value }}</text>
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
		height: 4rem;
		width: 100%;
	}

		.button {
            display: flex;
            justify-content: center;
            align-items: center;
			min-width: 4rem;
			min-height: 4rem;
			margin: 10px;
			background-color: #F1F1F1;
            box-sizing: border-box;
			border: 3px solid black;
		}

        .button-hover {
			background-color: #818181;
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
