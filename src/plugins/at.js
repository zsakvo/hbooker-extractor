import Vue from "vue";
import "at-ui-style";
import { Button, Input, Notification } from "at-ui";
Vue.use(Button);
Vue.use(Input);
Vue.prototype.$Notify = Notification;
