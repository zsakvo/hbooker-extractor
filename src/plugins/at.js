import Vue from 'vue'
import 'at-ui-style'
import { Button, Input, Notification, Modal, Table, Dropdown, DropdownMenu, DropdownItem } from 'at-ui'
Vue.use(Button)
Vue.use(Input)
Vue.use(Modal)
Vue.use(Table)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.prototype.$Notify = Notification
