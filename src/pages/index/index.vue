<script>
    import ModalDlg from "@/views/modal-dlg.vue"

    export default {
        components: {
            ModalDlg
        },
		data() {
			return {
				Title: "Welcome",
				DebugInfo: "",
                ShowModalDlg: false
			}
		},
        computed: {
            OneButtons: function() {
                return [ { Text : "确认", Value: "OK"} ]
            },
            TwoButtons: function() {
                return [ { Text : "返回", Value: "back"}, { Text : "再来一遍", Value: "again"} ]
            },
            ThreeButtons: function() {
                return [ { Text : "返回", Value: "back"}, { Text : "再来一遍", Value: "again"}, { Text : "下一个", Value: "next"} ]
            }
        },
		mounted() {
			// this.DebugInfo = this.DebugInfo + "uni.getSystemInfoSync() = " + JSON.stringify(uni.getSystemInfoSync());
		},
		methods: {
			onItemClick: function() {
                console.log(this.Title + "." + "onItemClick");
                uni.navigateTo({ url: '/pages/game/user-list' });
                //this.ShowModalDlg = true;
			},
            onModalDlgClick: function(e) {
				console.log("onModalDlgClick", e);
                this.ShowModalDlg = false;
            }
		}
	}
</script>

<template>
 	<view class="container" @click="onItemClick()">
        <ModalDlg v-if="ShowModalDlg" @click="onModalDlgClick" v-bind:buttons="TwoButtons">
            <template v-slot:title>New Title</template>
            <template v-slot:body>New Body</template>
        </ModalDlg>

		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title" style="font: 1.1rem">
                五线谱是音乐的语言，学习音乐就要将这门语言学习到相当于母语的熟练程度。\n
			    本小程序可以帮助您将五线谱阅读速度快速提高到非常熟练的水平。\n
            </text>
		</view>
		<view class="text-area">
			<text class="DebugInfo">{{ DebugInfo }}</text>
		</view>
		
		<match-media max-height="480" max-width="640">
			<view>屏幕太小，无法工作</view>
		</match-media>
 		<match-media min-height="300" orientation="landscape">
			<view style="margin: 2rem 2rem">
    			<text class="title" style="font: 1.2rem bold; color: blue">点击屏幕开始</text>
            </view>
		</match-media>
		<match-media min-width="300" orientation="portrait">
			<view>请横屏使用</view>
		</match-media>
	</view>
</template>

<style>
	.container {
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* border: 1px solid red; */
	}

	.logo {
		max-height: 10rem;
		max-width: 10rem;
		background-size: cover;
		margin-top: 1rem;
		margin-left: 10px;
		margin-right: 10px;
		margin-bottom: 2rem;
	}

	.DebugInfo {
		overflow-wrap: break-word;
	}
</style>
