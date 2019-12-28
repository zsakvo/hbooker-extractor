import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/at";
import installHttp from "./plugins/http";
import decrypt from "./plugins/decrypt";

Vue.config.productionTip = false;
Vue.prototype.$get = installHttp.get;
Vue.prototype.$post = installHttp.post;
Vue.prototype.$dcy = decrypt;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
