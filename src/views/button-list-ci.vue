<script>
    export default {
		data() {
			return {
				TextOfButtons: [ "原位","第一转位","第二转位" ],
				ValueOfButtons: [ "0","1","2" ]
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
			width: 10rem;
			height: 3rem;
			margin: 10px;
			background-color: #F1F1F1;
			border: 3px solid black;
		}

			.button-text-wrapper {
				display: flex;
                justify-content: center;
                align-items: center;
			}

				.button-text {
                    padding: 0.1em;
					flex-wrap: nowrap;
                    white-space: nowrap;
					font-size: 2em;
					overflow: hidden;
				}
</style>
