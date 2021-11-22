import logger from '@/utils/logger.js'
logger.info("app started");

logger.info("node_env = ", process.env.NODE_ENV === 'development' ? 'dev' : 'prod');
logger.info("uni.platform = " + uni.getSystemInfoSync().platform);

logger.info("uni.getSystemInfoSync() = " + JSON.stringify(uni.getSystemInfoSync()));

import App from './App'
import store from './store'

import * as global from '@/utils/global.js'
Vue.prototype.$global = global;

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
	app.use(store)
  return {
    app
  }
}
// #endif
