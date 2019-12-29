import Vue from "vue";
import "at-ui-style";
import { Button, Input, Notification, Modal } from "at-ui";
Vue.use(Button);
Vue.use(Input);
Vue.use(Modal);
Vue.prototype.$Notify = Notification;
