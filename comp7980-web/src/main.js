import '@/assets/main.scss'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import pinia from '@/stores/index'

import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(pinia)
app.use(router).use(VueApexCharts)

app.mount('#app')
