import { ALL_CATEGORY_ITEM } from '@/constants'
import { getCategory } from '@/api/mock/category'
import { CATEGORY_NOMAR_DATA } from '@/constants/index'
/**
 * 处理navigationBar中的数据categorys
 */
export default {
  // 独立作用域
  namespaced: true,

  state: () => {
    return {
      /**
       * 1.让categorys具备一个初始化数据
       * 2.从服务端获取数据，替换初始化数据
       * 3.为了防止初始化数据太老，我们把每次获取到的新数据，都做为下一次的初始化数据
       */
      categorys: CATEGORY_NOMAR_DATA,
    }
  },
  mutations: {
    /**
     * 为categorys赋值
     */
    setCategorys(state, newCategorys) {
      state.categorys = [ALL_CATEGORY_ITEM, ...newCategorys]
    },
  },
  actions: {
    /**
     * 获取category数据，并自动保存到vuex中
     */
    async useCategoryData(context) {
      const { categorys } = await getCategory()
      context.commit('setCategorys', categorys)
    },
  },
}
