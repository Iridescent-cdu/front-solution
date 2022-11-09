import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import getters from './getters.js'
import category from './modules/category.js'
import theme from './modules/theme.js'
import app from './modules/app.js'
import search from './modules/search.js'
import user from './modules/user.js'

export const store = createStore({
  getters,
  modules: {
    category,
    theme,
    app,
    search,
    user
  },
  plugins: [
    createPersistedState({
      //指定保存到localStorage中的key值
      key: 'imooc-front',
      //需要保存的模块
      paths: ['category', 'theme', 'search', 'user']
    })
  ]
})
export default store
