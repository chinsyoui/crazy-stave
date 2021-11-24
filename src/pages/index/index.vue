<script>
    import logger from '@/utils/logger.js'
    import ModalDlg from "@/views/modal-dlg.vue"
	import { mapState } from 'vuex'

    export default {
        components: {
            ModalDlg
        },
		data() {
			return {}
		},
		computed: { 
            ...mapState({
			    Users: state => state.Users
 		    })
        },
        onLoad() {
            if (wx && wx.getUpdateManager) {
                const um = wx.getUpdateManager();
                if (um && um.onCheckForUpdate && um.onUpdateReady) {
                    um.onCheckForUpdate(function(res) {
                        // 请求完新版本信息的回调
                        logger.debug(res.hasUpdate);
                    });

                    um.onUpdateReady(function() {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success(res) {
                                if (res.confirm) {
                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    um.applyUpdate();
                                }
                            }
                        });
                    });

                    um.onUpdateFailed(function () {});
                }
            }
        },
		methods: {
			onItemClick: function() {
                //logger.debug(this.Title + "." + "onItemClick");
				this.$store.commit('setCurrentUser', this.Users[0]);
				uni.navigateTo({ url: '/pages/game/game-collection-list' });
                //uni.navigateTo({ url: '/pages/game/user-list' });
                //this.ShowModalDlg = true;
			}
		}
	}
</script>

<template>
 	<view class="container" @click="onItemClick()">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title" style="font: 1.1rem">
                五线谱是音乐的语言，学习音乐就要将这门语言学习到相当于母语的熟练程度。\n
			    本小程序可以帮助您将五线谱阅读速度快速提高到非常熟练的水平。\n
            </text>
		</view>
		
		<match-media max-height="480" max-width="640">
			<view>屏幕太小</view>
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
</style>
