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
 	<view class="container">
        <view style="display:flex; flex-direction:column; justify-content:center; align-items:center; width: 100%; height: 80%" @click="onItemClick()">
            <image class="logo" src="/static/logo.png"></image>
            <view class="text-area">
                <text class="title" style="font: 1.3rem bold;">
                    零基础轻松学会五线谱，让您像母语一样熟练阅读五线谱。
                </text>
            </view>

            <match-media max-height="320" max-width="480">
                <view>屏幕太小</view>
            </match-media>
            <match-media min-height="200" orientation="landscape">
                <view style="margin-top: 20px">
                    <text class="title" style="font: 1.6rem bold; color: blue; margin-top: 20px">点击屏幕开始</text>
                </view>
            </match-media>
            <match-media min-width="300" orientation="portrait">
                <view>请横屏使用</view>
            </match-media>

            <view class="text-area">
                <text class="title" style="font: 1.3rem bold;">\n
                </text>
            </view>
        </view>
		<view class="text-area">
            <button open-type="feedback" type="primary">意见反馈</button>
		</view>
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
