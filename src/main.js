import { createApp } from 'vue'
import App from './App.vue'
import useTheme from './utils/theme'
import router from '@/router/index.js'
import store from '@/store/index.js'
import './styles/index.scss'
import '@/utils/mock'
import { useREM } from '@/utils/flexible'
import mLibs from '@/libs'
import mdirectives from '@/directives/index'
import './premission'

// 注册svg-icons
import 'virtual:svg-icons-register'

useREM()
useTheme()

createApp(App).use(router).use(store).use(mLibs).use(mdirectives).mount('#app')
