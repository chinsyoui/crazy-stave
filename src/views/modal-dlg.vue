<script>
    export default {
		data() {
			return {}
		},
		props: {
            buttons: Array // [ { Text : "Text", Value: "value"} ]
        },
        mounted() {
        },
        methods: {
			onButtonClick(value) {
				//console.log("onButtonClick", value);
				this.$emit("click", value);                
			}
        }
    }
</script>

<template>
      <transition name="modal">
        <div class="modal-mask" v-on:click.stop=""><!-- 缺省阻止点击任何地方 -->
          <div class="modal-wrapper">
            <div class="modal-container">
              <div class="modal-title">
                <slot name="title">游戏结束</slot>
              </div>
              <div class="modal-body">
                <slot name="body">default body</slot>
              </div>
              <div class="modal-buttons">
                <block v-for="(value,index) in buttons" v-bind:key="index">
                    <view class="button" v-on:click.stop="onButtonClick(value.Value)">
                        <view class="button-text-wrapper">
                            <text class="button-text">{{value.Text}}</text>
                        </view>
                    </view>
                </block>
              </div>
            </div>
          </div>
        </div>
      </transition>
</template>

<style scoped>
    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: table;
        transition: opacity 0.3s ease;
    }

    .modal-wrapper {
        display: table-cell;
        text-align: center;
        vertical-align: middle;
    }

    .modal-container {
        width: 50%;
        text-align: middle;
        margin: 0px auto;
        padding: 20px 30px;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
        transition: all 0.3s ease;
        font-family: Helvetica, Arial, sans-serif;
    }

    .modal-title {
        text-align: center;
        font-size: 2em;
        margin-top: 0;
        color: #42b983;
    }

    .modal-body {
        font-size: 1.5em;
        white-space: pre-wrap;
        margin: 20px 0;
    }

    .modal-buttons {
        display: flex;
        flex-direction: row;
		flex-wrap: nowrap;
        justify-content: center;
		align-items: center;
    }

		.button {
            display: flex;
            justify-content: center;
            align-items: center;
			margin: 10px;
            min-width: 6em;
			background-color: #F1F1F1;
			border: 1px solid black;
		}

			.button-text-wrapper {
				display: flex;
                justify-content: center;
                align-items: center;
			}

				.button-text {
                    padding: 0.2em;
					flex-wrap: nowrap;
                    white-space: nowrap;
					font-size: 1.5em;
					overflow: hidden;
				}

    /*
    * The following styles are auto-applied to elements with transition="modal"
    * when their visibility is toggled by Vue.js.
    *
    * You can easily play with the modal transition by editing these styles.
    */

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>
