import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {initMenu} from './util/menus'

import {postKeyValueRequest} from "./util/api";
import {postRequest} from "./util/api";
import {putRequest} from "./util/api";
import {getRequest} from "./util/api";
import {deleteRequest} from "./util/api";
import 'font-awesome/css/font-awesome.min.css'

Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

Vue.use(ElementUI);


//导航守卫
router.beforeEach((to, from, next) => {
    if (to.path == '/') {
        next();
    } else {
        console.log("user-->")
        if(window.sessionStorage.getItem("user")){
            console.log("user")
            initMenu(router, store);
            next();
        }else{
            console.log("nouser")
            next("/?redirect="+to.path)
        }
    }
})


Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
