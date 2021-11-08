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
