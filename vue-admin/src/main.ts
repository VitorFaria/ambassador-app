import { createApp } from 'vue'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

const vuetify = createVuetify()

createApp(App).use(vuetify).use(router).use(store).mount('#app')
