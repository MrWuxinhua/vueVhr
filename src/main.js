import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import {postKeyValueRequest} from "./util/api";
import {postRequest} from "./util/api";
import {putRequest} from "./util/api";
import {getRequest} from "./util/api";
import {deleteRequest} from "./util/api";

Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
