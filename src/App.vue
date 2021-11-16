<script>
	export default {
		mounted() {
			if (!this.$global.isMiniApp()) {
				if (this.$global.isIOS()) {
					window.onresize = this.onResizeWindow;
					this.onResizeWindow();
				}
			}
		},
		onLaunch: function() {
			console.log('App Launch');

			this.$store.commit("init");

			if (!this.$global.isMiniApp()) {
				if (this.$global.isIOS()) {
					this.$nextTick(function() {
						this.onResizeWindow();
					})
				} else {
					this.$global.changeScreenOrientationToLandscapeByApi(this);
				}

				console.log("screen oridentation = ", screen.orientation.type);
			}

			// TODO load from storage
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		},
		methods: {
			onResizeWindow() {
				this.$global.changeScreenOrientationToLandscapeByCss(this.$el);
			}
		}
	}
</script>

<style>
	html {
		font-size: medium;
	  	/* border: 1px solid red; */
	  	height: 100%;
	}

	body {
		height: 100%;
	}

	uni-app {
		height: 100%;
	}

	uni-page {
		height: 100%;
	}

	uni-page-body {
		height: 100%;
	}

	uni-view {
		height: 100%;
	}

	/* H5 兼容 pc 所需 */
	/* #ifdef H5 */
	@media screen and (min-width: 768px) {
		body{
			overflow-y: scroll;
		}
	}
	/* #endif */

	/*每个页面公共css */

	uni-actionsheet {
		display: none;
	}

	/* 隐藏uni-app自动添加的标题栏 */
	uni-page-head {
		display: none;
	}

	uni-page-wrapper {
		height: 100%;
	}

	uni-page-body {
		background-color: #F5F5F5 !important;
	}

    uni-list {
        -webkit-overflow-scrolling: touch;        
    }

    uni-modal .uni-modal__bd{      
        white-space: pre-wrap;      
    }       
</style>
