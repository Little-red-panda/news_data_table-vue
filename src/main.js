import Vue from 'vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import Vuelidate from 'vuelidate'
import App from './App.vue'

Vue.config.productionTip = false

window.axios = require('axios')

new Vue({
  router,
  store,
  vuetify,
  Vuelidate,
  render: h => h(App)
}).$mount('#app')
