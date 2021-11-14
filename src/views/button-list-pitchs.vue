<script>
    export default {
		data() {
			return {
				TextOfButtons: [ "C","D","E","F","G","A","B" ],
				ValueOfButtons: [ "C","D","E","F","G","A","B" ]
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
			width: 4rem;
			height: 4rem;
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
					flex-wrap: nowrap;
					font-size: 3em;
					overflow: hidden;
				}
</style>
