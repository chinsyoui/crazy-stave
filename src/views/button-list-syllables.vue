<script>
    export default {
		data() {
			return {
				TextOfButtons: [ "1 Do","2 Re","3 Mi","4 Fa","5 Sol","6 La","7 Si" ],
				// 此处不用1234567,是因为我们重用了音名的数据，其答案是音名
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
		<block v-for="(value, index) in TextOfButtons">
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
		border: 1px solid red;
	}

		.button {
			padding-left: 1vmax;
			padding-right: 1vmax;
			display: block;
			min-width: 2rem;
			min-height: 2rem;
			margin: 3px;
			background-color: #F1F1F1;
			border: 3px solid black;
		}

			.button-icon {
				width: 100%;
				height: 100%;
			}

			.button-text-wrapper {
				display: flex;
				justify-content: center;
				vertical-align: sub;
				//border: 1px solid red;
			}

				.button-text {
					flex-wrap: nowrap;
					font-size: 1.5em;
					overflow: hidden;
					vertical-align: sub;
					height: auto;
					//border: 1px solid blue;
				}
</style>
