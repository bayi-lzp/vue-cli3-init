import Vue from 'vue'
import App from './App.vue'
import { router } from './router/index'
import store from './store/index'
import "amfe-flexible" // 引入flexible
import { Button, Header,  Swipe, SwipeItem } from 'mint-ui';  // 按需引入mint-ui
Vue.use(Button)
Vue.use(Header)
Vue.use(Swipe)
Vue.use(SwipeItem)

console.log(`run in ${process.env.NODE_ENV}`)
//设置为 false 以阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
