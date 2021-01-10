import Vue from 'vue'
import vuetify from './plugins/vuetify'
import Vuelidate from 'vuelidate'
import App from './App.vue'

Vue.config.productionTip = false

window.axios = require('axios')

new Vue({
  vuetify,
  Vuelidate,
  render: h => h(App)
}).$mount('#app')
