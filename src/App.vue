<script>
    import logger from '@/utils/logger.js'

    export default {
		mounted() {
			if (!this.$global.isMiniApp()) {
				if (this.$global.isIOS()) {
                    if (window)
					    window.onresize = this.onResizeWindow;
					this.onResizeWindow();
				}
			}
		},
		onLaunch: function() {
			logger.info('App Launch');

			this.$store.commit("init");

			if (!this.$global.isMiniApp()) {
				if (this.$global.isIOS()) {
					this.$nextTick(function() {
						this.onResizeWindow();
					})
				} else {
					this.$global.changeScreenOrientationToLandscapeByApi(this);
				}

				logger.info("screen oridentation = ", screen.orientation.type);
			}

			// TODO load from storage
		},
		onShow: function() {
			logger.info('App Show');
		},
		onHide: function() {
			logger.info('App Hide');
		},
        onError: function(err) {
            logger.error(err);
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
        /* padding: top right bottom left; */
		font-size: medium;
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
