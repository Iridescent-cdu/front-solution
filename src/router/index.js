import { createRouter, createWebHistory } from 'vue-router'
import mobileTerminalRoutes from './modules/mobile-routes.js'
import pcTerminalRoutes from './modules/pc-routes.js'
import { isMobileTerminal } from '@/utils/flexible'

export const router = createRouter({
  history: createWebHistory(),
  routes: (isMobileTerminal.value && mobileTerminalRoutes) || pcTerminalRoutes,
})
export default router
