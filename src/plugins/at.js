import Vue from 'vue'
import 'at-ui-style'
import { Button, Input, Notification, Modal, Table } from 'at-ui'
Vue.use(Button)
Vue.use(Input)
Vue.use(Modal)
Vue.use(Table)
Vue.prototype.$Notify = Notification
