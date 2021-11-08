
console.log(process.env.NODE_ENV === 'development' ? 'dev' : 'prod');
console.log("runtime env = " + uni.getSystemInfoSync().platform);

import App from './App'
import store from './store'

// Globally register all components under views subdirectory
import './views/globals'

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
