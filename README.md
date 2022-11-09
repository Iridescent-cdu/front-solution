# 基于Vue3的前台+中台通用提效解决方案

## 1.通过vite构建

1. vite为什么快？vite这种快的机制存在的问题？官方如何解决？

   1. `webpack`在开发构建时，默认会抓取并构建整个应用，然后才能提供服务；`vite`实现了**按需构建**，不会在一开始就构建整个项目，而是将应用中的模块区分为依赖和源码两部分，对于源码部分，它会根据路由来拆分代码模块，只会去构建一开始就必须构建的内容；同时`vite`以**原生ESM的方式**为浏览器提供源码，让浏览器接管了打包的部分工作
   2. 由于`vite`使用了原生ESM的方式为浏览器提供源码，使得使用了CommonJS和UMD规范的依赖项无法正常运行；解决方案：**依赖预构建**（vite会将作为CommonJS或UMD发布的依赖项转换为ESM）

2. 使用`vite`构建项目：

   1. 全局安装`vite`：`npm install -g vite`或直接初始化`vite`:`npm init vite@latest`

   2. 配置启动时局域网IP：` "dev": "vite --host",`

## 2.引入TailwindCSS

1. 企业级项目下css的处理痛点：

   1. 统一的变量维护困难
   2. 大量的ClassName负担
   3. HTML、CSS分离造成了滚动问题
   4. 响应式、主题切换实现复杂

2. 安装tailwindcss：

   1. 在终端中执行`npm install -D tailwindcss postcss autoprefixer`

   2. 执行`npx tailwindcss init -p`创建`tailwind.config.js`文件（会生成模板）或手动创建

   3. 添加tailwind的应用范围：在`tailwind.config.js`文件中的content选项下，写入如下内容

      ```javascript
      module.exports = {
        //tailwind应用范围
        content: ['./index.html','./src/**/*.{vue,js}'],
        ...
      }
      ```

   4. 添加一些tailwind指令：创建`src/styles/index.scss`文件，并写入以下代码

      ```css
      //导入tailwind的基础指令组件
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
      ```

   5. 在main.js引入这个index.scss文件，即将tailwind成功引入到了项目中:`import './styles/index.scss'`

   6. 由于vite默认没有安装CSS预处理器，因此我们需要手动安装SCSS：` npm i -D sass`

   7. 报错：遇到了CommonJS的报错，没有找到解决方法，重新创建项目使用最新版本发现`tailwind.config.js`和`postcss.config.js`后缀名都变成了`.cjs`(CommonJS规范)

3. `tailwindcss`价值体现:

   * 行内样式：无复用性，不合适
   * 组件样式：通用组件库，固定风格，不合适
   * 传统形式：响应式、主题替换等复杂功能实现复杂
   * 原子化CSS：在高定制化、高个性化、高交互性的前台项目最合适

4. tailwind遵循移动优先的原则，即使用tailwind构建响应式系统时，需要先构建移动端，再构建PC端

## 3.搭建基础项目结构

### 1.VS Code辅助插件安装

1. Prettier - Code formatter：用于代码格式化，在项目根目录创建`.prettierrc`文件，并写入以下配置

   ```json
   {  
     //代码结尾不加分号
     "semi": false,
     //优先使用单引号
     "singleQuote": true,
      //不添加尾随逗号
     "trailingComma": "none"
   }
   ```

   并且在`.vue`和`.js`文件里右键设置默认格式化程序为`prettier`；同时可在VS Code里设置`Format On Save`

2. Eslint：用于对JavaScript代码质量和风格检查，提供部分的修复功能，在与prettier一起使用时，会因为规则相同时发生冲突，核心解决原理：**禁用掉eslint中与prettier冲突的规则，将prettier的配置作为eslint配置，即prettier和eslint共享这些代码格式化规则**，社区提供了两种便捷的解决方案

   1. eslint-config-prettier：会关闭ESlint中有关代码格式化的配置，原理是关闭ESlint中所有与代码格式化相关的规则，并使用prettier中的规则进行代替，在使用时，应该放在extends节点的最后

      ```shell
      npm install --save-dev eslint-config-prettier
      ```

      ```json
      //在.eslintrc.* 添加该插件
      {
        "extends": [
          "some-other-config-you-use",
          "prettier"
        ]
      }
      ```

   2. eslint-plugin-prettier：把prettier配置成eslint的一个插件，让其当做linter规则来运行，注意使用该插件需要安装prettier依赖

      ```shell
      npm install --save-dev eslint-config-prettier
      ```

      ```json
      //在.eslintrc.json添加配置，这个配置是一系列配置的简化形式
      {
        "extends": ["plugin:prettier/recommended"]
      }
      ```

   3. 发现的问题，当使用`eslint-config-prettier`来解决冲突时，当修改了`.prettierrc`文件时，编辑器无法立即同步解决`eslint`和`prettier`之间的冲突，此时需要重启VS Code编辑器

3. Tailwind CSS IntelliSense：tailwindcss类名提示

4. Vue Language Features (Volar)

### 2.配置prettier和eslint并解决冲突

1. `vscode`本地配置`.prettierrc`：注意当修改了prettier规则之后，可以通过观察vscode右下角prettier控制台打印出的信息进行判断

   ```json
    //prettier插件配置路径
   "prettier.configPath":"C:\\Users\\Iridescent\\.prettierrc" 
   
   //定义prettier规则
   {
     "arrowParens": "always",
     "bracketSameLine": true,
     "bracketSpacing": true,
     "embeddedLanguageFormatting": "auto",
     "htmlWhitespaceSensitivity": "css",
     "insertPragma": false,
     "jsxSingleQuote": false,
     "printWidth": 120,
     "proseWrap": "never",
     "quoteProps": "as-needed",
     "requirePragma": false,
     "semi": false,
     "singleQuote": true,
     "tabWidth": 2,
     "trailingComma": "all",
     "useTabs": false,
     "vueIndentScriptAndStyle": false,
     "singleAttributePerLine": false
   }
   ```

2. 安装`eslint`和`antfu`的`eslint`配置规则

   ```shell
   npm i -D eslint
   npm i -D @antfu/eslint-config
   ```

3. 安装`eslint-config-prettier`解决`eslint`和`prettier`的冲突

   ```shell
   npm install --save-dev eslint-config-prettier
   ```

4. 在`.eslintrc`文件中使用`antfu`的`eslint`配置规则并导入`eslint-config-prettier`插件，注意插件应放在最后导入

   ```json
   {
     "extends": ["@antfu", "prettier"]
   }
   ```

### 3.项目架构搭建--mddir生成项目结构文档

安装`npm install mddir -g `，切换到目标目录，使用`mddir`命令自动生成项目结构表

```markdown
|-- front
    |-- .gitignore
    |-- .prettierrc
    |-- directoryList.md
    |-- index.html
    |-- package-lock.json
    |-- package.json
    |-- postcss.config.cjs
    |-- README.md
    |-- tailwind.config.cjs
    |-- vite.config.js
    |-- .vscode
    |   |-- extensions.json
    |-- src
        |-- App.vue
        |-- main.js
        |-- premission.js //页面权限控制
        |-- api
        |-- assets
        |   |-- icons
        |   |-- images
        |-- components //通用的业务组件
        |-- constants //常量
        |-- directives //自定义指令
        |-- libs //通用组件（第三方组件库）
        |-- router
        |   |-- index.js
        |   |-- modules
        |       |-- mobile-routes.js
        |       |-- pc-routes.js
        |-- store
        |   |-- getters.js
        |   |-- index.js
        |   |-- modules
        |-- styles
        |   |-- index.scss
        |-- utils //工具模块
        |-- vendor //外部供应资源
        |-- views //路由组件
            |-- layout
                |-- index.vue
                |-- components
```

## 4.企业级vite配置方案

### 1.构建移动处理工具--工具方法isMobileTerminal

在utils目录下创建`flexible.js`进行屏幕宽度判断:

1. 在`constants`目录下创建`index.js`定义常量`PC_DEVICE_WIDTH`并导出

2. 由于需要响应式处理，则通过判断屏幕宽度方便处理

   ```javascript
   import { PC_DEVICE_WIDTH } from '../constants'
   import { computed } from 'vue'
   /**
    * 判断当前是否为移动端设备，判断依据屏幕宽度是否小于一个指定宽度(1280)
    * 通过计算属性直接算出来结果方便呈现出结果，不使用计算属性则需要手动加()进行调用
    */
   export const isMobileTerminal = computed(() => {
     return document.documentElement.clientWidth < PC_DEVICE_WIDTH
   })
   ```

3. 实际开发中更建议通过判断用户代理进行移动端的准确判断

   ```javascript
   /**
    * 实际开发通过正则判断用户代理可以更准确的判断移动端设备
    */
   export const isMobileTerminal = computed(() => {
     return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
       navigator.userAgent
     )
   })
   ```

### 2.优化响应式处理方案--vueuse-useWindowSize

1. 对于isMobileTerminal方法，此时还存在一个问题，那就是当我们切换浏览器设备时，它的结果并不是响应式的，这种让我们的计算属性显得毫无意义了

2. 对于计算属性而言，它会在依赖的响应式数据发生变化时，重新计算，但是现在外面依赖的`document.documentElement.clientWidth `并非响应式数据

3. 解决方案：安装VueUse`npm i @vueuse/core`；使用`useWindowSize`方法

   ```javascript
   import { useWindowSize } from '@vueuse/core'
   /**
    * 使用VueUse中的useWindowSize解决屏幕宽度响应式问题
    */
   const { width } = useWindowSize()
   export const isMobileTerminal = computed(() => {
     return width.value < PC_DEVICE_WIDTH
   })
   ```

### 3.定义@路径软链接--resolve/alias

1. 在webpack中@代表src目录，vite默认不支持@软链接，而vite提供了resolve.alias功能，表示：通过别名指向一个具体的路径

2. 我们可以在vite.config.js中通过配置resolve.alias来实现@软链接功能

   ```javascript
   import { defineConfig } from 'vite'
   import vue from '@vitejs/plugin-vue'
   import { join } from 'path'
   
   export default defineConfig({
     plugins: [vue()],
     resolve: {
       alias: {
         '@': join(__dirname, '/src')
       }
     }
   })
   ```

3. 使用@软链接项目能成功运行，但vscode找不到模块报错问题：在项目根目录创建jsconfig.json文件，并写入以下配置

   ```json
   {
     "compilerOptions": {
       "baseUrl": "./",
       "paths": {
         "@/*": ["src/*"]
       }
     },
     "exclude": ["node_modules", "dist"]
   }
   
   ```

### 4.构建VueRouter移动端路由表

1. 在`src/router/index.js`中初始化vue-router

   ```javascript
   import { createRouter, createWebHistory } from 'vue-router'
   import { isMobileTerminal } from '@/utils/flexible'
   import mobileTerminalRoutes from './modules/mobile-routes.js'
   import pcTerminalRoutes from './modules/pc-routes.js'
   
   export const router = createRouter({
     history: createWebHistory(),
     routes: (isMobileTerminal.value && mobileTerminalRoutes) || pcTerminalRoutes
   })
   export default router
   ```

2. 在src/router/modules/mobile-routes.js构建移动端路由表

   ```javascript
   export default [
     {
       path: '/',
       name: 'home',
       component: () => import('@/views/main/index.vue')
     }
   ]
   
   ```

### 5.划分移动端首页模块

在views的main目录下创建components/navigation/index.vue作为导航栏组件，navigation目录下创建mobile和pc目录进行导航栏组件pc和移动端适配：

```vue
<!-- 导航栏组件 -->
<template>
  <mobile-navigation-vue v-if="isMobileTerminal"></mobile-navigation-vue>
  <!-- <pcNavigationVue></pcNavigationVue> -->
</template>

<script setup>
import { isMobileTerminal } from '@/utils/flexible'
import mobileNavigationVue from '@/views/main/components/navigation/mobile/index.vue'
import pcNavigationVue from '@/views/main/components/navigation/pc/index.vue'
</script>

<style scoped lang="scss"></style>
```

`tips：isMobileTerminal是一个响应式数据，在js里通过.value取值，在模板中不需要.value`

### 6.导入并配置axios

1. 在`utils`目录下创建`request.js`，并写入以下配置：

   ```javascript
   import axios from 'axios'
   
   export const service = axios.create({
     baseURL: 'https://api.imooc-front.lgdsunday.club/api',
     timeout: 5000
   })
   export default service
   
   ```

2. 在`api`目录下创建`category.js`，配置请求具体路径：

   ```javascript
   import request from '@/utils/request.js'
   
   /**
    * 获取分类列表
    */
   export const getCategory = () => {
     return request({
       url: '/category'
     })
   }
   
   export default getCategory
   ```

3. 在`mobile\index.vue`使用`getCategory`获取数据：

   ```javascript
   import getCategory from '@/api/category.js'
   const getCategoryData = async () => {
     const res = await getCategory()
     console.log(res)
   }
   getCategoryData()
   ```

### 7.vite处理代理服务器--server/proxy

1. 在`src/utils/request.js`中，修改baseURL为`/api`，表示当前请求为开发时的api请求

2. 在vite.config.js中新增server选项，配置代理：

   ```javascript
    server: {
       proxy: {
         //代理所有/api的请求
         '/api': {
           target: 'https://api.imooc-front.lgdsunday.club/',
           changeOrigin: true
         }
       }
     }
   ```

### 8.vite处理环境变量--.env文件

1. 在企业级开发中，后端会提供开发环境和生产环境两套api接口，区别如下：

   * 开发环境的api提供的一般是假数据、脏数据，避免污染真正的数据
   * 在使用两套api时进行手动切换难免会有疏忽，于是我们期望根据项目的状态，自动切换请求的服务地址

2. 解决方法：在vite中提供了.env文件（environment），该文件为环境变量文件，默认提供了四种文件格式：

   ```javascript
   .env 所有情况下都会加载
   .env.local 所有情况下都会加载，但会被git忽略
   .env.[mode] 只在指定模式下加载
   .env.[mode].local 只在指定模式下加载，但会被git忽略
   ```

3. `.env.[mode]`文件可以在不同模式加载不同内容，可以实现自动切换

   1. 在项目根目录下创建`.env.development`和`.env.production`文件

   2. 定义变量（只有以`VITE_`为前缀的变量才会暴露出去给vite进行处理）

   3. 通过`import.meta.env.VITE_BASE_API`获取环境变量替换`baseURL`:

      ```javascript
      import axios from 'axios'
      
      export const service = axios.create({
        baseURL: import.meta.env.VITE_BASE_API,
        timeout: 5000
      })
      export default service
      ```

   4. 分别运行`npm run dev`和`npm run bulid`进行测试，使用`en1anywhere`(一个随启随用的静态服务器)运行打包好的静态文件，使用说明：

      1. `npm install anywhere -g`安装`anywhere`插件
      2. 在需要的文件夹目录执行`anywhere`命令

## 5.构建自己的物料解决方案

### 1.数据拦截简化数据获取流程--axios-interceptors

由于后台返回的数据嵌套了多层，我们可以使用响应拦截器（服务器返回数据之后，前端.then之前被调用）来简化数据：

```javascript
/**
 * 响应拦截器
 * 服务端返回数据之后，前端.then之前被调用
 */
service.interceptors.response.use((response) => {
  const { success, message, data } = response.data
  if (success) {
    return data
  }
  //TODO:业务请求错误
  return Promise.reject(new Error(message))
})
```

### 2.业务组件移动端navigationbar

1. 使用`defineProps`接收`navigation/index.vue`传入的数据

   ```javascript
   import { defineProps } from 'vue'
   defineProps({
     data: {
       type: Array,
       required: true
     }
   })
   ```

2. `navigation/index.vue`向子组件`mobile-navigation-vue`传入数据

   ```javascript
   const categorysData = ref([])
   const getCategoryData = async () => {
     const { categorys } = await getCategory()
     categorysData.value = categorys
   }
   getCategoryData()
   ```

3. 使用`mock.js`请求本地的json数据，mock会拦截对应路径的请求并返回给定的数据，使用方法：

   1. 安装`mock.js`，`npm i mockjs -D`，并导入JSON数据

   2. 在utils目录下创建`mock`文件监听路径，并在main.js中导入即可使用

   3. 创建ajax请求去访问mock的路径：重新封装axios方法，使其baseURL为mock

      ```javascript
      //mock.js
      import Mock from 'mockjs'
      
      import category from '../../json/category.json'
      
      Mock.mock('/mock/category', category)
      
      
      //mockRequest.js
      import axios from 'axios'
      
      export default axios.create({
        baseURL: '/mock',
        timeout: 5000
      })
      
      //mock/category.js
      import request from '@/utils/mockRequest.js'
      
      export const getCategory = () => {
        return request({
          url: '/category'
        })
      }
      
      export default getCategory
      ```

4. 使用`nprogress`添加请求条：

   1. 使用`npm i nprogress -S` ，引入样式表和脚本文件

   2. 在axios请求和响应拦截器（interceptors）中使用：

      ```javascript
      import axios from 'axios'
      import nprogress from 'nprogress'
      import 'nprogress/nprogress.css'
      export const service = axios.create({
        baseURL: '/mock',
        timeout: 5000
      })
      
      service.interceptors.request.use((config) => {
        nprogress.start()
        return config
      })
      service.interceptors.response.use((response) => {
        nprogress.done()
        const { success, data, message } = response.data
        if (success) return data
        return Promise.reject(new Error(message))
      })
      export default service
      ```


### 3.动态rem基准和修正tailwind--工具方法useREM

1. 在`utils/flexible.js`中添加useREM方法动态指定rem基准值，并在`main.js`中引入并调用

   ```javascript
   /**
    * 动态指定rem基准值，最大为40px
    * 根据用户的屏幕宽度，进行一些计算，把计算出来的值赋值给根标签作为fontsize大小
    */
   export const useREM = () => {
     //定义最大的fontSize
     const MAX_FONT_SIZE = 40
     //监听html文档被解析完成的事件
     document.addEventListener('DOMContentLoaded', () => {
       //拿到html标签
       const html = document.querySelector('html')
       //计算fontSize
       let fontSize = window.innerWidth / 10
       fontSize = (fontSize > MAX_FONT_SIZE && MAX_FONT_SIZE) || fontSize
       //赋值给html
       html.style.fontSize = fontSize + 'px'
     })
   }
   ```

2. 在`tailwind.config.js`中定制字体大小

   ```javascript
     theme: {
       extend: {
         fontSize: {
           xs: ['.25rem', '0.35rem'],
           sm: ['.35rem', '0.45rem'],
           base: ['.45rem', '0.55rem'],
           lg: ['.55rem', '0.65rem'],
           xl: ['.65rem', '0.75rem']
         }
       }
     },
   ```

### 4.基于vite的统一svg处理svg-icon

1. 在`lib`目录下创建文件夹`svg-icon`封装通用组件svg-icon

   ```vue
   <template>
     <svg aria-hidden="true">
       <use :xlink:href="symbolId" :class="fillClass" :fill="color"></use>
     </svg>
   </template>
   
   <script setup>
   import { computed } from 'vue'
   const props = defineProps({
     //显示的svg
     name: {
       type: String,
       required: true
     },
     // svg图标的颜色
     color: {
       type: String,
       required: false
     },
     // tailwind指定svg颜色的类名
     fillClass: {
       type: String,
       required: false
     }
   })
   
   //真实显示的svg图标（拼接#icon-）
   const symbolId = computed(() => {
     return `#icon-${props.name}`
   })
   </script>
   
   <style scoped lang="scss"></style>
   ```

2. 使用插件的方式全局注册svg-icon组件：

   1. 在`libs/index.js`以插件形式导出

      ```javascript
      impoet svgIcon from '@/libs/svg-icon/index.vue'
      
      export default {
        install(app){
          app.component('m-svg-icon',svgIcon)
        }
      }
      ```

   2. 在`main.js`中引入并注册

      ```javascript
      import mLibs from '@/libs'
      
      createApp(App).use(router).use(mLibs).mount('#app')
      ```

3. 使用注册好的全局组件`m-svg-icon`创建汉堡按钮，并使用tailwind添加自定义阴影效果

   ```javascript
     theme: {
       extend: {
         fontSize: {
           xs: ['.25rem', '0.35rem'],
           sm: ['.35rem', '0.45rem'],
           base: ['.45rem', '0.55rem'],
           lg: ['.55rem', '0.65rem'],
           xl: ['.65rem', '0.75rem']
         },
         boxShadow: {
           'l-white': '-10px 0 10px white'
         }
       }
     },
   ```

4. 使用tailwind为最后一个元素添加样式`last:mr-4`

   ```vue
     <div class="bg-white sticky top-0 left-0 z-10">
       <ul
         class="relative flex overflow-x-auto p-1 text-xs text-zinc-600 overflow-hidden"
       >
         <!-- 汉堡按钮    -->
         <li
           class="fixed top-0 right-[-1px] h-4 px-1 flex items-center bg-white z-20 shadow-l-white"
         >
           <m-svg-icon class="w-1.5 h-1.5" name="hamburger" />
         </li>
         <li
           v-for="item in data"
           :key="item.id"
           class="shrink-0 px-1.5 py-0.5 z-10 duration-200 last:mr-4"
         >
           {{ item.name }}
         </li>
       </ul>
     </div>
   ```

### 5.vite处理svg矢量图

* 无论是vue-cli还是vite默认都不会处理主动导入的svg矢量图标，也就是说，虽然我们把svg图标放入到了项目中，但是vite无法使用到它们

* 因此我们需要使用到vite的一个plugin，vite-plugin-svg-icons

  1. 使用`npm install vite-plugin-svg-icons -D`安装该插件

  2. 在`vite.config.js`中导入和配置

     ```javascript
     import path, { join } from 'path'
     import { createSvgIconsPlugin } from 'vite-plugin-svg-icons' 
     
     
     
     plugins: [
         vue(),
         createSvgIconsPlugin({
           //指定需要缓存的图标文件夹,process.cwd()指node命令执行的地址
           iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/')],
           //指定symbolId格式
           symbolId: 'icon-[name]'
         })
       ],
     ```

  3. 在`main.js`中注册svg-icons

     ```javascript
     //注册svg-icons
     import 'virtual:svg-icons-register'
     ```

### 6.移动端slider处理--vueuse-useScroll

1. 创建滑块，滑块在容器中使用absolute，且滑块的宽度和滑动距离需动态处理

   ```vue
    <!-- 滑块 -->
         <li
           ref="sliderTarget"
           :style="sliderStyle"
           class="absolute h-[22px] bg-zinc-900 rounded-lg duration-200"
         ></li>
   
   
   const sliderStyle = ref({
     transform: 'translateX(0px)',
     width: '60px'
   })
   ```

2. 滑块切换处理逻辑

   1. 选中的item下标：currentCategoryIndex

   2. 所有item元素：itemRefs，**通过所有item元素和item下标，使用getBoundingClientRect()能够获取到当前点击的元素的宽度和视窗距离等信息**

   3. ul的横向滚动偏离位置：ulScrollLeft，**使用vueuse中的useScroll()获取响应式的滚动距离**

   4. 最后在currentCategoryIndex发生改变时，获取item下标元素的left和width，计算sliderStyle即可

      ```javascript
      //滑块
      const sliderStyle = ref({
        transform: 'translateX(0px)',
        width: '60px'
      })
      
      // 选中的item下标
      const currentCategoryIndex = ref(0)
      
      //通过函数ref的形式获取所有的item元素
      let itemRefs = []
      const setItemRef = (el) => {
        if (el) {
          itemRefs.push(el)
        }
      }
      
      // 数组改变之后，DOM变化之前
      onBeforeUpdate(() => {
        itemRefs = []
      })
      
      //获取ul元素
      const ulTarget = ref(null)
      
      //通过vueuse中的useScroll获取响应式的scroll滚动距离
      const { x: ulScrollLeft } = useScroll(ulTarget)
      
      // wacth监听
      watch(currentCategoryIndex, (val) => {
        //获取元素的信息
        let { left, width } = itemRefs[val].getBoundingClientRect()
        sliderStyle.value = {
          // 滑块的位置=ul横向滚动的位置+当前元素的偏移-ul的padding
          transform: `translateX(${ulScrollLeft.value + left - 10}px)`,
          width: width + 'px'
        }
      })
      
      //item点击事件
      const onItemClick = (index) => {
        currentCategoryIndex.value = index
      }
      ```

### 7.补全category数据

1. 在`constants/index.js`中定义常量`ALL_CATEGORY_ITEM`

   ```javascript
   //category的本地构建数据
   export const ALL_CATEGORY_ITEM = {
     id: 'all',
     name: '全部'
   }
   ```

2. 在`views/main/index.vue`获取到category数据之后使用该常量添加到数组第一个位置

   ```javascript
   categorys.unshift(ALL_CATEGORY_ITEM)
   ```

### 8.通用组件：弹出窗口-popup实现--teleport传送组件、vueuse-useScrollLock

1. 弹出窗口-popup能力分析：

   1. 当popup展开时，内容视图应该不属于任何一个组件内部，而应该直接被插入到body中，**解决方案：通过内置组件teleport 插入到body中**
   2. popup应该包含两部分内容，一部分为背景蒙版，一部分为内容的包裹容器
   3. popup应该通过一个双向绑定进行控制展示和隐藏，**解决方案：组件之间的双向绑定，通过最新的v-model语法糖实现**
   4. popup展示时，滚动应该被锁定，**解决方案：使用vueuse中的useScrollLock(document.body)返回一个对象来操作，并监听传入的modelValue来同步useScrollLock的状态**
   5. 内容区域应该接收所有的attrs，并且应该通过插槽让调用方指定其内容

2. 在`libs`目录下创建`popup/index.vue`

   ```vue
   <template>
     <div>
       <teleport to="body">
         <!-- 蒙版 -->
         <transition name="fade">
           <div
             v-if="modelValue"
             class="w-screen h-screen bg-zinc-900/80 z-40 fixed top-0 left-0"
             @click="emits('update:modelValue', false)"
           ></div>
         </transition>
         <!-- 内容 -->
         <transition name="popup-down-up">
           <div
             v-if="modelValue"
             v-bind="$attrs"
             class="w-screen bg-white z-50 fixed bottom-0"
           >
             <slot></slot>
           </div>
         </transition>
       </teleport>
     </div>
   </template>
   
   <script setup>
   import { useScrollLock } from '@vueuse/core'
   import { watch } from 'vue'
   
   const props = defineProps({
     modelValue: {
       type: Boolean,
       required: true
     }
   })
   const emits = defineEmits(['update:modelValue'])
   
   //锁定滚动，通过isLocked可以进行锁定滚动
   const isLocked = useScrollLock(document.body)
   watch(
     props.modelValue,
     (val) => {
       isLocked.value = val
     },
     {
       immediate: true
     }
   )
   </script>
   
   <style scoped lang="scss">
   .fade-enter-active,
   .fade-leave-active {
     transition: all 0.3s;
   }
   .fade-enter-from,
   .fade-leave-to {
     opacity: 0;
   }
   .popup-down-up-enter-acitve,
   .popup-down-up-leave-active {
     transition: all 0.3s;
   }
   .popup-down-up-enter-from,
   .popup-down-up-leave-to {
     transition: all 0.3s;
     transform: translateY(100%);
   }
   </style>
   
   ```

### 9.组件间双向数据绑定功能优化--vueuse-useVModel

通过vueuse提供的useVModel方法，将v-model，props，emit转换为一个响应式数据，我们可以直接操作这个响应式数据来简化操作

```javascript
//是一个响应式数据，当isVisable发生变化时，会自动触发emit修改modelValue
const isVisable = useVModel(props)
```

### 10.vite通用组件自动化注册--glob导入

当开发完成通用组件后，每次都需要手动注册比较麻烦，我们期望通过vite提供的功能，进行通用组件的自动化注册：

1. vite的Glob导入功能：可以帮助我们在**文件系统中导入多个模块**

2. vue的`defineAsyncComponent`方法：该方法可以创建一个**按需加载的异步组件**

   ```javascript
   import { defineAsyncComponent } from 'vue'
   
   export default {
     install(app) {
       //1.获取当前路径下所有文件夹中的index.vue
       const components = import.meta.glob('./*/index.vue')
       //2.遍历获取到的组件模块
       for (const [fullPath, fn] of Object.entries(components)) {
         const componentName = 'm-' + fullPath.replace('./', '').split('/')[0]
         //3.利用app.component和defineAsyncComponent进行注册,fn是导入组件的箭头函数
         app.component(componentName, defineAsyncComponent(fn))
       }
     }
   }
   ```

### 11.业务组件：移动端弹层menu

1. 在`main/components`下新建`menu/index.vue`

   ```vue
   <template>
     <div class="py-2 h-[80vh] flex flex-col">
       <h2 class="text-xl text-zinc-900 font-bold mb-2 px-1">分类</h2>
       <ul class="overflow-y-scroll">
         <li
           class="text-lg text-zinc-900 px-1 py-1.5 duration-100 active:bg-zinc-100"
           v-for="(item, index) in categorys"
           :key="item.id"
           @click="$emit('onItemClick', index)"
         >
           {{ item.name }}
         </li>
       </ul>
     </div>
   </template>
   
   <script setup>
   defineProps({
     categorys: {
       type: Array,
       required: true
     }
   })
   
   //推荐使用到的自定义事件注册
   defineEmits(['onItemClick'])
   </script>
   
   <style scoped lang="scss"></style>
   ```

2. 接收categorys参数，并绑定点击事件触发自定义事件修改currentCategoryIndex值，并使用原生DOMAPI`offsetLeft`解决了点击按钮滚动条跟随滚动的问题，vueuse中的useScroll无法解决这个问题（不太清楚）

   ```vue
   // wacth监听
   watch(currentCategoryIndex, (val) => {
     //获取元素的信息
     let { left, width } = itemRefs[val].getBoundingClientRect()
     sliderStyle.value = {
       // 滑块的位置=ul横向滚动的位置+当前元素的偏移-ul的padding
       // transform: `translateX(${ulScrollLeft.value + left - 10}px)`,
       //使用原生offsetLeft完美解决点击按钮滚动条滚动的问题
       transform: `translateX(${itemRefs[val].offsetLeft - 10}px)`,
       width: width + 'px'
     }
   })
   
   //点击按钮滚动条滚动
   const onItemClickScroll = (index) => {
     currentCategoryIndex.value = index
     isVisable.value = false
     ulTarget.value.scrollLeft = itemRefs[index].offsetLeft
   }
   
   ```

## 6.企业级通用业务Header处理方案--结合中台组件的业务组件处理

### 1.处理PC端基础架构

1. 在`views/layout`目录下新建`header、main、floating`三个组件并配置路由

   ```vue
   <template>
     <div class="h-screen">
        <header-vue class="h-header"></header-vue>
       <main-vue class="h-main"></main-vue>
       <floating-vue class="fixed bottom-10 right-2"></floating-vue>
     </div>
   </template>
   
   <script setup>
   import headerVue from './components/header/index.vue'
   import mainVue from './components/main.vue'
   import floatingVue from './components/floating.vue'
   </script>
   
   <style scoped lang="scss"></style>
   
   
   export default [
     {
       path: '/',
       name: 'home',
       component: () => import('@/views/layout/index.vue'),
       children: []
     }
   ]
   ```

2. 处理`header、main、floating`的基本布局样式，在`tailwind.config.js`中新增自定义样式`h-main和h-header`

   ```vue
   <template>
     <div class="h-screen">
        <header-vue class="h-header"></header-vue>
       <main-vue class="h-main"></main-vue>
       <floating-vue class="fixed bottom-10 right-2"></floating-vue>
     </div>
   </template>
   
   height: {
       header: '72px',
       //这里100vh - 72px必须用空格隔开
       main: 'calc(100vh - 72px)'
   }
   ```

### 2.PC端header模块处理分析与简单实践

1. 将header模块划分为三块区域`header-search、header-my、header-theme`和`index.vue`

2. 简单实现header的布局:

   ```vue
   <template>
     <div class="w-full bg-white border-b border-b-zinc-200 px-2 py-1">
       <div class="flex items-center">
         <img
           class="h-4 cursor-pointer mr-2"
           src="https://m.imooc.com/static/wap/static/common/img/logo-small@2x.png"
           @click="onToHome"
         />
         <header-search-vue class="mr-1"></header-search-vue>
         <header-my-vue class="mr-1"></header-my-vue>
         <header-theme-vue></header-theme-vue>
       </div>
     </div>
   </template>
   
   <script setup>
   import headerSearchVue from './header-search/index.vue'
   import headerMyVue from './header-my.vue'
   import headerThemeVue from './header-theme.vue'
   import { useRouter } from 'vue-router'
   
   const router = useRouter()
   const onToHome = () => {
     router.push('/')
   }
   </script>
   
   <style scoped lang="scss"></style>
   ```


### 3.通用组件：search搜索框能力分析

1. 输入内容实现双向数据绑定
2. 鼠标移入与获取焦点时的动画
3. 一键清空文本功能
4. 搜索触发功能
5. 可控制，可填充的下拉展示区
6. 监听到以下事件列表：
   1. clear：删除所有文本事件
   2. input：输入事件
   3. focus：获取焦点事件
   4. blur：失去焦点事件
   5. search：触发搜索（点击或回车）事件

### 4.通用组件：search搜索框样式处理

1. 搜索栏自适应布局：父容器是flex弹性盒，左右两端固定大小，搜索框宽度100%实现自适应

2. 鼠标移入父级盒子，使搜索框背景变白：在父级盒子添加类名`group`，搜索框使用`group-hover`等即可实现

3. 简单理解一下`transition`过渡动画：`transition`过渡需要搭配`v-if或v-show`来使用，常用的是激活状态和初始状态，**因为最终状态一般是我们已经写好的布局样式，而初始状态的表现形式则是已有样式加上初始样式合并**

   ```vue
   <template>
     <div
       class="group w-full relative p-0.5 rounded-xl border-white duration-500 hover:bg-red-100/40"
     >
       <div>
         <!-- 搜索图标 -->
         <m-svg-icon
           class="w-1.5 h-1.5 absolute translate-y-[-50%] top-[50%] left-2"
           name="search"
           color="#707070"
         ></m-svg-icon>
         <!-- 输入框 -->
         <input
           class="block w-full h-[44px] pl-4 outline-0 bg-zinc-100 caret-zinc-400 rounded-xl text-zinc-900 tracking-wide text-sm font-semibold border border-zinc-100 duration-500 focus:border-red-300 group-hover:bg-white group-hover:border-zinc-200"
           type="text"
           placeholder="搜索"
         />
         <!-- 删除按钮 -->
         <m-svg-icon
           name="input-delete"
           class="h-1.5 w-1.5 absolute translate-y-[-50%] top-[50%] right-9 cursor-pointer duration-500"
         ></m-svg-icon>
         <!-- 分割线 -->
         <div
           class="opacity-0 h-1.5 w-[1px] absolute translate-y-[-50%] top-[50%] right-[62px] duration-500 bg-zinc-200 group-hover:opacity-100"
         ></div>
         <!-- TODO：搜索按钮（通用组件） -->
       </div>
       <!-- 下拉区 -->
       <transition name="slide">
         <div
           class="max-h-[368px] w-full text-base overflow-auto bg-white absolute z-20 left-0 top-[56px] p-2 rounted border border-zinc-200 duration-200 hover:shadow-2xl"
         >
           <slot name="dropdown"></slot>
         </div>
       </transition>
     </div>
   </template>
   
   <script setup></script>
   
   <style scoped lang="scss">
   .slide-enter-active,
   .slide-leave-active {
     transition: all 0.5s;
   }
   .slide-enter-from,
   .slide-leave-to {
     opacity: 0;
     transform: translateY(40px);
   }
   </style>
   
   ```

### 5.通用组件：button按钮能力分析

1. 可以显示文字按钮，并提供loading功能
2. 可以显示icon按钮，并可以任意指定icon颜色
3. 可开关的点击动画
4. 可以指定各种风格和大小
5. 当指定的风格或大小不符合预设时，需要给开发者以提示消息

### 6.通用组件：button按钮功能实现

1. 最终结果：基本实现了一个完整的button组件的封装

2. 核心思想：通过props来控制组件的整体表现，**重点学会了处理各种props以及对props校验之后抛出异常；同时通过自定义事件实现了组件中的原生事件触发**

   ```vue
   <template>
     <button
       class="text-sm text-center rounded duration-150 flex justify-center items-center"
       :class="[
         typeEnum[type],
         sizeEnum[sizeKey].button,
         { 'active:scale-105': isActiveAnim }
       ]"
       @click.stop="onBtnClick"
     >
       <!-- loading -->
       <m-svg-icon
         v-if="loading"
         name="loading"
         class="w-2 h-2 animate-spin mr-1"
       ></m-svg-icon>
       <!-- icon按钮 -->
       <m-svg-icon
         v-if="icon"
         :name="icon"
         class="m-auto"
         :class="sizeEnum[sizeKey].icon"
         :color="iconColor"
         :fillClass="iconClass"
       >
       </m-svg-icon>
   
       <!-- 文字按钮 -->
       <slot v-else></slot>
     </button>
   </template>
   
   <script>
   const EMITS_CLICK = 'click'
   //type可选项：表示按钮风格
   const typeEnum = {
     primary: 'text-white bg-zinc-800 hover:bg-zinc-900 active:bg-zinc-800',
     main: 'text-white bg-main hover:bg-hover-main active:bg-main',
     info: 'text-zinc-800 bg-zinc-200 hover:bg-zinc-300 active:bg-zinc-200'
   }
   //size可选项：表示按钮的大小，区分文字按钮和icon按钮
   const sizeEnum = {
     // 文字按钮
     default: {
       button: 'w-8 h-4 text-base',
       icon: ''
     },
     //icon按钮
     'icon-default': {
       button: 'w-4 h-4',
       icon: 'w-1.5 h-1.5'
     },
     small: {
       button: 'w-7 h-3 text-base',
       icon: ''
     },
     'icon-small': {
       button: 'w-3 h-3',
       icon: 'w-1.5 h-1.5'
     }
   }
   </script>
   
   <script setup>
   import { computed } from 'vue'
   /**
    * 1.构建type风格可选项和size大小可选项
    * 2.通过props让开发者控制按钮
    * 3.区分icon button和text button
    * 4.依据当前的数据，实现视图
    * 5.处理点击事件
    */
   const props = defineProps({
     //icon图标
     icon: String,
     //icon颜色
     iconColor: String,
     //icon图标类名（tailwind）
     iconClass: String,
     //按钮风格
     type: {
       type: String,
       default: 'main',
       validator(val) {
         //1.获取所有的可选项
         const keys = Object.keys(typeEnum)
         //2.开发者指定的风格在可选项中吗
         const result = keys.includes(val)
         if (!result) {
           throw new Error(`你的type必须是${keys.join('、')}中的一个`)
         }
         return result
       }
     },
     //大小风格
     size: {
       type: String,
       default: 'default',
       validator(val) {
         //1.获取所有的可选项
         const keys = Object.keys(sizeEnum).filter((key) => {
           return !key.includes('icon-')
         })
         //2.开发者指定的风格在可选项中吗
         const result = keys.includes(val)
         if (!result) {
           throw new Error(`你的size必须是${keys.join('、')}中的一个`)
         }
         return result
       }
     },
     //按钮点击时，是否需要动画
     isActiveAnim: {
       type: Boolean,
       default: true
     },
     //加载状态
     loading: {
       type: Boolean,
       default: false
     }
   })
   
   const emits = defineEmits(EMITS_CLICK)
   
   //处理props.size
   const sizeKey = computed(() => {
     return (props.icon && 'icon-' + props.size) || props.size
   })
   
   /**
    * 点击事件处理,相当于实现一个组件身上的点击事件
    */
   const onBtnClick = () => {
     if (props.loading) return
     emits(EMITS_CLICK)
   }
   </script>
   
   <style scoped lang="scss"></style>
   
   ```

### 7.通用组件：search完善基本能力--vueuse-onClickOutside

1. 组件的双向数据绑定：

   1. `v-model`是v-bind和input事件(默认)及其处理函数的简写，组件上无法绑定原生事件，因此这里的input事件为自定义事件，需要在组件内部触发并且将内部的双向绑定值传给父组件；`.sync`修饰符同样也是属性绑定和自定义事件绑定的简写
   2. props值是只读的，组件内部的input框的双向数据绑定需要使用ref包裹props得到一个响应式数据才能在清空数据时触发原生的input事件实现组件的双向数据绑定
   3. 使用vueuse中的`useVModel()`，可以简化自定义事件的调用，并且返回一个我们可以直接操作的响应式数据

2. 控制下拉区的展示：

   1. 首先通过`  v-if="$slots.dropdown"`控制是否有插槽内容传入，如果有再展示 

   2. 然后通过判断input框是否获取焦点`v-show`展示 

   3. **在search组件外点击隐藏下拉区，想要监听指定dom之外的点击事件，我们使用vueuse的`onClickOutside`**

      ```vue
          <!-- 下拉区 -->
          <transition name="slide">
            <div
              v-if="$slots.dropdown"
              v-show="isFocus"
              class="max-h-[368px] w-full text-base overflow-auto bg-white absolute z-20 left-0 top-[56px] p-2 rounted border border-zinc-200 duration-200 hover:shadow-2xl"
            >
              <slot name="dropdown"></slot>
            </div>
          </transition>
      
      
      //input是否获取到焦点
      const isFocus = ref(false)
      const containerTarget = ref(null)
      
      /**
       * 获取到焦点
       */
      const onfocusHandler = () => {
        isFocus.value = true
      }
      
      /**
       * 点击区域外隐藏
       */
      onClickOutside(containerTarget, () => {
        isFocus.value = false
      })
      ```

3. 自定义组件处理事件：**为了提高组件的复用性（通用组件内部肯定不能直接处理数据）和实现常用的事件（组件身上绑定原生事件无效），需要处理自定义组件事件绑定**

   ```vue
   <script>
   //双向绑定
   const EMIT_UPDATE_MODELVALUE = 'update:modelValue'
   //search搜索
   const EMIT_SEARCH = 'search'
   //删除所有文本
   const EMIT_CLEAR = 'clear'
   //输入事件
   const EMIT_INPUT = 'input'
   //获取焦点事件
   const EMIT_FOCUS = 'focus'
   //失去焦点事件
   const EMIT_BLUR = 'blur'
   </script>
   
   
   
   onst inputValue = useVModel(props)
   
   /**
    * 监听用户输入行为
    */
   watch(inputValue, (val) => {
     emits(EMIT_INPUT, val)
   })
   
   /**
    * 删除文本
    */
   const onclearClick = () => {
     inputValue.value = ''
     emits(EMIT_CLEAR, '')
   }
   
   /**
    * 搜索
    */
   const onSearchHandler = () => {
     emits(EMIT_SEARCH, inputValue.value)
   }
   
   //input是否获取到焦点
   const isFocus = ref(false)
   const containerTarget = ref(null)
   
   /**
    * 获取到焦点
    */
   const onfocusHandler = () => {
     isFocus.value = true
     emits(EMIT_INPUT)
   }
   
   /**
    * 失去焦点
    */
   const onBlurHandler = () => {
     emits(EMIT_BLUR)
   }
   ```

### 8.通用组件：popover气泡卡片基础功能实现

1. 在`libs`目录下新建`popover/index.vue`，提供两个插槽并实现插槽的按需展示，**使用js事件展示可以搭配transition实现可以轻松实现复杂的动画效果，使用css:hover伪类展示实现复杂的效果比较复杂**

   ```vue
   <template>
     <div>
       <div class="relative" @mouseenter="onMouseenter" @mouseleave="onMouseleave">
         <!-- 具名插槽：触发弹层的视图 -->
         <slot name="reference"></slot>
         <!-- 气泡展示 -->
         <transition name="slide">
           <div
             v-show="isViable"
             class="absolute p-1 z-20 bg-white border rounded-md"
           >
             <!-- 匿名插槽：弹出层视图中展示的内容 -->
             <slot></slot>
           </div>
         </transition>
       </div>
     </div>
   </template>
   
   <script setup>
   import { ref } from 'vue'
   
   const isViable = ref(false)
   
   /**
    * 鼠标移入触发
    */
   const onMouseenter = () => {
     isViable.value = true
   }
   
   /**
    * 鼠标移出触发
    */
   const onMouseleave = () => {
     isViable.value = false
   }
   </script>
   
   <style scoped lang="scss">
   .slide-enter-active,
   .slide-leave-active {
     transition: opacity 0.3s, transform 0.3s;
   }
   .slide-enter-from,
   .slide-leave-to {
     opacity: 0;
     transform: translateY(20px);
   }
   </style>
   
   ```

2. 匿名插槽中相同的选项使用v-for来渲染以简化代码，由于主题切换值固定，我们在`constants/index.js`下定义主题的常量并导入使用：

   ```javascript
   //极简白
   export const THEME_LIGHT = 'THEME_LIGHT'
   //极夜黑
   export const THEME_DARK = 'THEME_DARK'
   //跟随系统
   export const THEME_SYSTEM = 'THEME_SYSTEM'
   
   import { THEME_LIGHT, THEME_DARK, THEME_SYSTEM } from '@/constants/index'
   const themeArr = [
     {
       id: 0,
       type: THEME_LIGHT,
       icon: 'theme-light',
       name: '极简白'
     },
     {
       id: 1,
       type: THEME_DARK,
       icon: 'theme-dark',
       name: '极夜黑'
     },
     {
       id: 2,
       type: THEME_SYSTEM,
       icon: 'theme-system',
       name: '跟随系统'
     }
   ]
   ```

3. 为了方便，直接将主题切换的数组定义在`constants/index.js`中方便以后直接修改

   ```javascript
   // 主题切换
   export const themeArr = [
     {
       id: 0,
       type: THEME_LIGHT,
       icon: 'theme-light',
       name: '极简白'
     },
     {
       id: 1,
       type: THEME_DARK,
       icon: 'theme-dark',
       name: '极夜黑'
     },
     {
       id: 2,
       type: THEME_SYSTEM,
       icon: 'theme-system',
       name: '跟随系统'
     }
   ]
   ```

### 9.通用组件：popover功能延伸，控制气泡展示位置

1. 核心思想：通过传入的`placement`值和插槽的`offsetWidth和offsetHeight`(宽度和高度)动态计算出一个定位的style值能进行定位

2. 注意点：`v-show`的内容初始时会渲染在页面，可以直接拿到DOM，`v-if`在数据改变后，vue需要等待一段时间渲染DOM，通过`nextTick()`创建一个异步任务能拿到DOM

   ```vue
   <script>
   // 左上
   const PROP_TOP_LEFT = 'top-left'
   // 右上
   const PROP_TOP_RIGHT = 'top-right'
   // 左下
   const PROP_BOTTOM_LEFT = 'bottom-left'
   // 右下
   const PROP_BOTTOM_RIGHT = 'bottom-left'
   
   const placementEnum = [
     PROP_TOP_LEFT,
     PROP_TOP_RIGHT,
     PROP_BOTTOM_LEFT,
     PROP_BOTTOM_RIGHT
   ]
   </script>
   
   
   <script setup>
   import { nextTick, ref, watch } from 'vue'
   
   /**
    * 1. 指定所有可选位置的常量，并生成enum
    * 2. 通过prop控制指定位置
    * 3. 获取元素的DOM，创建读取元素尺寸的方法
    * 4. 生成气泡的样式对象，用来控制每个位置对应的样式
    * 5. 根据prop，计算样式对象
    */
   
   const props = defineProps({
     //控制气泡弹出位置,给出开发者错误提示
     placement: {
       type: String,
       default: PROP_TOP_LEFT,
       validator(val) {
         const result = placementEnum.includes(val)
         if (!result) {
           throw new Error(`你的placement必须是${placementEnum.join(',')}中的一个`)
         }
         return val
       }
     }
   })
   
   const isViable = ref(false)
   
   /**
    * 鼠标移入触发
    */
   const onMouseenter = () => {
     isViable.value = true
   }
   
   /**
    * 鼠标移出触发
    */
   const onMouseleave = () => {
     isViable.value = false
   }
   
   /**
    * 计算元素的尺寸
    */
   const referenceTarget = ref(null)
   const contentTarget = ref(null)
   const useElementSize = (target) => {
     if (!target) return {}
     return {
       width: target.offsetWidth,
       height: target.offsetHeight
     }
   }
   
   /**
    *气泡样式
    */
   const contentStyle = ref({
     top: 0,
     left: 0
   })
   
   //计算：期望气泡展示的时候再进行计算
   watch(isViable, (val) => {
     if (!val) return
     // vue在数据改变之后，需要等待一段时间DOM才会变化，使用v-if控制不能同步获取dom
     nextTick(() => {
       switch (props.placement) {
         //左上
         case PROP_TOP_LEFT:
           contentStyle.value.top = 0
           contentStyle.value.left =
             -useElementSize(contentTarget.value).width + 'px'
           break
         //右上
         case PROP_TOP_RIGHT:
           contentStyle.value.top = 0
           contentStyle.value.left =
             useElementSize(referenceTarget.value).width + 'px'
           break
         // 左下
         case PROP_BOTTOM_LEFT:
           contentStyle.value.top =
             useElementSize(referenceTarget.value).height + 'px'
           contentStyle.value.left =
             -useElementSize(contentTarget.value).width + 'px'
           break
         // 右下
         case PROP_BOTTOM_RIGHT:
           contentStyle.value.top =
             useElementSize(referenceTarget.value).height + 'px'
           contentStyle.value.left =
             useElementSize(referenceTarget.value).width + 'px'
           break
       }
     })
   })
   </script>
   
   ```

### 10.通用组件：popover处理慢速移动时，气泡消失问题

当鼠标慢速移动时，气泡会消失，解决方案：我们可以利用类似于防抖（debounce）的概念，也就是：当鼠标刚离开时，不去立刻修改isVisable，而是延迟一段时间，如果在这段时间之内，再次触发了鼠标移入事件，则不再修改isViable（清空定时器）

```javascript
/**
 * 鼠标移入触发
 */
let timeout = null
const onMouseenter = () => {
  if (timeout) {
    clearTimeout(timeout)
  }
  isViable.value = true
}

/**
 * 鼠标移出触发
 */
const onMouseleave = () => {
  timeout = setTimeout(() => {
    isViable.value = false
  }, DELAY_TIME)
}
```

### 11.基于popover处理用户模块

与主题切换类似使用插槽类似实现用户模块

```vue
<template>
  <m-popover class="flex items-center" placement="bottom-left">
    <template #reference>
      <div
        class="relative flex items-center p-0.5 rounded-sm cursor-pointer duration-200 outline-none hover:bg-zinc-100"
      >
        <!-- 头像 -->
        <img class="w-3 h-3 rounded-sm" src="@/assets/images/1.jpg" />
        <!-- 下箭头 -->
        <m-svg-icon
          name="down-arrow"
          fillClass="fill-zinc-900"
          class="h-1.5 w-1.5 ml=0.5"
        ></m-svg-icon>
        <!-- vip -->
        <m-svg-icon
          name="vip"
          fillClass="fill-zinc-900"
          class="h-1.5 w-1.5 absolute right-[16px] bottom-0"
        ></m-svg-icon>
      </div>
    </template>
    <!-- 气泡 -->
    <div class="w-[140px] overflow-hidden">
      <div
        class="flex items-center p-1 cursor-pointer rounded hover:bg-zinc-100/60"
        v-for="item in menuArr"
        :key="item.id"
      >
        <m-svg-icon
          :name="item.icon"
          class="w-1.5 h-1.5 mr-1"
          fillClass="fill-zinc-900"
        ></m-svg-icon>
        <span class="text-zinc-800 text-sm">{{ item.title }}</span>
      </div>
    </div>
  </m-popover>
</template>

<script setup>
//构建数据源
const menuArr = [
  {
    id: 0,
    title: '个人资料',
    icon: 'profile',
    path: '/profile'
  },
  {
    id: 1,
    title: '升级 VIP',
    icon: 'vip-profile',
    path: '/memeber'
  },
  {
    id: 2,
    title: '退出登录',
    icon: 'logout',
    path: ''
  }
]
</script>

<style scoped lang="scss"></style>

```

## 7.企业级复杂前中台项目响应式处理方案

### 1.响应式navigationBar实现方案分析

通常情况下，复杂功能的响应式处理，一般我们有三种处理方案：

1. 一套代码处理多端：
   1. 优势：代码量相对比较少
   2. 劣势：耦合性强，不利于后期维护
2. 多带代码处理各端
   1. 优势：逻辑清晰
   2. 劣势：可能会产生很多复杂的逻辑
3. 结合以上两种方案，抽离共用逻辑，封装私有逻辑
   1. 优势：结合以上两点优势
   2. 劣势：需要对业务和逻辑足够清楚

我们知道一个功能由两部分组成：

1. 数据：移动端和PC端的数据是一样的，所以数据完全可以复用，目前数据是通过`src\views\main\components\navigation\index.vue`进行获取，然后进行传递，那么我们期望进行数据的复用，如果一直进行数据传递的话，未免有些过于复杂；因此对于数据，我们可以通过vuex来封装这一系列的获取、切换行为

2. 视图：双方的视图在展示中的逻辑具备较大差异，所以为了综合可维护性，视图逻辑部分我们期望单独封装到各自的组件中进行处理

总结：我们分析了navigationBar的公有和私有部分：

1. **数据为公有数据，可以在vuex中进行抽离处理**
2. **视图为私有部分，需要在各自的组件中进行单独处理**

### 2.抽离公用逻辑，封装系列动作

```javascript
import { createStore } from 'vuex'
import getters from './getters.js'
import category from './modules/category.js'

export const store = createStore({
  getters,
  modules: {
    category
  }
})
export default store
```

```javascript
import { ALL_CATEGORY_ITEM } from '@/constants'
import { getCategory } from '@/api/mock/category'
/**
 * 处理navigationBar中的数据categorys
 */
export default {
  //独立作用域
  namespaced: true,
  state: () => {
    return {
      categorys: [ALL_CATEGORY_ITEM]
    }
  },
  mutations: {
    /**
     * 为categorys赋值
     */
    setCategorys(state, newCategorys) {
      state.categorys = [ALL_CATEGORY_ITEM, ...newCategorys]
    }
  },
  actions: {
    /**
     * 获取category数据，并自动保存到vuex中
     */
    async useCategoryData(context) {
      const { categorys } = await getCategory()
      context.commit('setCategorys', categorys)
    }
  }
}

```

1. 通过抽离单独的`getters.js`文件，可以实现对各个模块数据的快速获取

   ```javascript
   export default {
     //简单访问
     categorys: (state) => state.category.categorys
   }
   
   ```

2. 在`src\views\main\components\navigation\index.vue`父组件中派发`actions`发起网络请求获取数据

   ```javascript
   import { useStore } from 'vuex'
   const store = useStore()
   //触发category获取数据
   store.dispatch('category/useCategoryData')
   ```

3. 在需要数据的子组件内部可以直接使用`$store.getters.categorys`获取数据，这种简便方法在vue2同样能够使用

   ```vue
   <li
           v-for="(item, index) in $store.getters.categorys"
           :key="item.id"
           class="shrink-0 px-1.5 py-0.5 z-10 duration-200 last:mr-4"
           :class="currentCategoryIndex === index && 'text-zinc-100'"
           :ref="setItemRef"
           @click="onItemClick(index)"
         >
           {{ item.name }}
         </li>
   ```

### 3.PC端navigationBar私有视图处理

1. 基本实现navigationBar

   ```vue
   <template>
     <div class="bg-white sticky top -0 left-0 w-full z-10">
       <ul
         class="w-[800px] relative flex flex-wrap justify-center overflow-x-auto px-[10px] py-1 text-xs text-zinc-600 duration-300 overflow-hidden mx-auto"
       >
         <!-- 展示箭头 -->
         <div
           class="absolute right-1 bottom-1 z-20 p-1 rounded cursor-pointer duration-200 hover:bg-zinc-200"
         >
           <m-svg-icon
             name="unfold"
             class="w-1 h-1"
             fillClass="fill-zinc-900"
           ></m-svg-icon>
         </div>
         <!-- item -->
         <li
           v-for="item in $store.getters.categorys"
           :key="item.id"
           class="shrink-0 px-1.5 py-0 z-10 duration-200 text-zinc-900 text-base font-bold h-4 leading-4 cursor-pointer hover:bg-zinc-200 rounded mr-1 mb-1"
         >
           {{ item.name }}
         </li>
       </ul>
     </div>
   </template>
   
   <script setup></script>
   
   <style scoped lang="scss"></style>
   ```

2. 处理navigationBar路由

   ```javascript
   export default [
     {
       path: '/',
       name: 'home',
       component: () => import('@/views/layout/index.vue'),
       children: [
         {
           path: '',
           name: 'home',
           component: () => import('@/views/main/index.vue')
         }
       ]
     }
   ]
   ```

3. navigationBar样式处理和菜单栏展开闭合思路分析：

   1. 通过flex布局`flex-wrap justify-center`使元素自适应并且居中显示快速地实现了菜单栏效果
   2. 将展开收起箭头图标定位在父元素右下角实现动态展示位置
   3. 显示隐藏：通过响应式数据动态控制菜单栏高度搭配溢出显示隐藏实现菜单栏的展开和闭合，同样通过响应式数据控制`m-svg-icon`的name名实现icon切换
   4. 动态控制高度也巧妙地实现了展开菜单内容向下顶出

4. 绑定样式还能这样！！！

   ```vue
   :class="currentCategoryIndex === index && 'text-zinc-900 bg-zinc-200'"
   
   :class="{ 'text-zinc-900 bg-zinc-200': currentCategoryIndex === index }"
   ```

### 4.分析和处理navigationBar闪烁问题--提供初始化数据，并持久化存储

当请求异步数据回来之后，页面会重新渲染导致闪烁，解决方案：

1. 个人想到的：使用v-if判断`v-if="$store.getters.categorys.length !== 1"`判断数据长度来隐藏，但是数据获取回来之后展示仍然会闪烁，方案失败

2. 提供初始化数据：

   1. 让categorys具备一个初始化数据

      ```javascript
      //category 的初始化数据
      export const CATEGORY_NOMAR_DATA = [
        ALL_CATEGORY_ITEM,
        { id: 'web_app_icon', name: 'UI/UX', col: 1, urlname: 'web_app_icon' },
        { id: 'design', name: '平面', col: 1, urlname: 'design' },
        { id: 'illustration', name: '插画/漫画', col: 1, urlname: 'illustration' },
        { id: 'photography', name: '摄影', col: 2, urlname: 'photography' },
        { id: 'games', name: '游戏', urlname: 'games' },
        { id: 'anime', name: '动漫', urlname: 'anime' },
        {
          id: 'industrial_design',
          name: '工业设计',
          col: 2,
          urlname: 'industrial_design'
        },
        { id: 'architecture', name: '建筑设计', urlname: 'architecture' },
        { id: 'art', name: '人文艺术', urlname: 'art' },
        { id: 'home', name: '家居/家装', col: 1, urlname: 'home' },
        { id: 'apparel', name: '女装/搭配', col: 1, urlname: 'apparel' },
        { id: 'men', name: '男士/风尚', col: 2, urlname: 'men' },
        { id: 'modeling_hair', name: '造型/美妆', urlname: 'modeling_hair' },
        { id: 'diy_crafts', name: '手工/布艺', urlname: 'diy_crafts' },
        { id: 'food_drink', name: '美食', urlname: 'food_drink' },
        { id: 'travel_places', name: '旅行', urlname: 'travel_places' },
        { id: 'wedding_events', name: '婚礼', col: 2, urlname: 'wedding_events' }
      ]
      ```

   2. 从服务端获取数据，替换初始化数据

      ```javascript
      import { ALL_CATEGORY_ITEM } from '@/constants'
      import { getCategory } from '@/api/mock/category'
      import { CATEGORY_NOMAR_DATA } from '@/constants/index'
      /**
       * 处理navigationBar中的数据categorys
       */
      export default {
        //独立作用域
        namespaced: true,
      
        state: () => {
          return {
            /**
             * 1.让categorys具备一个初始化数据
             * 2.从服务端获取数据，替换初始化数据
             * 3.为了防止初始化数据太老，我们把每次获取到的新数据，都做为下一次的初始化数据
             */
            categorys: CATEGORY_NOMAR_DATA
          }
        },
        mutations: {
          /**
           * 为categorys赋值
           */
          setCategorys(state, newCategorys) {
            state.categorys = [ALL_CATEGORY_ITEM, ...newCategorys]
          }
        },
        actions: {
          /**
           * 获取category数据，并自动保存到vuex中
           */
          async useCategoryData(context) {
            const { categorys } = await getCategory()
            context.commit('setCategorys', categorys)
          }
        }
      }
      
      ```

   3. 为了防止初始化数据太老，我们把每次获取到的新数据，都做为下一次的初始化数据：解决方案：每次从接口得到的数据，进行缓存（localStorage）；在下次运行时，把缓存的数据作为初始值

### 5.category数据缓存，覆盖初始数据

* 在处理好了闪烁的问题之后，接下来我们要完成明确的第三步，也就是**缓存请求得来的vuex中的数据，并且在下次运行时把缓存的数据作为初始值**；想要实现这一步的功能，我们可以利用[vuex-persistedstate](https://github.com/robinvdvleuten/vuex-persistedstate)

* vuex-persistedstate：可以自动保存vuex中的数据到localStorage，并且在下次开始的时候自动读取这个数据到对应的state中

* vuex-persistedstate使用：

  1. 安装vuex-persistedstate：`npm i --save vuex-persistedstate`

  2. 在`src/store/index.js`中导入，并注册plugin

     ```javascript
     import { createStore } from 'vuex'
     import createPersistedState from 'vuex-persistedstate'
     import getters from './getters.js'
     import category from './modules/category.js'
     
     export const store = createStore({
       getters,
       modules: {
         category
       },
       plugins: [
         createPersistedState({
           //指定保存到localStorage中的key值
           key: 'imooc-front',
           //需要保存的模块
           paths: ['category']
         })
       ]
     })
     export default store
     ```

## 8.主题替换解决方案，打造完善多主题

### 1.tailwind深色模式原理

`tailwindcss`为我们提供了`DarkMode`，首先需要在`tailwind.config.js`中开启`darkMode: 'class'`当在html根标签指定dark类名时，内部所有使用了`dark:xxx`的类名将激活

### 2.DarkMode在复杂应用中的实现逻辑分析

1. 监听主题的切换行为

2. 根据行为保存当前需要展示的主题到vuex中

3. 根据vuex中保存的当前主题，展示header-theme下的显示图标

4. 根据vuex中保存的当前主题，修改html的class

### 3.DarkMode在复杂应用中的实现

1. 创建vuex的theme模块：在`store/modules`下创建`theme.js`

   ```javascript
   import { THEME_LIGHT } from '@/constants'
   
   export default {
     namespaced: true,
     state: () => {
       //当前主题模式
       themeType: THEME_LIGHT
     },
     mutations: {
       changeThemeType(state, newTheme) {
         state.themeType = newTheme
       }
     },
     actions: {}
   }
   ```

2. 持久化存储`theme.js`中的主题类型，并在`getters.js`中解耦

   ```javascript
   import { createStore } from 'vuex'
   import createPersistedState from 'vuex-persistedstate'
   import getters from './getters.js'
   import category from './modules/category.js'
   import theme from './modules/theme.js'
   
   export const store = createStore({
     getters,
     modules: {
       category,
       theme
     },
     plugins: [
       createPersistedState({
         //指定保存到localStorage中的key值
         key: 'imooc-front',
         //需要保存的模块
         paths: ['category', 'theme']
       })
     ]
   })
   export default store
   
   //getters.js
   export default {
     //简单访问
     categorys: (state) => state.category.categorys,
     //当前主题
     themeType: (state) => state.theme.themeType
   }
   
   ```

3. 监听点击事件，动态切换主题图标，注意getters获取的时候是属性不是方法：

   ```javascript
   /**
    * menu 切换事件
    */
   const onItemClick = (themeItem) => {
     store.commit('theme/changeThemeType', themeItem.type)
   }
   
   /**
    * 展示图标
    */
   const svgIconName = computed(() => {
     const findTheme = themeArr.find((item) => {
       return item.type === store.getters.themeType
     })
     return findTheme?.icon
   })
   ```

4. 在`utils/theme.js`封装工具方法并在main.js导入并调用：

   ```javascript
   import { THEME_DARK, THEME_LIGHT, THEME_SYSTEM } from '@/constants/index.js'
   import { watch } from 'vue'
   import store from '../store'
   /**
    * 初始化主题
    */
   export default () => {
     //1.当主题发生改变时，或者当进入系统时，可以进行html class的配置
     watch(
       () => store.getters.themeType,
       (val) => {
         //html的class
         let themeClassName = ''
   
         switch (val) {
           case THEME_LIGHT:
             themeClassName = 'light'
             break
           case THEME_DARK:
             themeClassName = 'dark'
             break
         }
         //修改html的class
         document.querySelector('html').className = themeClassName
       },
       {
         //初始执行一次
         immediate: true
       }
     )
   }
   ```

5. 动画切换过于生硬，可以为header和navigationBar组件添加动画持续时间`duration-500`

### 4.跟随系统的主题变更--window.matchMedia()

想要生成跟随系统的主题变更，我们需要利用`window.matchMedia()`方法，该方法接收一个必传的参数`mediaQueryString`（媒体查询解析的字符串）,该字符串我们可以传递`prefers-color-scheme`，即`window.matchMedia('(prefers-color-scheme:dark)')`，该方法可以返回一个`MediaQueryList`对象：

1. `MediaQueryList`对象存在一个change事件，可以监听主体发生变更的行为

2. `MediaQueryList`对象同时存在一个matches属性，该属性为boolean性的值：

   1. true：深色主题
   2. false：浅色主题

3. 核心思路：根据vuex中保存的主题类型进行判断，当选择了`THEME_SYSTEM`时，判断当前系统的主题模式；并且也要监听系统主题模式的变化，当系统主题模式发生变化时，重新判断当前系统的主题模式（浏览器和系统的深色模式都能够检测到）

   ```javascript
   import { THEME_DARK, THEME_LIGHT, THEME_SYSTEM } from '@/constants/index.js'
   import { watch } from 'vue'
   import store from '../store'
   
   /**
    * 初始化监听系统主题变更，单例模式
    */
   let matchMedia
   const watchSystemThemeChange = () => {
     //仅需一次初始化
     if (matchMedia) return
   
     matchMedia = window.matchMedia('(prefers-color-scheme:dark)')
   
     //监听主题变化重新变更主题
     matchMedia.onchange = () => {
       changeTheme(THEME_SYSTEM)
     }
   }
   
   /**
    * 变更主题
    */
   const changeTheme = (theme) => {
     //html的class
     let themeClassName = ''
   
     //判断当前选择的主题模式
     switch (theme) {
       case THEME_LIGHT:
         themeClassName = 'light'
         break
       case THEME_DARK:
         themeClassName = 'dark'
         break
       case THEME_SYSTEM:
         //调用方法，监听系统主题变化
         watchSystemThemeChange()
         themeClassName = matchMedia.matches ? 'dark' : 'light'
         break
     }
   
     //修改html的class
     document.querySelector('html').className = themeClassName
   }
   
   /**
    * 初始化主题
    */
   export default () => {
     //1.当主题发生改变时，或者当进入系统时，可以进行html class的配置
     watch(() => store.getters.themeType, changeTheme, {
       //初始执行一次
       immediate: true
     })
   }
   
   ```

## 9.瀑布流+长列表+懒加载处理方案

### 1.业务组件：构建基础列表展示

1. 在`views/main/components`目录下创建list文件夹并新建`index.vue`和`item.vue`两个组件

2. 在`views/main/index.vue中`对瀑布流列表进行基本布局

   ```vue
   <template>
     <div class="h-full overflow-auto bg-white dark:bg-zinc-800 duration-500">
       <!-- 导航栏组件 -->
       <navigation-vue />
       <div class="max-w-screen-xl mx-auto relative m-1 xl:mt-4">
         <list-vue></list-vue>
       </div>
     </div>
   </template>
   
   <script setup>
   import navigationVue from './components/navigation/index.vue'
   import listVue from './components/list/index.vue'
   </script>
   
   <style scoped lang="scss"></style>
   
   ```

3. 在`/api`目录下封装`pexels.js`图片列表请求

   ```javascript
   import request from '@/utils/mockRequest'
   
   /**
    * 获取图片数据列表
    */
   export const getPexlesList = (data) => {
     return request({
       url: '/pexels/list',
       params: data
     })
   }
   
   ```

4. 使用`mockjs`监听`pexels.js`的`getPexlesList`请求

   1. 异步导入无法同步return数据：

      ```javascript
      import Mock from 'mockjs'
      
      import category from '../../json/category.json'
      
      Mock.mock('/mock/category', category)
      Mock.mock(RegExp('/mock/pexels/list'), 'post', ({ url }) => {
        let pexlesList = []
        /**
         * 获取查询字符串转换为params
         */
        let params = new Map()
        url
          .split('?')[1]
          .split('&')
          .forEach((item) => {
            let queryArr = item.split('=')
            params.set(queryArr[0], queryArr[1])
          })
      
        const getPexlesList = async () => {
          const { data } = await import(
            `../../json/list/page-${params.get('page')}.json`
          )
        }
      })
      
      ```

   2. 用最笨的方法勉强实现：

      ```javascript
      import Mock from 'mockjs'
      import category from '../../json/category.json'
      import pexelsPage01 from '../../json/list/page-1.json'
      import pexelsPage02 from '../../json/list/page-2.json'
      import pexelsPage03 from '../../json/list/page-3.json'
      import pexelsPage04 from '../../json/list/page-4.json'
      import pexelsPage05 from '../../json/list/page-5.json'
      import pexelsPage06 from '../../json/list/page-6.json'
      
      Mock.mock('/mock/category', category)
      Mock.mock(RegExp('/mock/pexels/list'), 'post', ({ url }) => {
        /**
         * 获取查询字符串转换为params
         */
        const params = new Map()
        url
          .split('?')[1]
          .split('&')
          .forEach((item) => {
            let queryArr = item.split('=')
            params.set(queryArr[0], queryArr[1])
          })
      
        // const json = import.meta.glob('../../json/list/*.json')
      
        // for (const [key, fn] of Object.entries(json)) {
        //   let page = key.split('-')[1].split('.')[0]
      
        //   pexelsListData.set(page, fn)
        // }
        const pexelsListData = new Map()
        pexelsListData.set(1, pexelsPage01)
        pexelsListData.set(2, pexelsPage02)
        pexelsListData.set(3, pexelsPage03)
        pexelsListData.set(4, pexelsPage04)
        pexelsListData.set(5, pexelsPage05)
        pexelsListData.set(6, pexelsPage06)
      
        return pexelsListData.get(Number(params.get('page')))
      })
      
      ```

5. 循环渲染`item.vue`组件，并传递`item`数据给子组件

   ```vue
   <template>
     <div>
       <item-vue v-for="item in pexelsList" :key="item.id" :data="item"></item-vue>
     </div>
   </template>
   
   <script setup>
   import { getPexlesList } from '@/api/mock/pexels'
   import itemVue from './item.vue'
   /**
    * 构建数据请求
    */
   let query = {
     page: 1,
     size: 20
   }
   
   const pexelsList = ref([])
   const getPexlesListData = async () => {
     const res = await getPexlesList(query)
     pexelsList.value = res
   }
   getPexlesListData()
   </script>
   
   <style scoped lang="scss"></style>
   
   ```

6. 处理`item.vue`的样式布局

   ```vue
   <template>
     <div
       class="bg-white dark:bg-zinc-900 xl:dark:bg-zinc-800 rounded pb-1 h-[280px] w-[230px]"
     >
       <div class="relative w-full rounded cursor-zoom-in group">
         <!-- 图片 -->
         <img class="w-full rounded bg-transparent" :src="data.photo" />
         <!-- 遮罩层 -->
         <div
           class="hidden opacity-0 w-full h-full bg-zinc-900/50 absolute top-0 left-0 rounded duration-300 group-hover:opacity-100 xl:block"
         >
           <!-- 分享 -->
           <m-button class="absolute top-1.5 left-1.5">分享</m-button>
           <!-- 点赞 -->
           <m-button
             class="absolute top-1.5 right-1.5"
             type="info"
             icon="heart"
             iconClass="fill-zinc-900 dark:fill-zinc-200"
           ></m-button>
           <!-- 下载 -->
           <m-button
             class="absolute bottom-1.5 left-1.5 bg-zinc-100/70"
             type="info"
             icon="download"
             size="small"
             iconClass="fill-zinc-900 dark:fill-zinc-200"
           ></m-button>
   
           <!-- 全屏 -->
           <m-button
             class="absolute bottom-1.5 right-1.5 bg-zinc-100/70"
             type="info"
             icon="full"
             size="small"
             iconClass="fill-zinc-900 dark:fill-zinc-200"
           ></m-button>
         </div>
       </div>
       <!-- 标题 -->
       <p class="text-sm mt-1 font-bold text-zinc-900 dark:text-zinc-300 px-1">
         {{ data.title }}
       </p>
       <!-- 作者 -->
       <div class="flex items-center mt-1 px-1">
         <img class="h-2 w-2 rounded-full" :src="data.avatar" alt="" />
         <spanc class="text-sm text-zinc-500 ml-1">{{ data.author }}</spanc>
       </div>
     </div>
   </template>
   
   <script setup>
   defineProps({
     data: {
       type: Object,
       required: true
     }
   })
   </script>
   
   <style scoped lang="scss"></style>
   
   ```

### 2.通用组件：瀑布流组件构建分析

瀑布流组件`m-waterfall`需要的属性和功能分析：

1. data：数据源

2. nodeKey：循环渲染需要的key值

3. column：渲染的列数

4. picturePreReading：是否需要预加载

5. 由于数据的渲染不再通过遍历`item-vue`本身，而是通过一个插槽`slot`将`item-vue`放入渲染，并且由于`item-vue`组件内部需要数据，所以这个插槽必须是作用域插槽`v-slot="{item,width}"`

   ```vue
       <m-waterfall :data="" :nodeKey="" :column="" :picturePreReading="">
         <template v-slot="{ item, width }">
           <item-vue
             v-for="item in pexelsList"
             :key="item.id"
             :data="item"
           ></item-vue>
         </template>
       </m-waterfall>
   ```

### 3.通用组件：构建瀑布流布局，获取容器宽度与列宽

1. 在`src\libs`目录下新建`waterfall\index.vue`

2. 指定通用组件入参类型：

   ```vue
   <script setup lang="ts">
   const props = defineProps({
     //瀑布流数据源
     data: {
       type: Array,
       required: true
     },
     //唯一标识key
     nodeKey: {
       type: String
     },
     //列数
     colunm: {
       default: 2,
       type: Number
     },
     //列间距
     columnSpacing: {
       default: 20,
       type: Number
     },
     //行间距
     rowSpacing: {
       default: 20,
       type: Number
     },
     //是否需要进行图片预读取
     picturePreReading: {
       type: Boolean,
       default: true
     }
   })
   </script>
   ```

3. 构建模板：`nodeKey`字段用于设置`v-for`遍历时需要使用属性

   ```vue
   <template>
     <div
       class="relative"
       ref="containerTarget"
       :style="{
         height: containerHeight + 'px'
       }"
     >
       <!-- 数据渲染 -->
       <template v-if="columnWidth && data.length">
         <div
           v-for="(item, index) in data"
           :key="nodeKey ? item[nodeKey] : index"
           class="m-waterfall-item absolute duration-300"
           :style="{
             width: columnWidth + 'px',
             left: item._style?.left + 'px',
             top: item._style?.top + 'px'
           }"
         >
           <slot :item="item" :width="columnWidth" :index="index"></slot>
         </div>
       </template>
       <!-- 加载中 -->
       <div v-else>加载中...</div>
     </div>
   </template>
   ```

4. 计算每列的列宽：**根据传入的列数和列间距，获取当前容器的宽度减去左右内边距和列间距之和得到剩余宽度，再将剩余宽度除以列数得到每列（图片）的宽度**

   ```vue
   //容器的总高度 = 最高的这一列高度
   const containerHeight = ref(0)
   //记录每列高度的容器 key:所在列 val:列高
   const columnHeightObj = ref({})
   /**
    * 构建记录每列高度的对象
    */
   const useColumnHeightObj = () => {
     columnHeightObj.value = {}
     for (let i = 0; i < props.column; i++) {
       columnHeightObj.value[i] = 0
     }
   }
   //容器实例
   const containerTarget = ref(null)
   //容器总宽度(不包含padding、margin、border)
   const containerWidth = ref(0)
   //容器的左边距，计算item的left
   const containerLeft = ref(0)
   /**
    * 计算容器宽度
    */
   const useContainerWidth = () => {
     const { paddingLeft, paddingRight } = getComputedStyle(
       containerTarget.value,
       null
     )
     //容器左边距
     containerLeft.value = parseFloat(paddingLeft)
     //容器的宽度
     containerWidth.value =
       containerTarget.value.offsetWidth -
       parseFloat(paddingLeft) -
       parseFloat(paddingRight)
   }
   
   //列宽=(容器的宽度-所有的列间距宽度)/列数
   const columnWidth = ref(0)
   //列间距的合计
   const columnSpacingTotal = computed(() => {
     return (props.column - 1) * props.columnSpacing
   })
   
   /**
    * 计算列宽
    */
   const useColumnWidth = () => {
     //计算容器宽度
     useContainerWidth()
     //计算列宽
     columnWidth.value =
       (containerWidth.value - columnSpacingTotal.value) / props.column
   }
   
   onMounted(() => {
     //计算列宽
     useColumnWidth()
   })
   ```

### 4.通用组件：区分图片预加载，获取元素高度--new Image()图片预加载

想要计算每列的left、right，那么需要拿到每个item的高度，因为只有有了每个item高度，才可以判断下一列的第一个item的位置

同时我们根据`picturePreReading`又可以分为两种情况：

1. 当图片高度未知，需要图片预加载：**使用`new Image()`进行图片预加载，通过图片预加载计算出图片高度即为每一项`item`的高度**

   ```js
   //item高度集合
   let itemHeights = []
   /**
    * 监听图片加载完成（需要图片预加载）
    */
   const waitImgComplate = () => {
     itemHeights = []
     //拿到所有的元素
     let itemElements = [...document.getElementsByClassName('m-waterfall-item')]
     // 获取到元素的img标签
     const imgElements = getImgElements(itemElements)
     //获取所有img标签的图片
     const allImgs = getAllImg(imgElements)
     //等待图片加载完成
     onComplateImgs(allImgs).then(() => {
       //图片加载完成
       itemElements.forEach((el) => {
         itemHeights.push(el.offsetHeight)
       })
       //渲染位置
       useItemLocation()
     })
   }
   ```

   ```js
   /**
    * 从itemElement 中抽离出素有的imgElements
    */
   export const getImgElements = (itemElements) => {
     const imgElements = []
     itemElements.forEach((el) => {
       imgElements.push(...el.getElementsByTagName('img'))
     })
     return imgElements
   }
   /**
    * 生成所有的图片链接数组
    */
   export const getAllImg = (imgElements) => {
     return imgElements.map((imgElement) => {
       return imgElement.src
     })
   }
   /**
    * 监听图片数组加载完成(promise)
    */
   export const onComplateImgs = (imgs) => {
     //promise集合
     const promiseAll = []
     imgs.forEach((img, index) => {
       promiseAll[index] = new Promise((resolve, reject) => {
         //处理img的加载情况
         const imageObj = new Image()
         imageObj.src = img
         imageObj.onload = () => {
           resolve({
             img,
             index
           })
         }
       })
     })
     return Promise.all(promiseAll)
   }
   
   ```

2. 当图片高度已知，不需要图片预加载：

   ```js
   /**
    * 不需要图片预加载
    */
   const useItemHeight = () => {
     itemHeights = []
     //拿到所有的元素
     let itemElements = [...document.getElementsByClassName('m-waterfall-item')]
     // 计算item高度
     itemElements.forEach((el) => {
       itemHeights.push(el.offsetHeight)
     })
     //渲染位置
     useItemLocation()
   }
   
   /**
    * 渲染位置
    */
   const useItemLocation = () => {
     console.log(itemHeights)
   }
   
   /**
    * 触发计算
    */
   watch(
     () => props.data,
     (newVal) => {
       nextTick(() => {
         if (props.picturePreReading) {
           waitImgComplate()
         } else {
           useItemHeight()
         }
       })
     },
     {
       deep: true,
       immediate: true
     }
   )
   ```

### 5.通用组件：瀑布流触发计算，定位item位置

1. 基本原理：通过计算，为传入的data里的每一项（图片）`item`添加一个定位属性`item._style`
2. 定位原理：
   1. 以列为单位，且每一列初始高度为0，每次通过计算找到最小高度的列，将下一个item填入进该列；通过最小高度的列所在列号`index`计算出定位的`left`
   2. 通过获取最小高度的列的高度即为定位的`top`，每一列之间的间距是通过计算控制定位参数来实现的
   3. 在每一次对item的`left、top`值指定完成之后，为该列计算出新的列高，列高需要加上行间距
   4. 在对所有项的`left、top`值计算完成之后，获取最高列的高度即为容器的高度
   5. 在组件卸载时，通过`delete`删除定位属性，并且在每一次data数据更新时，判断每一项数据是否具有`_style`属性，没有则重新构建高度记录容器即重置每一列高度为0

```js
/**
 * 渲染位置
 */
const useItemLocation = () => {
  //遍历数据源
  props.data.forEach((item, index) => {
    //避免重复计算
    if (item._style) {
      return
    }
    //生成style属性
    item._style = {}
    //left
    item._style.left = getItemLeft()
    //top
    item._style.top = getItemTop()
    //指定的列高度的自增
    increasingHeight(index)
  })
  //指定容器的高度
  containerHeight.value = getMaxHeight(columnHeightObj.value)
}

/**
 * 在组件销毁的时候，清除所有的_style
 */
onUnmounted(() => {
  props.data.forEach((item) => {
    delete item._style
  })
})

/**
 * 返回下一个item的left
 */
const getItemLeft = () => {
  //拿到最小宽度的列
  const column = getMinHeightColumn(columnHeightObj.value)
  return (
    column * (columnWidth.value + props.columnSpacing) + containerLeft.value
  )
}
/**
 * 返回下一个item的top
 */
const getItemTop = () => {
  return getMinHeight(columnHeightObj.value)
}

/**
 * 指定列高度自增
 */
const increasingHeight = (index) => {
  //最小高度所在的列
  const minHeightColumn = getMinHeightColumn(columnHeightObj.value)
  //使该列自增
  columnHeightObj.value[minHeightColumn] +=
    itemHeights[index] + props.rowSpacing
}
/**
 * 触发计算
 */
watch(
  () => props.data,
  (newVal) => {
    //第一次获取数据时，构建高度记录容器
    const resetColumnHeight = newVal.every((item) => !item._style)
    if (resetColumnHeight) {
      //构建高度记录容器
      useColumnHeightObj()
    }

    nextTick(() => {
      if (props.picturePreReading) {
        waitImgComplate()
      } else {
        useItemHeight()
      }
    })
  },
  {
    deep: true,
    immediate: true
  }
)
```

```js
/**
 * 返回列高对象中最小的高度作为定位的top值
 */
export const getMinHeight = (columnHeightObj) => {
  const columnHeightArr = Object.values(columnHeightObj)
  return Math.min(...columnHeightArr)
}
/**
 * 返回列高对象中最大的高度作为容器的高度
 */
export const getMaxHeight = (columnHeightObj) => {
  const columnHeightArr = Object.values(columnHeightObj)
  return Math.max(...columnHeightArr)
}

/**
 * 返回列高对象中最小高度所在的列来参与下一项定位的left值计算
 */
export const getMinHeightColumn = (columnHeightObj) => {
  //拿到最小的高度
  const minHeight = getMinHeight(columnHeightObj)
  return Object.keys(columnHeightObj).find((key) => {
    return columnHeightObj[key] === minHeight
  })
}

```

### 6.通用组件：解决瀑布流展示不全的问题

原因：`main-vue`内部的router-view渲染时替换了原本的`main-vue`导致`class="h-main"`失效，解决方案在`main-vue`外面套一层并添加`class="h-main"`

```vue
<div class="h-main">
     <main-vue></main-vue>
</div>
```

### 7.通用组件：瀑布流适配移动端，动态列

1. 导入并使用`src\utils\flexible.js`中的`isMobileTerminal`方法进行视口判断

2. 根据`isMobileTerminal`的返回值动态控制`column`

   ```vue
   <template>
     <div>
       <m-waterfall
         class="px-1 w-full"
         :data="pexelsList"
         nodeKey="id"
         :column="isMobileTerminal ? 2 : 5"
         :picturePreReading="true"
       >
         <template v-slot="{ item, width }">
           <item-vue :data="item"></item-vue>
         </template>
       </m-waterfall>
     </div>
   </template>
   ```

3. 响应式动态列：**通过`watch`监听列数的变化，当列数发生变化时，重新计算列宽并清空`item._style`属性使页面重新计算渲染视图**

   ```javascript
   /**
    * 重新构建瀑布流
    */
   const reset = () => {
     setTimeout(() => {
       //重新计算列宽
       useColumnWidth()
       //重置所有的定位数据
       props.data.forEach((item) => {
         item._style = null
       })
     }, 100)
   }
   /**
    * 监听列数的变化
    */
   watch(
     () => props.column,
     () => {
       columnWidth.value = 0
       //数据改变之后，视图改变之后的回调
       nextTick(() => {
         reset()
       })
     }
   )
   ```


### 8.通用组件：瀑布流无需图片预加载时，优化功能处理

当不使用图片预加载时，我们可以利用服务端返回的图片宽高数据来指定每个`item`的大小，从而优化图片展示：

1. 为`item-vue`传入计算出的`width`

   ```vue
   <template v-slot="{ item, width }">
           <item-vue :data="item" :width="width"></item-vue>
         </template>
   ```

2. `item-vue`中接收`width`属性

   ```vue
   <script setup>
   defineProps({
     data: {
       type: Object,
       required: true
     },
     width: {
       type: Number
     }
   })
   </script>
   ```

3. 根据`width`属性计算出缩放比从而计算出图片高度

   ```vue
     <img
           class="w-full rounded bg-transparent"
           :src="data.photo"
           :style="{
             height: (width / data.photoWidth) * data.photoHeight + 'px'
           }"
         />
   ```

4. 优化切换动画

   ```vue
   /**
    * 监听列数的变化
    */
   watch(
     () => props.column,
     () => {
       if (props.picturePreReading) {
         columnWidth.value = 0
         //数据改变之后，视图改变之后的回调
         nextTick(() => {
           reset()
         })
       } else {
         reset()
       }
     }
   )
   ```

### 9.通用组件：瀑布流总结

瀑布流是一个比较复杂的通用组件，因为我们要尽量做到普适，所以就需要考虑到各种场景下的处理方案，尽量可以满足日常开发的场景，下面是整个瀑布流的构建过程：

1. 瀑布流的核心就是：通过relative和absolute定位的方式，来控制每个item的位置
2. 影响瀑布流高度的主要元素，通常都是img标签
3. 有些服务端会返回关键img的高度，有些不会，所以我们需要分别处理：
   1. 当服务端不返回高度时：我们需要等待img加载完成之后，再来计算高度，然后通过得到的高度计算定位，否则会出现高度计算不准确导致定位计算不准确的问题
   2. 当服务端返回高度时：开发者则必须利用此高度为item进行高度设定，一旦item具备指定高度，那么我们就不需要等待img加载的过程，这样效率更高，并且可以让业务的逻辑会变得更加简单
4. 当进行响应式切换时，同样需要区分对应场景：
   1. 当服务端不返回高度时：我们需要重新执行整个渲染流程，虽然会耗费一些性能，但是这样可以最大可能的避免出现逻辑错误，让组件拥有更强的普适性
   2. 当服务端返回高度时：我们同样需要重新计算列宽和定位，但是因为item具备明确的高度，所以我们可以直接拿到具体的高度，而无需重复整个渲染流程，从而实现更多的交互逻辑，比如：位移动画、将来的图片懒加载占位...

### 10.通用组件：长列表infinite构建分析

我们知道对于首页中的瀑布流而言，是需要进行长列表展示的，也就是说它是一个分页的数据

长列表的实现原理：

1. 所谓长列表分页加载，其实指的是：当滚动到列表底部时，加载数据
2. 想要实现这个功能：核心的一点就是能够监听到列表滚动到底部，我们可以利用`IntersectionObserver`，改接口可以判断：目标元素与其祖先元素或顶级文档视窗（`viewport`）的交叉状态（是否可见）
3. 我们可以利用这个特性，把一个元素置于列表底部，当这个元素可见时则表示列表滚动到了底部；由于原生的`IntersectionObserver`使用起来比较复杂，所以`vueuse`提供了`useIntersectionObserver`方法

### 11.通用组件：构建长列表infinite组件

1. 创建`src/libs/infinite/index.vue`组件

2. 构建`props`和`emits`，并处理双向数据绑定逻辑

3. 构建对应视图与插槽逻辑

   ```vue
   <script setup>
   import { useVModel, useIntersectionObserver } from '@vueuse/core'
   const props = defineProps({
     //是否处于加载状态
     modelValue: {
       type: Boolean,
       required: true
     },
     //数据是否加载完成
     isFinished: {
       type: Boolean,
       default: false
     }
   })
   
   const emits = defineEmits(['onLoad', 'update:modelValue'])
   
   //处理loading状态
   const loading = useVModel(props)
   
   //滚动的元素
   const loadingTarget = ref(null)
   useIntersectionObserver(loadingTarget, ([{ isIntersecting }]) => {
     //当加载更多的视图可见时，同时loading为false，同时数据尚未全部加载完 才处理加载更多的逻辑
     if (isIntersecting && !loading.value && !props.isFinished) {
       //修改加载数据标记
       loading.value = true
       //触发加载更多的行为
       emits('onLoad')
     }
   })
   </script>
   
   <template>
     <div>
       <!-- 内容 -->
       <slot> </slot>
       <div ref="loadingTarget" class="h-6 py-4">
         <!-- 加载更多 -->
         <m-svg-icon
           v-show="loading"
           class="w-4 h-4 mx-auto animate-spin"
           name="infinite-load"
         ></m-svg-icon>
         <!-- 没有更多数据 -->
         <p v-if="isFinished" class="text-center text-base text-zinc-400">
           已经没有更多数据了
         </p>
       </div>
     </div>
   </template>
   
   <style scoped lang="scss"></style>
   ```

### 12.通用组件：应用infinite结合waterfall实现--useIntersectionObserver

核心原理：

1. 定义标志物，当视窗滚动到该标志物时进行判断并触发回调通知父组件获取新的数据

2. 判断数据是否加载完毕，如果加载完毕则因此loading图标并禁用`useIntersectionObserver`回调

3. 使用`useVModel`将props转化为响应式数据，并使我们无需再手动触发`emits`更新数据

   ```vue
   <template>
     <div>
       <m-infinite
         v-model="loading"
         :isFinished="isFinished"
         @onLoad="getPexlesListData"
       >
         <m-waterfall
           class="px-1 w-full"
           :data="pexelsList"
           nodeKey="id"
           :column="isMobileTerminal ? 2 : 5"
           :picturePreReading="false"
         >
           <template v-slot="{ item, width }">
             <item-vue :data="item" :width="width"></item-vue>
           </template>
         </m-waterfall>
       </m-infinite>
     </div>
   </template>
   
   <script setup>
   import { getPexlesList } from '@/api/mock/pexels'
   import itemVue from './item.vue'
   import { ref } from 'vue'
   import { isMobileTerminal } from '@/utils/flexible'
   /**
    * 构建数据请求
    */
   let query = {
     page: 1,
     size: 20
   }
   //数据是否在加载中
   const loading = ref(false)
   //数据是否全部加载完成
   const isFinished = ref(false)
   //数据源
   const pexelsList = ref([])
   /**
    * 加载数据的方法
    */
   const getPexlesListData = async () => {
     //数据全部加载完成 return
     if (isFinished.value) {
       return
     }
     // 完成了第一次请求之后，后续的请求让page自增
     if (pexelsList.value.length) {
       query.page += 1
     }
     const res = await getPexlesList(query)
     if (query.page === 1) {
       pexelsList.value = res.list
     } else {
       pexelsList.value.push(...res.list)
     }
     pexelsList.value.push(...res.list)
     //判断数据是否全部加载完成
     if (pexelsList.value.length === res.total) {
       isFinished.value = true
     }
     //修改loading标记
     loading.value = false
   }
   </script>
   
   <style scoped lang="scss"></style>
   
   ```

### 13.通用组件：解决首次数据无法铺满全屏时，数据无法继续加载

第一个问题原因：**我们是通过判断标志物是否可见来进行数据的下一次加载，而当首次加载时如果数据较少，则后面的数据无法继续加载**

解决方法：**由于视图标志物出现在视窗时，`isIntersecting`恒为`true`，我们可以通过监听`loading`的变化多次触发` emits('onLoad')`来获取数据来填满当前视窗从而解决这个问题**

第二个问题原因：**当页面首次加载时，会触发一次`useIntersectionObserver`的回调获取数据，同时会修改`loading`值触发`watch`监听的回调，由于此时页面未来得及渲染更新导致`targetIsIntersecting.value`仍为`true`从而再获取一次数据**

解决方法：**通过衡量性能和可读性和逻辑的简易性，我们可以使用`setTimeout`来解决；注意使用nextTick并不能解决**

```js
const targetIsIntersecting = ref(false)

useIntersectionObserver(loadingTarget, ([{ isIntersecting }]) => {
  //标志物显示则isIntersecting为true
  targetIsIntersecting.value = isIntersecting
  emitLoad()
})

/**
 * 触发load事件
 */
const emitLoad = () => {
  setTimeout(() => {
    //当加载更多的视图可见时，同时loading为false，同时数据尚未全部加载完 才处理加载更多的逻辑
    if (targetIsIntersecting.value && !loading.value && !props.isFinished) {
      //修改加载数据标记
      loading.value = true
      //触发加载更多的行为
      emits('onLoad')
    }
  }, 100)
}
/**
 * 监听loading的变化,解决数据加载完成之后，首屏未铺满的问题
 */
watch(loading, emitLoad)
```

### 14.通用指令：实现图片懒加载--v-lazy

图片懒加载：**当图片出现在视窗中时，再加载渲染图片，而不是一次全部渲染完**

1. 在`src\directives`目录下新建`modules/lazy.js`

   ```js
   import { useIntersectionObserver } from '@vueuse/core'
   export default {
     //图片懒加载：在用户无法看到图片时，不加载图片，用户可以看到图片时再去加载图片
     mounted(el) {
       //1.拿到当前img的src
       const imgSrc = el.src
       //2.把src变为空
       el.src = ''
       const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
         if (isIntersecting) {
           //3.当图片可见时，加载图片
           el.src = imgSrc
           //4.停止监听
           stop()
         }
       })
     }
   }
   
   ```

2. 在`src\directives\index.js`导入`lazy.js`并导出一个对象以插件的形式全局注册该指令

   ```js
   import lazy from './modules/lazy'
   
   /**
    * 全局注册指令
    */
   export default {
     install(app) {
       app.directive('lazy', lazy)
     }
   }
   
   
   import mdirectives from '@/directives/index'
   createApp(App).use(router).use(store).use(mLibs).use(mdirectives).mount('#app')
   ```

### 15.深入vite：指令的自动注册

使用vite提供的Glob 导入（import.meta.globEager）和Object.entries实现指令的自动注册

`import.meta.glob`为异步加载，之前组件的注册采用此方式，而指令的全局注册使用`import.meta.globEager`来同步加载，目前官方推荐这样使用`const modules = import.meta.glob('./dir/*.js', { eager: true })`

```js
/**
 * 全局注册指令
 */
export default {
  install(app) {
    const directives = import.meta.globEager('./modules/*.js')
    for (const [key, value] of Object.entries(directives)) {
      const arr = key.split('/')
      const name = arr[arr.length - 1].replace('.js', '')
      app.directive(name, value.default)
    }
  }
}
```

### 16.指定彩色占位图--工具方法randomRGB

当图片还未渲染出来之前，使用彩色占位图占位：

1. 在`src\utils\color.js`定义生成随机色的方法

   ```js
   /**
    * 生成随机色值
    */
   export const randomRGB = () => {
     const r = Math.floor(Math.random() * 256)
     const g = Math.floor(Math.random() * 256)
     const b = Math.floor(Math.random() * 256)
     return `rgb(${r},${g},${b})`
   }
   
   ```

2. 在`src\views\main\components\list\item.vue`导入并使用`randomRGB`方法

   ```vue
    <div
         class="relative w-full rounded cursor-zoom-in group"
         :style="{
           backgroundColor: randomRGB()
         }"
       >
   ```

## 10.多组件联动解决方案

### 1.多组件联动注意事项与整体逻辑分析

1. 在我们的实际开发中，我们经常与遇到多个组件互相进行联动的场景，所谓的多组件联动，通常指的是：**多个组件之间，存在一个或多个共享的数据，当数据发生改变时，执行对应的逻辑**

2. 多组件之间共享数据，通常有三种方式：
   1. 组件之间的数据传递，常见于层级关系比较清晰的多组件之中
   2. 依赖注入：Provide/Inject，嵌套层级比较深，并且子组件只需要父组件的部分内容
   3. 全局状态管理工具：vuex、pinia，以上两种情况都不适用的情况下

3. 针对于层级关系比较复杂，并且需要进行复杂的逻辑操作，那么此时多组件之间共享数据的策略就需要通过vuex来实现

4. 监听数据变化的方式：当组件之间共享的数据发生变化时，我们需要执行对应的逻辑操作，而在vue中监听数据变化的方式，首推就是watch，并且在刚才我们已经确定了共享的数据需要被保存到vuex中，所以我们就需要通过watch监听到vuex中共享数据的变化，然后在监听到变化时，执行对应的业务逻辑
5. 整体逻辑分析：
   1. 创建共享数据对应的vuex模块
   2. 在getters中建立对应的快捷访问计算属性
   3. 在对应的业务组件中，监听getters，并执行对应逻辑

### 2.简单联动处理：navigationBar对应list

1. 在`src\store\modules\app.js`保存选中的分类数据`currentCategory`

   ```js
   import { ALL_CATEGORY_ITEM } from '@/constants'
   /**
    * app模块中的数据不会被缓存
    */
   export default {
     namespaced: true,
     state: () => {
       return {
         //当前选中的分类
         currentCategory: ALL_CATEGORY_ITEM
       }
     },
     mutations: {
       /**
        * 切换选中分类
        */
       changeCurrentCategory(state, newCategory) {
         state.currentCategory = newCategory
       }
     },
     actions: {}
   }
   ```

2. 通过`src\store\getters.js`计算获取`currentCategory`和`currentCategoryIndex`

   ```js
   export default {
     //简单访问
     categorys: (state) => state.category.categorys,
     //当前主题
     themeType: (state) => state.theme.themeType,
     //category选中项
     currentCategory: (state) => state.app.currentCategory,
     //category选中项的下标
     currentCategoryIndex: (state, getters) => {
       return getters.categorys.findIndex((item) => {
         return item.id === getters.currentCategory.id
       })
     }
   }
   ```

3. 分别在`src\views\main\components\navigation\pc\index.vue`、`src\views\main\components\navigation\mobile\index.vue`和`src\views\main\components\list\index.vue`建立`navigationBar`和`list`组件的对应关系，并通过添加`categoryId`字段获取不同分类列表的数据

   ```js
   /**
    * 选中状态
    */
   // const currentCategoryIndex = ref(0)
   const onItemClick = (item) => {
     // currentCategoryIndex.value = index
     store.commit('app/changeCurrentCategory', item)
   }
   ```

   ```js
   // wacth监听getters的时候，我们需要传递一个函数
   watch(
     () => store.getters.currentCategoryIndex,
     (val) => {
       //获取元素的信息
       let { left, width } = itemRefs[val].getBoundingClientRect()
       sliderStyle.value = {
         // 滑块的位置=ul横向滚动的位置+当前元素的偏移-ul的padding
         // transform: `translateX(${ulScrollLeft.value + left - 10}px)`,
         //使用原生offsetLeft完美解决点击按钮滚动条滚动的问题
         transform: `translateX(${itemRefs[val].offsetLeft - 10}px)`,
         width: width + 'px'
       }
     }
   )
   
   //item点击事件
   const onItemClick = (item) => {
     store.commit('app/changeCurrentCategory', item)
   }
   ```

   ```js
   /**
    * 通过此方法修改query，重新发起请求
    */
   const resetQuery = (newQuery) => {
     query = { ...query, ...newQuery }
     //重置状态
     isFinished.value = false
     //当数据源变为空时，页面重新渲染，重新执行useIntersectionObserver获取数据
     pexelsList.value = []
   }
   /**
    * 监听currentCategory的变化
    */
   watch(
     () => store.getters.currentCategory,
     (currentCategory) => {
       resetQuery({
         page: 1,
         categoryId: currentCategory.categoryId
       })
     }
   )
   ```

### 3.明确searchBar对应list处理流程

1. 对于searBar区域目前还缺少三部分的内容处理：
   1. 搜索提示
   2. 搜索历史
   3. 推荐主题
2. 所以我们接下来的处理顺序为：
   1. 搜索提示
   2. 搜索历史
   3. 推荐主题
   4. search触发时的list联动

### 4.searchBar：搜索提示初步实现

1. 在`src\api\mock\pexels.js`新建获取搜索提示接口

   ```js
   /**
    * 获取搜索提示
    * q参数为搜索内容
    */
   export const getHint = (q) => {
     return request({
       url: '/pexels/hint',
       params: {
         q
       },
       method: 'get'
     })
   }
   ```

2. 在`src\views\layout\components\header\header-search\index.vue`中导入组件`hintVue`并使用：通过将双向数据绑定的`inputValue`传入，并使用`v-show`判断`inputValue`值动态展示`hintVue`组件

   ```vue
   <template>
     <div class="w-full">
       <m-search v-model:modelValue="inputValue">
         <template #dropdown>
           <div>
             <!-- 搜索提示 -->
             <hint-vue
               :searchText="inputValue"
               v-show="inputValue"
               @itemClick="onSearchHandler"
             ></hint-vue>
           </div>
         </template>
       </m-search>
     </div>
   </template>
   
   <script setup>
   import { ref } from 'vue'
   import hintVue from './hint.vue'
   const inputValue = ref('')
   
   /**
    * 点击建议列表触发搜索回调
    */
   const onSearchHandler = (val) => {
     inputValue.value = val
   }
   </script>
   
   <style scoped lang="scss"></style>
   
   ```

3. 在`src\views\layout\components\header\header-search\hint.vue`中进行数据获取和渲染

   1. **通过`props`接收传入的`inputValue`值，并监听`props.searchText`的变化重新发起网络请求渲染页面**

   2. 点击建议列表进行搜索并动态改变输入框的值：**为每一个item绑定点击事件，并在点击事件回调中向上触发一个自定义事件将item值传入，而在父组件中获得到item值之和修改`inputValue`的值**

      ```vue
      <script>
      const EMITS_ITEM_CLICK = 'itemClick'
      </script>
      <script setup>
      import { ref, watch } from 'vue'
      import { getHint } from '@/api/mock/pexels.js'
      const props = defineProps({
        /**
         * 搜索文本
         */
        searchText: {
          type: String,
          required: true
        }
      })
      const emits = defineEmits(['EMITS_ITEM_CLICK'])
      
      /**
       * 处理搜索提示数据获取
       */
      const hintData = ref([])
      const getHintData = async () => {
        if (!props.searchText) return
        const { result } = await getHint(props.searchText)
        hintData.value = result
      }
      /**
       * watch可以监听一个ref响应式数据，或者一个包含getter的函数
       * 通过函数return props.searchText实现监听
       */
      watch(() => props.searchText, getHintData, {
        immediate: true
      })
      
      /**
       * item点击事件处理
       */
      const onItemClick = (item) => {
        emits(EMITS_ITEM_CLICK, item)
      }
      </script>
      
      <template>
        <div>
          <div
            v-for="(item, index) in hintData"
            :key="index"
            class="py-1 pl-1 text-base font-bold text-zinc-500 rounded cursor-pointer duration-300 hover:bg-zinc-200 dark:hover:bg-zinc-900"
            @click="onItemClick(item)"
          >
            {{ item }}
          </div>
        </div>
      </template>
      
      <style scoped lang="scss"></style>
      ```

### 5.searchBar：处理输入框防抖功能--vueuse-watchDebounced

我们可以利用vueuse提供的`watchDebounced`来实现防抖的watch

```js
/**
 * watch可以监听一个ref响应式数据，或者一个包含getter的函数
 * 通过函数return props.searchText实现监听
 */
watchDebounced(() => props.searchText, getHintData, {
  immediate: true,
  //每次事件触发时，延迟的时间
  debounce: 500
})
```

### 6.searchBar：提示关键字高亮处理

核心原理： **通过获取用户输入的文本生成正则表达式和高亮标签，再对显示的文本进行正则替换，最后使用`v-html`渲染**

```vue
/**
 * 处理关键字高亮
 */
const hightlightText = (text) => {
  //生成高亮标签
  const hightlightStr = `<span class="text-zinc-900 dark:text-zinc-200">${props.searchText}</span>`
  //正则表达式：从显示的文本中找出与用户输入文本相同的内容，使用高亮标签进行替换
  const reg = new RegExp(props.searchText, 'gi')
  //把匹配到的部分用标签替换
  return text.replace(reg, hightlightStr)
}
</script>

<template>
  <div>
    <div
      v-for="(item, index) in hintData"
      :key="index"
      class="py-1 pl-1 text-base font-bold text-zinc-500 rounded cursor-pointer duration-300 hover:bg-zinc-200 dark:hover:bg-zinc-900"
      v-html="hightlightText(item)"
      @click="onItemClick(item)"
    ></div>
  </div>
</template>
```

### 7.searchBar：搜索历史处理

1. 使用vuex在`src\store\modules\search.js`保存搜索历史

   ```js
   /**
    * 搜索
    */
   export default {
     namespaced: true,
     state: () => {
       return {
         historys: []
       }
     },
     mutations: {
       /**
        * 新增
        * 1. 新增的历史记录位于头部
        * 2. 不可出现重复记录
        */
       addHistory(state, newHistory) {
         const isFindIndex = state.historys.findIndex(
           (item) => item === newHistory
         )
         //剔除旧数据
         if (isFindIndex !== -1) {
           state.historys.splice(isFindIndex, 1)
         }
         //新增记录
         state.historys.unshift(newHistory)
       },
       /**
        * 单个删除
        */
       deleteHistory(state, index) {
         state.historys.splice(index, 1)
       },
       /**
        * 全部删除
        */
       deleteAllHistory(state) {
         // state.historys.length = 0
         state.historys = []
       }
     },
     actions: {}
   }
   
   ```

2. 使用vuex进行搜索历史持久化存储

   ```js
   import { createStore } from 'vuex'
   import createPersistedState from 'vuex-persistedstate'
   import getters from './getters.js'
   import category from './modules/category.js'
   import theme from './modules/theme.js'
   import app from './modules/app.js'
   import search from './modules/search.js'
   
   export const store = createStore({
     getters,
     modules: {
       category,
       theme,
       app,
       search
     },
     plugins: [
       createPersistedState({
         //指定保存到localStorage中的key值
         key: 'imooc-front',
         //需要保存的模块
         paths: ['category', 'theme', 'search']
       })
     ]
   })
   export default store
   
   ```

3. 新建`src\views\layout\components\header\header-search\history.vue`组件处理搜索历史的删除

   ```vue
   <script>
   const EMITS_ITEM_CLICK = 'itemClick'
   </script>
   
   <script setup>
   import { useStore } from 'vuex'
   const store = useStore()
   
   const emits = defineEmits(['EMITS_ITEM_CLICK'])
   /**
    * 删除全部
    */
   const onDeleteAllClick = () => {
     store.commit('search/deleteAllHistory')
   }
   
   /**
    * 单个删除
    */
   const onDeleteClick = (index) => {
     store.commit('search/deleteHistory', index)
   }
   
   /**
    * 触发搜索
    */
   const onItemClick = (item) => {
     emits(EMITS_ITEM_CLICK, item)
   }
   </script>
   
   <template>
     <div>
       <div class="flex items-center text-xs mb-1 text-zinc-400">
         <span>最近搜索</span>
         <m-svg-icon
           name="delete"
           class="w-2.5 h-2.5 ml-1 p-0.5 cursor-pointer duration-300 rounded-sm hover:bg-zinc-100"
           fillClass="fill-zinc-400"
           @click="onDeleteAllClick"
         ></m-svg-icon>
       </div>
       <div class="flex flex-wrap">
         <div
           v-for="(item, index) in $store.getters.historys"
           :key="index"
           class="mr-2 mb-1.5 flex items-center cursor-pointer bg-zinc-100 px-1.5 py-0.5 text-zinc-900 text-sm font-bold rounded-sm duration-300 hover:bg-zinc-200"
         >
           <span @click="onItemClick(item)">{{ item }}</span>
           <m-svg-icon
             name="input-delete"
             class="w-2.5 h-2.5 p-0.5 ml-1 duration-300 rounded-sm hover:bg-zinc-100"
             @click.stop="onDeleteClick(index)"
           ></m-svg-icon>
         </div>
       </div>
     </div>
   </template>
   
   <style scoped lang="scss"></style>
   
   ```

4. 在`src\views\layout\components\header\header-search\index.vue`中使用`v-show`动态展示`history.vue`组件并通过触发自定义事件来新增搜索历史

   ```vue
   <template>
     <div class="w-full">
       <m-search v-model:modelValue="inputValue" @search="onSearchHandler">
         <template #dropdown>
           <div>
             <!-- 搜索提示 -->
             <hint-vue
               :searchText="inputValue"
               v-show="inputValue"
               @itemClick="onSearchHandler"
             ></hint-vue>
             <!-- 最近搜索 -->
             <history-vue
               v-show="!inputValue"
               @itemClick="onSearchHandler"
             ></history-vue>
           </div>
         </template>
       </m-search>
     </div>
   </template>
   
   <script setup>
   import { ref } from 'vue'
   import { useStore } from 'vuex'
   import hintVue from './hint.vue'
   import historyVue from './history.vue'
   const inputValue = ref('')
   const store = useStore()
   /**
    * 点击建议列表触发搜索回调
    */
   const onSearchHandler = (val) => {
     inputValue.value = val
     if (val) {
       store.commit('search/addHistory', val)
     }
   }
   </script>
   
   <style scoped lang="scss"></style>
   
   ```

### 8.通用组件：vnode+h函数+render函数明确confirm构建思路

对于confirm这种提示框组件而言，我们不希望它通过标签的形式进行使用，而是期望可以像element-plus中的confirm一样，可以直接通过方法的形式来进行调用

想要搞明白这一点，我们需要了解一些比较冷僻的知识点，那就是渲染函数，在渲染函数中，我们需要了解如下概念：

1. 虚拟dom：通过js来描述dom，虚拟dom中的节点就是vnode
2. vnode虚拟节点：告诉vue页面上需要渲染什么样的节点
3. h函数：用来创建vnode的函数，接收三个参数（要渲染的dom，attrs对象，子元素）
4. render函数：可以根据vnode来渲染dom

根据以上所说我们知道：通过h函数可以生成一个vnode，该vnode可以通过render函数被渲染

所以据此我们就可以得出confirm组件的实现思路：

1. 创建一个confirm组件
2. 创建一个confir.js模块，在该模块中返回一个promise
3. 同时利用h函数生成confirm.vue的vnode
4. 最后利用render函数，渲染vnode到body中

### 9.通用组件：构建confirm组件

1. 在`src\libs\confirm\index.vue`创建confirm组件并定义`props`
2. 由于confirm组件最终是通过方法形式来调用，所以不能直接全局注册的组件，必须导入才能使用（需要把页面需要的全部dom结构获取生成vnode）
3. 在组件展示初次展示时，需要执行展示动画，我们在`onMounted`生命周期函数中执行`show()`函数来展示从而执行展示动画，或者在`transition`组件中添加`appear`属性和对应动画执行展示；在关闭confirm组件时，需要延迟执行关闭回调，目的是等待`v-if`隐藏动画执行完毕再执行关闭回调`render(null, document.body)`卸载 dom结构
4. 在对定时器时间进行设置时，我们使用`const duration = '0.5s'`的形式目的在于**通过`v-bind` CSS 函数将 CSS 的值链接到动态的组件状态**

### 10.通用组件：函数调用confirm组件

1. 新建`src\libs\confirm\index.js`通过函数来创建confirm组件：

   1. 通过`promise`创建一个异步任务挂起，并在`history.vue`组件中当删除全部搜索历史时触发`then`和`catch`回调

      ```js
      /**
       * 删除全部
       */
      const onDeleteAllClick = () => {
        confirm('标题', '你要删除所有记录吗', '取消', '确定')
          .then(() => {
            store.commit('search/deleteAllHistory')
          })
          .catch(() => {
            // console.log('点击了取消')
          })
      }
      ```

   2. 使用`h()`函数生成vnode，再使用`render`函数渲染到`body`中，最后在关闭时，再次通过`render`函数卸载`dom`结构

      ```js
      import { h, render } from 'vue'
      import confirmComponent from './index.vue'
      
      /**
       * 展示confirm，用户只传递一个参数，那么这个参数为content
       * @param {*} title 标题（如果用户没有传递内容，那么标题被作为内容）
       * @param {*} content 内容（如果没有title，那么content会被作为第一个参数传入）
       * @param {*} cancelText 取消按钮文本
       * @param {*} confirmText 确定按钮文本
       */
      export const confirm = (title, content, cancelText, confirmText) => {
        return new Promise((resolve, reject) => {
          if (title && !content) {
            content = title
            title = ''
          }
          /**
           * 关闭的回调
           */
          const close = () => {
            //3.把渲染的vnode卸载掉
            render(null, document.body)
          }
          /**
           * 取消按钮的回调
           */
          const cancelHandler = () => {
            //reject执行.catch中的回调
            reject(new Error('取消按钮点击'))
          }
          /**
           * 确定按钮的回调
           */
          const confirmHandler = () => {
            //resolve执行.then中的回调
            resolve()
          }
          //1.生成vnode（type,prop,slot)
          const vnode = h(confirmComponent, {
            title,
            content,
            cancelText,
            confirmText,
            //传入到confirm组件执行
            close,
            cancelHandler,
            confirmHandler
          })
          //2.render渲染
          render(vnode, document.body)
        })
      }
      ```

2. 在`src\libs\index.js`导入并导出`confirm`函数

   ```js
   import { defineAsyncComponent } from 'vue'
   export { confirm } from './confirm/index
   ```

### 11.seachBar：热门精选模块构建

1. 将`themeData`数据拆分为`big`和`list`

2. 使用`tailwind`提供的`backdrop-blur `和`hover:backdrop-blur-none`动态展示毛玻璃效果

3. 使用`v-lazy`指令实现图片懒加载，使用工具方法`randomRGB`生成背景进行占位

   ```vue
   <script setup>
   import { ref } from 'vue'
   import { getThemes } from '@/api/mock/pexels'
   import { randomRGB } from '@/utils/color.js'
   
   const themeData = ref({
     big: {},
     list: []
   })
   /**
    * 获取themes数据
    */
   const getThemeData = async () => {
     const { themes } = await getThemes()
     // themeData.value.big = themes[0]
     // themeData.value.list = themes.slice(1, themes.length)
     themeData.value = {
       big: themes[0],
       list: themes.slice(1, themes.length)
     }
   }
   getThemeData()
   </script>
   
   <template>
     <div>
       <div class="text-xs mb-1 text-zinc-400">热门精选</div>
       <div class="flex h-[140px]" v-if="themeData.list.length">
         <!-- 大图 -->
         <div
           class="relative rounded w-[260px] cursor-pointer"
           :style="{
             backgroundColor: randomRGB()
           }"
         >
           <img
             v-lazy
             class="h-full w-full object-cover rounded"
             :src="themeData.big.photo"
             alt=""
           />
           <p
             class="absolute bottom-0 left-0 w-full h-[45%] flex items-center backdrop-blur rounded px-1 text-white duration-300 hover:backdrop-blur-none"
           >
             #{{ themeData.big.title }}
           </p>
         </div>
         <!-- 小图 -->
         <div class="flex flex-wrap flex-1 max-w-[860px]">
           <div
             v-for="item in themeData.list"
             :key="item.id"
             class="h-[45%] w-[260px] text-white text-xs relative ml-1.5 mb-1.5 rounded"
             :style="{
               backgroundColor: randomRGB()
             }"
           >
             <img
               v-lazy
               class="w-full h-full object-cover rounded"
               :src="item.photo"
               alt=""
             />
             <p
               class="backdrop-blur absolute top-0 left-0 w-full h-full flex items-center px-1 rounded cursor-pointer duration-300 hover:backdrop-blur-none"
             >
               #{{ item.title }}
             </p>
           </div>
         </div>
       </div>
     </div>
   </template>
   
   <style scoped lang="scss"></style>
   
   ```

### 12.searchBar联动list

1. 在`src\store\modules\app.js`添加`searchText`属性和对应的修改方法`changeSearchText`

   ```js
   import { ALL_CATEGORY_ITEM } from '@/constants'
   /**
    * app模块中的数据不会被缓存
    */
   export default {
     namespaced: true,
     state: () => {
       return {
         //当前选中的分类
         currentCategory: ALL_CATEGORY_ITEM,
         //搜索的文本
         searchText: ''
       }
     },
     mutations: {
       /**
        * 切换选中分类
        */
       changeCurrentCategory(state, newCategory) {
         state.currentCategory = newCategory
       },
       /**
        * 修改searchText
        */
       changeSearchText(state, newSearchText) {
         state.searchText = newSearchText
       }
     },
     actions: {}
   }
   
   ```

2. 在`src\store\getters.js`简化`searchText`的获取

   ```js
   //搜索文本
     searchText: (state) => state.search.searchText
   ```

3. 在`src\views\layout\components\header\header-search\index.vue`中当触发搜索时修改`searchText`

   ```vue
   /**
    * 触发搜索回调
    */
   const onSearchHandler = (val) => {
     inputValue.value = val
     if (val) {
       store.commit('search/addHistory', val)
       //触发searchText变化
       store.commit('app/changeSearchText', val)
     }
   }
   ```

4. 最后在`src\views\main\components\list\index.vue`中监听`store.getters.searchText`重新发起请求获取数据

   ```vue
   watch(
     () => store.getters.searchText,
     (currentSearchText) => {
       resetQuery({
         page: 1,
         searchText: currentSearchText
       })
     }
   )
   ```

## 11.前台常见功能解决方案：下载+全屏+引导

### 1.文件下载解决方案--file-saver.js

目前常用的支持下载的功能包有两个：

1. 小文件下载：`file-saver`
2. 大文件下载：`streamsaver`

由于我们的图片属于小文件的下载，所以我们可以直接使用`file-saver`

1. 使用npm安装`file-saver`：`npm i --save file-saver`

2. 导入并使用`file-saver`

   ```js
   import { saveAs } from 'file-saver'
   
   /**
    * 下载按钮点击事件
    */
   const onDownload = () => {
     /**
      * 1.下载的图片链接
      * 2.重命名文件
      */
     saveAs(props.data.photoDownLink)
   }
   ```


### 2.通用组件：构建方法触发的message组件

1. 首先我们需要构建一个对应的`message.vue`

   1. 构建组件所需要的`props`

   2. 定义常量构建不同类型下的样式表

   3. 定义动画，并通过`isVisable`控制组件的动态展示来加载动画

      ```vue
      <script>
      const SUCCESS = 'success'
      const WARN = 'warn'
      const ERROR = 'error'
      
      const typeEnum = [SUCCESS, WARN, ERROR]
      </script>
      <script setup>
      import { ref, onMounted } from 'vue'
      import mSvgIcon from '../svg-icon/index.vue'
      
      const props = defineProps({
        /**
         * message的消息类型
         */
        type: {
          type: String,
          required: true,
          validator(val) {
            const result = typeEnum.includes(val)
            if (!result) {
              throw new Error(`你的type必须是${typeEnum.join('、')}中的一个`)
            }
          }
        },
        //描述文本
        content: {
          type: String,
          required: true
        },
        //展示时长
        duration: {
          type: Number
        },
        //关闭的回调
        destroy: {
          type: Function
        }
      })
      /**
       * 样式表数据
       */
      const styles = {
        //警告
        warn: {
          icon: 'warn',
          fillClass: 'fill-warn-300',
          textClass: 'text-warn-300',
          containerClass:
            'bg-warn-100 border-warn-200 hover:shadow-lg hover:shadow-warn-100'
        },
        //错误
        error: {
          icon: 'error',
          fillClass: 'fill-error-300',
          textClass: 'text-error-300',
          containerClass:
            'bg-error-100 border-error-200 hover:shadow-lg hover:shadow-error-100'
        },
        //成功
        success: {
          icon: 'success',
          fillClass: 'fill-success-300',
          textClass: 'text-success-300',
          containerClass:
            'bg-success-100 border-success-200 hover:shadow-lg hover:shadow-success-100'
        }
      }
      
      //控制展示
      const isVisable = ref(false)
      
      const animDuration = '0.5s'
      /**
       * 为了保证动画展示，需要在mounted之后进行展示
       */
      onMounted(() => {
        isVisable.value = true
        //展示完之后立即关闭
        setTimeout(() => {
          isVisable.value = false
          setTimeout(() => {
            if (props.destroy) {
              props.destroy()
            }
          }, parseInt(animDuration.replace('0.', '').replace('s', '') * 100))
        }, props.duration)
      })
      </script>
      
      <template>
        <transition name="down">
          <div
            v-show="isVisable"
            class="min-w-[420px] fixed top-[20px] left-[50%] translate-x-[-50%] z-50 flex items-center px-3 py-1.5 rounded-sm border cursor-pointer"
            :class="styles[type].containerClass"
          >
            <m-svg-icon
              :name="styles[type].icon"
              :fillClass="styles[type].fillClass"
              class="h-1.5 w-1.5 mr-1.5"
            ></m-svg-icon>
            <span class="text-sm" :class="styles[type].textClass">{{ content }}</span>
          </div>
        </transition>
      </template>
      
      <style scoped lang="scss">
      .down-enter-active,
      .down-leave-active {
        transition: all v-bind(animDuration);
      }
      .down-enter-from,
      .down-leave-to {
        opacity: 0;
        transform: translate3d(-50%, -100px, 0);
      }
      </style>
      ```

2. 然后构建出对应的`message.js`模块

3. 在模块中，通过h函数构建`vnode`，再通过`render`函数，进行渲染

   ```js
   import { h, render } from 'vue'
   import messageComponent from './index.vue'
   /**
    *
    * @param {*} type 类型：success、warn、error
    * @param {*} content 描述文本
    * @param {*} duration 展示时间（毫秒），默认3000
    */
   export const message = (type, content, duration = 3000) => {
     /**
      * 动画结束时的回调
      */
     const onDestroy = () => {
       //3.删除render
       render(null, document.body)
     }
     //1.拿到vnode
     const vnode = h(messageComponent, {
       type,
       content,
       duration,
       destroy: onDestroy
     })
     //2.render node
     render(vnode, document.body)
   }
   ```

4. 在`src\views\main\components\list\item.vue`中使用定时器延迟下载的执行

   ```js
   const onDownload = () => {
     message('success', '图片开始下载')
     /**
      * 1.下载的图片链接
      * 2.重命名文件
      */
     //延迟一段时间执行，可以得到更好地体验
     setTimeout(() => {
       saveAs(props.data.photoDownLink)
     }, 200)
   }
   ```

### 3.模块全屏解决方案--vueuse-useFullScreen

想要让页面的指定区域进行全屏展示，我们通常可以使用全屏API，该API中提供了两个方法：

1. Element.requestFullscreen()：让指定元素进行全屏

   ```js
   document.getElementById('app').requestFullscreen()
   ```

2. Document.exitFullscreen()：退出全屏

但是这个API比较原始，使用起来没有那么方便，所以我们可以使用一个`vueuse`中的更加简便的API：`useFullScreen`

```vue
  <!-- 图片 -->
      <img
        v-lazy
        class="w-full rounded bg-transparent"
        :src="data.photo"
        :style="{
          height: (width / data.photoWidth) * data.photoHeight + 'px'
        }"
        ref="imgTarget"
      />  

<!-- 全屏 -->
        <m-button
          class="absolute bottom-1.5 right-1.5 bg-zinc-100/70"
          type="info"
          icon="full"
          size="small"
          iconClass="fill-zinc-900 dark:fill-zinc-200"
          @click="onImgFullscreen"
        ></m-button>



/**
 * 生成全屏的方法
 */
const imgTarget = ref(null)
const { enter: onImgFullscreen } = useFullscreen(imgTarget)
```

### 4.构建floating基础布局

在`src\views\layout\components\floating.vue`构建floating组件基本布局

```vue
<template>
  <div class="fixed bottom-10 right-2">
    <!-- 引导页 -->
    <div
      class="group w-4 h-4 mb-1 bg-white dark:bg-zinc-900 border dark:border-0 border-zinc-200 rounded-full flex justify-center items-center cursor-pointer duration-200 hover:shadow-lg"
    >
      <m-svg-icon
        name="guide"
        class="w-2 h-2"
        fillClass="fill-zinc-900 dark:fill-zinc-200 group-hover:fill-main "
      ></m-svg-icon>
    </div>
    <!-- 反馈 -->
    <m-popover class="flex items-center" placement="top-left">
      <template #reference>
        <div
          class="group w-4 h-4 mb-1 bg-white dark:bg-zinc-900 border dark:border-0 border-zinc-200 rounded-full flex justify-center items-center cursor-pointer duration-200 hover:shadow-lg"
        >
          <m-svg-icon
            name="feedback"
            class="w-2 h-2"
            fillClass="fill-zinc-900 dark:fill-zinc-200 group-hover:fill-main "
          ></m-svg-icon>
        </div>
      </template>

      <div class="w-[140px] overflow-hidden">
        <div
          class="flex items-center p-1 cursor-pointer rounded hover:bg-zinc-100/60 dark:hover:bg-zinc-800"
        >
          <m-svg-icon
            name="feedback"
            class="w-1.5 h-1.5 mr-1"
            fillClass="fill-zinc-900 dark:fill-zinc-300"
          ></m-svg-icon>
          <span class="text-zinc-800 dark:text-zinc-300 text-sm">立即吐槽</span>
        </div>
      </div>
    </m-popover>
  </div>
</template>

<script setup></script>

<style scoped lang="scss"></style>
```

### 5.样式修正：处理难看的scrollBar--tailwind-scrollbar

对于`tailwind`而言，默认没有提供`scrollBar`的样式类名，想要处理`scrollBar`的样式，那么需要安装单独的插件：`tailwind-scrollbar`

1. 使用`npm i -D tailwind-scrollbar`安装该插件

2. 配置`tailwind-scrollbar`

   1. 在`tailwind.config.cjs`以插件形式导入`tailwind-scrollbar`

      ```js
       plugins: [require('tailwind-scrollbar')],
      ```

   2. 在`theme\extend`节点下配置`tailwind-scrollbar`暗黑模式

      ```js
       variants: {
              scrollbar: ['dark']
       }
      ```

   3. 使用`scrollbar`样式，并在`index.scss`里为`srcollbar`添加圆角

      ```vue
      <div
          class="h-full overflow-auto bg-white dark:bg-zinc-800 duration-500 scrollbar-thin scrollbar-thumb-transparent xl:scrollbar-thumb-zinc-200 xl:dark:scrollbar-thumb-zinc-900 scrollbar-track-transparent"
        >
      ```

      ```scss
      //导入tailwind的基础指令组件
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
      
      ::-webkit-scrollbar-thumb {
        border-radius: 10px;
      }
      ```

### 6.功能引导解决方案--driver.js

想要完成功能引导的实现，那么我们需要借助一个第三方的包：`driver.js`

1. 使用npm安装`driver.js`：`npm install driver.js --save`

2. 在`floating.vue`中导入`driver.js`和其对应的样式`driver.min.css`，并在`onMounted`生命周期函数中对`driver`进行初始化配置，最后添加点击事件开始引导：

   ```vue
   <script setup>
   import { onMounted } from 'vue'
   //1.导入
   import Driver from 'driver.js'
   import 'driver.js/dist/driver.min.css'
   import steps from './steps'
   
   //2.初始化
   let driver = null
   onMounted(() => {
     driver = new Driver({
       //点击蒙版关闭引导
       allowClose: false,
       //关闭按钮的文本
       closeBtnText: '关闭',
       //下一步按钮的文本
       nextBtnText: '下一步',
       //上一步按钮的文本
       prevBtnText: '上一步',
       //完成按钮的文本
       doneBtnText: '完成'
     })
   })
   
   /**
    * 开始引导
    */
   const onGuideClick = () => {
     //指定引导步骤
     driver.defineSteps(steps)
     //开始引导
     driver.start()
   }
   </script>
   ```

3. 新建`step.js`抽离引导步骤的逻辑

   ```js
   export default [
     {
       //在哪个元素中高亮
       element: '.guide-home',
       //配置对象
       popover: {
         title: 'logo',
         description: '点击返回首页'
       }
     },
     {
       //在哪个元素中高亮
       element: '.guide-search',
       //配置对象
       popover: {
         title: '搜索',
         description: '搜索您期望的图片'
       }
     },
     {
       //在哪个元素中高亮
       element: '.guide-theme',
       //配置对象
       popover: {
         title: '风格',
         description: '选择一个您喜欢的风格',
         position: 'left'
       }
     },
     {
       //在哪个元素中高亮
       element: '.guide-my',
       //配置对象
       popover: {
         title: '账户',
         description: '这里标记了您的账户信息',
         position: 'left'
       }
     },
     {
       //在哪个元素中高亮
       element: '.guide-start',
       //配置对象
       popover: {
         title: '引导',
         description: '这里可以查看引导信息',
         position: 'left'
       }
     },
     {
       //在哪个元素中高亮
       element: '.guide-feedback',
       //配置对象
       popover: {
         title: '反馈',
         description: '您的任何不满都可以在这里告诉我们',
         position: 'left'
       }
     }
   ]
   ```

### 7.解决功能引导图标不显示的问题

1. 白色背景挡住了图标的问题：引导功能的原理是为对应的元素添加新的类名来实现，而这个类名缺少了对应的样式` position: relative`，我们可以通过对原来的样式进行新增来实现：

   ```scss
   //对原来的样式进行新增
   .driver-fix-stacking {
     position: relative;
   }
   ```

2. 引导中图标样式未对齐的问题

   ```scss
   .driver-navigation-btns {
     line-height: 0;
   }
   ```

3. 引导和反馈图标跑偏的问题

   ```vue
   <style scoped lang="scss">
   .driver-fix-stacking {
     position: fixed;
     z-index: 100004 !important;
   }
   </style>
   ```

## 12.高阶路由过渡处理方案：浏览器堆栈主动介入

### 1.VueRouter过渡动效可行性分析

在vue中，两个路由进行跳转的时候，我们有时候会为其增加一些跳转的过渡动画，通常这种情况下，我们可以直接使用`vue-router`的过渡动效来实现

我们期望这个过渡动效可以：

1. 同时在PC端和移动端生效
2. 进入新页面时，在点击的具体item中呈现由小到大的缩放动画
3. 退出新页面时，呈现由大到小的缩放动画并且缩回至点击的具体item中

根据`vue-router`的过渡动效的使用原理，结合我们项目的需求可以发现**：`vue-router`提供的过渡动效是对路由组件的整体动效，不适用于路由组件中内部子组件的单独过渡**

### 2.主动介入浏览器堆栈管理，分析可行性方案

所谓路由的跳转无非指的是两个部分，只要满足以下两点，我们就认为路径进行了跳转

1. 浏览器的url发生了变化
2. 浏览器中展示的页面组件发生了变化

因此，我们可以不去进行真实的路由跳转，而是先修改浏览器的URL，再切换展示的页面（以组件的形式覆盖整个浏览器可视区域），这样对于用户而言，是不是就完成了整个的路由跳转工作

所以说我们的具体问题就变成了：

1. 如何让浏览器的url发生变化，但是不跳转页面：使用`History.pushState()`方法
2. 如何让一个新的组件以包含动画的形式进行展示：使用`GSAP`动画库来进行实现

在`item.vue`中触发自定义点击事件，在`index.vue`中触发该事件并且修改浏览器`url`

```js
/**
 * 进入pins
 */
const onToPins = (item) => {
  /**
   * js状态的对象
   * title当前大多数浏览器忽略此参数
   * url 新历史记录条目的URL由此参数指定
   */
  // 修改浏览器的url
  history.pushState(null, null, `/pins/${item.id}`)
}
```

### 3.基于GSAP实现高阶路由过渡动画分析

当url发生变化之后，我们接下来就只需要处理对应的动画就可以了，动画的处理我们依赖于GSAP进行实现，对于GSAP而言，主要依赖于两个方法，GSAP会基于set和to的状态，来自动执行中间的补间动画：

1. `gsap.set()`：这个方法通常使用在动画开始之前，表示设置动画开始前的元素属性
2. `gsap.to()`：这个方法表示最终元素展示的状态

所以我们只需要：

1. 创建一个对应的组件，使用`transition`进行包裹
2. 计算出`set`时，组件元素对应的样式属性
3. 计算出`to`时，组件元素对应的样式属性

### 4.基于GSAP实现高阶路由过渡动画处理-1--vueuse-useElementBounding

1. 创建`src\views\pins\index.vue`组件

2. 创建`src\views\pins\components\pins.vue`组件，并进行基本处理

3. 在`src\views\main\components\list\index.vue`中使用`pins-vue`组件，并使用`transition`进行包裹，然后利用`JavaScript`钩子绑定对应的三个状态并设置`css=false`

   ```vue
      <!-- 详情内容展示 -->
       <transition :css="false" @before-enter="" @enter="" @leave="">
         <pins-vue v-if="isVisablePins" :id="currentPins.id"></pins-vue>
       </transition>
   ```

4. 使用`v-if`动态控制`pins-vue`组件展示，并保存当前选中的`pins`属性

   ```js
   //控制pins展示
   const isVisablePins = ref(false)
   //当前选中的pins属性
   const currentPins = ref({})
   /**
    * 进入pins
    */
   const onToPins = (item) => {
     /**
      * js状态的对象
      * title当前大多数浏览器忽略此参数
      * url 新历史记录条目的URL由此参数指定
      */
     // 修改浏览器的url
     history.pushState(null, null, `/pins/${item.id}`)
     isVisablePins.value = true
     currentPins.value = item
   }
   ```

5. 在`src\views\main\components\list\item.vue`组件中，记录点击时当前item图片的中心位置，该位置即为动画的起点，此处将使用到`vueuse`中的`useElementBounding`方法：

   ```js
   /**
    * pins跳转记录，记录图片的中心点（X|Y位置+宽|高 一半）
    */
   const {
     x: imgContainerX,
     y: imgContainerY,
     width: imgContainerWidth,
     height: imgContainerHeight
   } = useElementBounding(imgTarget)
   const imgContainerCenter = computed(() => {
     return {
       translateX: parseInt(imgContainerX.value + imgContainerWidth.value / 2),
       translateY: parseInt(imgContainerY.value + imgContainerHeight.value / 2)
     }
   })
   
   /**
    * 进入详情点击事件
    */
   const onToPinsClick = () => {
     emits('click', {
       id: props.data.id,
       location: imgContainerCenter.value
     })
   }
   ```

### 5.基于GSAP实现高阶路由过渡动画处理-2--vueuse-useEventListener

1. 使用`npm`安装`GSAP`

   ```shell
    npm i --save gsap           
   ```

2. 引入`gsap`并定义`transition`的三个JavaScript钩子

   ```js
   //进入前的状态
   const beforeEnter = (el) => {
     gsap.set(el, {
       //缩放
       scaleX: 0,
       scaleY: 0,
       transformOrigin: '0 0',
       translateX: currentPins.value.location?.translateX,
       translateY: currentPins.value.location?.translateY,
       opacity: 0
     })
   }
   //进入后的状态
   const enter = (el, done) => {
     gsap.to(el, {
       duration: 0.3,
       scaleX: 1,
       scaleY: 1,
       translateX: 0,
       translateY: 0,
       opacity: 1,
       onComplete: done
     })
   }
   const leave = (el, done) => {
     gsap.to(el, {
       duration: 0.3,
       scaleX: 0,
       scaleY: 0,
       translateX: currentPins.value.location?.translateX,
       translateY: currentPins.value.location?.translateY,
       opacity: 0,
       onComplete: done
     })
   }
   ```

3. 使用`vueuse`提供的`useEventListener`监听浏览器后退事件来关闭详情页展示并修改url

   ```js
   /**
    * 监听浏览器后退按钮事件
    * 使用vueuse监听popstate事件
    */
   useEventListener(window, 'popstate', () => {
     isVisablePins.value = false
   })
   ```

### 6.通用组件：navbar构建方案分析

pins的页面样式同时可以应用到PC端和移动端，而在移动端中，则会展示对应的`navbar`的内容，所以我们首先先构建出`navbar`通用组件，然后再基于`navbar`构建对应的`pins`样式

那么对于`navbar`而言：

1. 它分为**左、中、右**三个大的部分，三个部分都可以通过插槽进行指定
2. 左、右两边的插槽可以自定义点击事件
3. 同时`navbar`有时候会存在吸顶的效果，所以我们最好还可以通过一个`prop`指定对应的吸顶展示

### 7.通用组件：构建navbar

构建navbar组件，并且为左侧按钮绑定默认处理函数` router.back()`，这里能跳转回去与路由的`history`模式有关

```vue
<script setup>
import { useRouter } from 'vue-router'
const props = defineProps({
  //左边按钮的点击
  clickLeft: Function,
  //右边按钮的点击
  clickRight: Function,
  //是否吸顶
  sticky: Boolean
})
const router = useRouter()
/**
 * 左侧按钮点击事件
 */
const onClickLeft = () => {
  if (props.clickLeft) {
    props.clickLeft()
    return
  }
  router.back()
}
/**
 * 右侧按钮点击事件
 */
const onClickRight = () => {
  if (props.clickLeft) {
    props.clickRight()
    return
  }
  router.back()
}
</script>

<template>
  <div
    class="w-full h-5 border-b flex items-center z-10 bg-white dark:bg-zinc-800 border-b-zinc-200 dark:border-b-zinc-700"
    :class="[sticky ? 'sticky top-0 left-0' : 'relative']"
  >
    <!-- 左 -->
    <div
      class="h-full w-5 absolute left-0 flex items-center justify-center"
      @click="onClickLeft"
    >
      <slot name="left">
        <m-svg-icon
          name="back"
          class="w-2 h-2"
          fillClass="fill-zinc-900 dark:fill-zinc-200"
        ></m-svg-icon>
      </slot>
    </div>
    <!-- 中 -->
    <div
      class="h-full flex items-center justify-center m-auto font-bold text-base text-zinc-900 dark:text-zinc-200"
    >
      <slot></slot>
    </div>
    <!-- 右 -->

    <div
      class="h-full w-5 absolute right-0 flex items-center justify-center"
      @click="onClickRight"
    >
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
```

### 8.基于navbar处理响应式的pins页面

1. 在`src\api\mock\pexels.js`中新建`getPexelsFromId`接口

   ```js
   /**
    * 获取指定图片数据
    */
   export const getPexelsFromId = (id) => {
     return request({
       url: `/pexels/${id}`,
       method: 'get'
     })
   }
   ```

2. 在`src\views\pins\components\pins.vue`组件中导入`getPexelsFromId`接口并发起请求获取数据

3. 导入`isMobileTerminal`动态展示移动端下的`navbar`并扩展`tailwind`的`  backdropBlur: { '4xl': '240px' }`

4. 使用`tailwind`提供的媒体查询构建响应式页面

   ```vue
   <script setup>
   import { ref } from 'vue'
   import { getPexelsFromId } from '@/api/mock/pexels'
   import { isMobileTerminal } from '@/utils/flexible'
   import { useRouter } from 'vue-router'
   const props = defineProps({
     id: {
       type: String,
       required: true
     }
   })
   //获取图片数据
   const pexelData = ref({})
   const getPexelesData = async () => {
     const res = await getPexelsFromId(props.id)
     pexelData.value = res
   }
   getPexelesData()
   
   const router = useRouter()
   /**
    * 关闭详情页
    */
   const onPop = () => {
     router.back()
   }
   </script>
   
   <template>
     <div
       class="fixed top-0 left-0 w-screen h-screen text-xl z-20 backdrop-blur-4xl bg-transparent pb-2 overflow-y-auto xl:p-2"
     >
       <!-- 移动端下的navbar -->
       <m-navbar v-if="isMobileTerminal" sticky>
         {{ pexelData.title }}
         <template #right>
           <m-svg-icon
             name="share"
             class="w-3 h-3"
             fillClass="fill-zinc-900 dark:fill-zinc-200"
           >
           </m-svg-icon>
         </template>
       </m-navbar>
       <!-- pc端 -->
       <m-svg-icon
         v-else
         name="close"
         class="w-3 h-3 ml-1 p-0.5 cursor-pointer duration-200 rounded hover:bg-zinc-100 absolute right-2 top-2"
         fillClass="fill-zinc-400"
         @click="onPop"
       ></m-svg-icon>
   
       <!-- 内容区 -->
       <div class="xl:w-[80%] xl:h-full xl:mx-auto xl:rounded-lg xl:flex">
         <img
           :src="pexelData.photo"
           alt=""
           class="w-screen mb-2 xl:w-3/5 xl:h-full xl:rounded-tl-lg xl:rounded-bl-lg"
         />
         <div
           class="xl:w-2/5 xl:h-full xl:bg-white xl:dark:bg-zinc-900 xl:rounded-tr-lg xl:rounded-br-lg xl:p-3"
         >
           <!-- 收藏、分享 -->
           <div v-if="!isMobileTerminal" class="flex justify-between mb-2">
             <!-- 分享 -->
             <m-svg-icon
               name="share"
               class="w-4 h-4 p-1 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 duration-300 rounded"
               fillClass="fill-zinc-800 dark:fill-zinc-200"
             ></m-svg-icon>
             <!-- 收藏 -->
             <m-button
               type="info"
               icon="heart"
               iconClass="fill-zinc-800 dark:fill-zinc-200"
             ></m-button>
           </div>
   
           <!-- 标题 -->
           <p
             class="text-base text-zinc-900 dark:text-zinc-200 ml-1 font-bold xl:text-xl xl:mb-5"
           >
             {{ pexelData.title }}
           </p>
           <!-- 作者 -->
           <div class="flex items-center mt-1 px-1">
             <img
               v-lazy
               class="h-3 w-3 rounded-full"
               :src="pexelData.avatar"
               alt=""
             />
             <span class="text-base text-zinc-900 dark:text-zinc-200 ml-1">
               {{ pexelData.author }}
             </span>
           </div>
         </div>
       </div>
     </div>
   </template>
   
   <style scoped lang="scss"></style>
   ```

### 9.处理刷新空白问题--添加路由规则

原因：由于刷新之后浏览器堆栈为空，并且我们没有指定对应的路由，所以进入详情页之后刷新为空

解决方案：**在PC和移动端路由表中只添加路由规则而不提供路由视图容器，并且定义组件传入路由匹配的参数`id`，路由规则的嵌套是根据`router-view`的层级关系来决定的，并且使用路由时不一定必须使用`router-view`**

```vue
<script setup>
import pinsVue from './components/pins.vue'
</script>

<template>
  <div class="w-full h-full bg-zinc-200 dark:bg-zinc-800">
    <pins-vue :id="$route.params.id"></pins-vue>
  </div>
</template>

<style scoped lang="scss"></style>
```

```js
  {
    path: '/pins/:id',
    name: 'pins',
    component: () => import('@/views/pins/index.vue')
  }
```

## 13.人类行为验证处理方案--脱离UI组件库实现登录、注册和表单校验

### 1.构建登录模块基础UI结构

1. 隐藏用户信息并展示默认未登录时的图标

   ```vue
   <template>
     <m-popover class="flex items-center" placement="bottom-left">
       <template #reference>
         <div
           class="guide-my relative flex items-center p-0.5 rounded-sm cursor-pointer duration-200 outline-none hover:bg-zinc-100 dark:hover:bg-zinc-900"
           v-if="false"
         >
           <!-- 头像 -->
           <img v-lazy class="w-3 h-3 rounded-sm" src="@/assets/images/1.jpg" />
   
           <!-- 下箭头 -->
           <m-svg-icon
             name="down-arrow"
             fillClass="fill-zinc-900 dark:fill-zinc-900"
             class="h-1.5 w-1.5 ml-0.5"
           ></m-svg-icon>
           <!-- vip -->
           <m-svg-icon
             name="vip"
             fillClass="fill-zinc-900"
             class="h-1.5 w-1.5 absolute right-[16px] bottom-0"
           ></m-svg-icon>
         </div>
         <div v-else>
           <m-button
             class="guide-my"
             icon="profile"
             iconColor="#fff"
             @click="onToLogin"
           ></m-button>
         </div>
       </template>
       <!-- 气泡 -->
       <div v-if="false" class="w-[140px] overflow-hidden">
         <div
           class="flex items-center p-1 cursor-pointer rounded hover:bg-zinc-100/60 dark:hover:bg-zinc-800"
           v-for="item in menuArr"
           :key="item.id"
         >
           <m-svg-icon
             :name="item.icon"
             class="w-1.5 h-1.5 mr-1"
             fillClass="fill-zinc-900"
           ></m-svg-icon>
           <span class="text-zinc-800 text-sm dark:text-zinc-300">{{
             item.title
           }}</span>
         </div>
       </div>
     </m-popover>
   </template>
   
   <script setup>
   import { useRouter } from 'vue-router'
   
   const router = useRouter()
   //构建数据源
   const menuArr = [
     {
       id: 0,
       title: '个人资料',
       icon: 'profile',
       path: '/profile'
     },
     {
       id: 1,
       title: '升级 VIP',
       icon: 'vip-profile',
       path: '/memeber'
     },
     {
       id: 2,
       title: '退出登录',
       icon: 'logout',
       path: ''
     }
   ]
   
   /**
    * 登录按钮点击事件
    */
   const onToLogin = () => {
     router.push('/login')
   }
   </script>
   
   <style scoped lang="scss"></style>
   ```

2. 新建`src\views\login-register\index.vue`，并构建PC端和移动端路由表

   ```js
     {
       path: '/login',
       name: 'login',
       component: () => import('@/views/login-register/index.vue')
     }
   ```

3. 使用`tailwind`提供的媒体查询构建PC端和移动端的页面，并封装组件复用`header`部分

   ```vue
   <script setup>
   import headerVue from '../components/header.vue'
   </script>
   
   <template>
     <div
       class="relative h-screen bg-white dark:bg-zinc-800 text-center xl:bg-zinc-200"
     >
       <!-- 头部图片 -->
       <header-vue></header-vue>
       <!-- 表单区 -->
       <div
         class="block px-3 mt-4 dark:bg-zinc-800 xl:bg-white xl:w-[388px] xl:dark:bg-zinc-900 xl:m-auto xl:mt-8 xl:py-4 xl:rounded-sm xl:shadow-lg"
       >
         <h3
           class="hidden mb-2 font-semibold text-base text-main dark:text-zinc-300 xl:block"
         >
           账号登录
         </h3>
         <!-- 表单 -->
         <form>
           <input
             class="dark:bg-zinc-800 dark:text-zinc-400 border-b-zinc-400 border-b w-full outline-0 pb-1 px-1 text-base focus:boder-b-main xl:default:bg-zinc-900"
             type="text"
             name="username"
             placeholder="用户名"
             autocomplete="on"
           />
           <input
             class="dark:bg-zinc-800 dark:text-zinc-400 border-b-zinc-400 border-b w-full outline-0 pb-1 px-1 text-base focus:boder-b-main xl:default:bg-zinc-900"
             type="password"
             name="password"
             placeholder="密码"
             autocomplete="on"
           />
           <!-- 跳转按钮 -->
           <div class="pt-1 pb-3 leading-[0px] text-right">
             <a
               class="inline-block p-1 text-zinc-400 text-right dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 text-sm duration-300 cursor-pointer"
               href=""
               >去注册</a
             >
           </div>
           <!-- 登录按钮 -->
           <m-button class="w-full dark:bg-zinc-900 xl:dark:bg-zinc-800"
             >登录
           </m-button>
         </form>
         <!-- 第三方登录 -->
         <div class="flex justify-around mt-4">
           <!-- QQ -->
           <m-svg-icon class="w-4 cursor-pointer" name="qq"></m-svg-icon>
           <!-- 微信登录 -->
           <m-svg-icon class="w-4 cursor-pointer" name="wexin"></m-svg-icon>
         </div>
       </div>
     </div>
   </template>
   
   <style scoped lang="scss"></style>
   ```

   ```vue
   <script setup lang="ts"></script>
   
   <template>
     <!-- PC端：头部图标 -->
     <div class="hidden pt-5 h-8 xl:block">
       <img class="m-auto" src="https://res.lgdsunday.club/signlogo.png" alt="" />
     </div>
     <!-- 移动端：头部图标 -->
     <div class="h-[111px] xl:hidden">
       <img
         class="dark:hidden"
         src="https://res.lgdsunday.club/login-bg.png"
         alt=""
       />
       <img
         class="h-5 absolute top-[5%] left-[50%] translate-x-[-50%]"
         src="https://m.imooc.com/static/wap/static/common/img/logo-small@2x.png"
         alt=""
       />
     </div>
   </template>
   
   <style scoped lang="scss"></style>
   ```

### 2.表单校验实现原理与方案分析

表单校验的实现原理：

1. 在某一个时机下（失去焦点，内容变化）：监听表单元素的对应时机
2. 检查表单元素中的value是否符合某个条件（校验条件）：检查内容是否匹配校验条件
3. 如果不符合，则给出对应的提示：根据检查结果，展示对应提示

自定义表单校验方案分析：

1. 创建对应的`field`输入框组件
2. 该组件中，包含两个元素：
   1. input输入框
   2. span表示错误提示
3. 监听`input`输入框的`blur`失去焦点事件
4. 根据`input`的`value`判断是否满足一个或多个指定的事件
5. 如果不满足，则展示`span`标签，表示错误提示信息

本项目中的方案实现：

1. 根据以上描述，我们确定可以实现一个基础的表单校验，但是这样的表单校验组件，很难具有普适性，因为实际开发中，表单校验的场景多种多样，比如：国际化处理

2. 所以说，把它抽离成一个通用组件意义并不大，而是采用一种更加普适的方式：`vee-validate`

3. `vee-validate`是一个vue中专门做表单校验的库，该库更加具有普适性，也更加适合大家在实际开发中的使用

### 3.基于vee-validate实现普适的表单校验

1. 使用`npm`安装`vee-validate`：`npm i vee-validate --save`

2. 使用`vee-validate`提供的三个组件：`form`表单、`field`输入框、`ErrorMessage`错误提示，在导入组件时提供别名进行使用，并且使用对应的属性将组件关联起来，最后为`vee-form`表单绑定`submit`提交事件

   ```vue
      <!-- 表单 -->
         <vee-form @submit="onLoginHandler">
           <!-- 用户名 -->
           <vee-field
             class="dark:bg-zinc-800 dark:text-zinc-400 border-b-zinc-400 border-b w-full outline-0 pb-1 px-1 text-base focus:boder-b-main xl:default:bg-zinc-900"
             type="text"
             name="username"
             placeholder="用户名"
             autocomplete="on"
             :rules="validateUsername"
           />
           <vee-error-message
             class="text-sm text-red-600 block mt-0.5 text-left"
             name="username"
           >
           </vee-error-message>
           <!-- 密码 -->
           <vee-field
             class="dark:bg-zinc-800 dark:text-zinc-400 border-b-zinc-400 border-b w-full outline-0 pb-1 px-1 text-base focus:boder-b-main xl:default:bg-zinc-900"
             type="password"
             name="password"
             placeholder="密码"
             autocomplete="on"
             :rules="validatePassword"
           />
           <vee-error-message
             class="text-sm text-red-600 block mt-0.5 text-left"
             name="password"
           >
           </vee-error-message>
           <!-- 跳转按钮 -->
           <div class="pt-1 pb-3 leading-[0px] text-right">
             <a
               class="inline-block p-1 text-zinc-400 text-right dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 text-sm duration-300 cursor-pointer"
               href=""
               >去注册</a
             >
           </div>
           <!-- 登录按钮 -->
           <m-button
             class="w-full dark:bg-zinc-900 xl:dark:bg-zinc-800"
             :isActiveAnim="false"
             >登录
           </m-button>
         </vee-form>
   ```

3. 创建`validate.js`并定义表单校验规则：通过定义方法来实现表单验证，方法的返回值决定验证的结果：

   1. `true`表示表单校验通过
   2. `String`表示表单校验未通过，并且`String`为提示信息

   ```js
   /**
    * 用户名的表单校验
    * @param {*} val  val用户输入的内容
    * @returns  true表示表单校验通过,String表示表单校验未通过，并且String为提示信息
    */
   export const validateUsername = (val) => {
     if (!val) {
       return '用户名为必填项'
     }
     if (val.length < 3 || val.length > 12) {
       return '用户名应该在3-12位之间'
     }
     return true
   }
   
   /**
    * 密码的表单校验
    */
   export const validatePassword = (val) => {
     if (!val) {
       return '密码为必填项'
     }
     if (val.length < 3 || val.length > 12) {
       return '密码应该在6-12位之间'
     }
     return true
   }
   ```

4.人类行为验证--目的、实现原理、构建方案

目的：防止用户使用脚本刷访问量，投屏或者砍价等等行为；即明确当前的操作是人完成的，而非机器

实现原理：人机验证通过对用户的行为数据，设备特征与网络构建多维度数据分析，采用完整的可信前端安全方案保证数据采集的真实性、有效性，通过收集多维度数据来分析来建立人类行为模型，以此来判断用户是否是一个机器人

1. 浏览器特征检查：所有浏览器都有差异，可以通过各种前端相关手段检查浏览器环境的真实性
2. 鼠标事件(click、move、hover、leave.....)
3. 页面窗口(size、scroll、坐标......)
4. cookie等等

人进行的拖动拼图和机器进行的拖动拼图，他们两者的**鼠标行为轨迹.**.....是不同的，那么这个不同就是区分人和机器的关键

构建方案：目前人类行为验证的实现方案，主要分为两种：

1. 收费平台，年费在几万到几十万不等，有专门的技术人员帮助对接：
   1. 极验
   2. 网易易盾
   3. ......
2. 免费开源，验证的精准度，需要看服务端的能力：
   1. gitee开源的：`SliderCaptcha`

我们这里主要就是用这个开源的`SliderCaptcha`实现

### 4.构建人类行为验证模块--SliderCaptcha

1. 创建`vendor`文件夹，复制`SliderCaptcha`至文件夹中

2. 创建`src\views\login-register\login\slider-captcha.vue`，作为人类行为验证组件

3. 在该组件中，完成对应UI样式：在`onMounted`中初始化`SliderCaptcha`进行一些列配置：如使用id选择器将`SliderCaptcha`渲染进对应id的元素中，最后返回一个`captcha`对象便于进行重置操作` captcha.reset()`

   ```vue
   <script>
   const EMITS_CLOSE = 'close'
   const EMITS_SUCCESS = 'success'
   </script>
   
   <script setup>
   import '@/vendor/SliderCaptcha/longbow.slidercaptcha.min.js'
   import '@/vendor/SliderCaptcha/slidercaptcha.min.css'
   import { onMounted } from 'vue'
   import { getCaptcha } from '@/api/mock/sys'
   
   const emits = defineEmits([EMITS_CLOSE, EMITS_SUCCESS])
   /**
    * 使用人类行为验证：
    * 1.创建captcha
    */
   let captcha = null
   onMounted(() => {
     captcha = sliderCaptcha({
       //渲染位置
       id: 'captcha',
       //用户拼图成功之后的回调，只是拼图成功的回调
       async onSuccess(arr) {
         const res = await getCaptcha({
           behavior: arr
         })
         if (res) {
           emits(EMITS_SUCCESS)
         }
       },
       //用户拼图失败之后的回调
       onFail() {},
       //默认的验证方法,服务端验证方法，arr为客户端拖动滑块轨迹，url为服务端请求地址，返回值值为布尔值
       async verify(arr, url) {
         // const res = await getCaptcha({
         //   behavior: arr
         // })
         // return res
         return true
       }
     })
   })
   /**
    * 重置
    */
   const onReset = () => {
     captcha.reset()
   }
   /**
    * 关闭
    */
   const onClose = () => {
     emits(EMITS_CLOSE)
   }
   </script>
   
   <template>
     <div
       class="fixed top-[20%] left-[50%] translate-x-[-50%] w-[340px] h-[270px] text-sm bg-white dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-900 shadow-2xl"
     >
       <!-- 头 -->
       <div class="flex items-center h-5">
         <span class="flex-grow dark:text-zinc-200">请完成安全验证</span>
         <m-svg-icon
           name="refresh"
           fillClass="fill-zinc-900 dark:fill-zinc-200"
           class="w-3 h-3 p-0.5 rounded-sm duration-300 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-900"
           @click="onReset"
         ></m-svg-icon>
         <m-svg-icon
           name="close"
           fillClass="fill-zinc-900 dark:fill-zinc-200"
           class="w-3 h-3 p-0.5 rounded-sm duration-300 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-900"
           @click="onClose"
         ></m-svg-icon>
       </div>
       <!-- captcha -->
       <div id="captcha"></div>
     </div>
   </template>
   
   <style scoped lang="scss"></style>
   ```

   ```vue
   //控制sliderCaptcha展示
   const isSliderCaptchaVisible = ref(false)
   /**
    * 触发登录，表单校验通过之后触发
    */
   const onLoginHandler = () => {
     isSliderCaptchaVisible.value = true
   }
   /**
    * 人类行为验证通过
    */
   const onCaptchaSuccess = () => {
     isSliderCaptchaVisible.value = false
     //登录操作
   }
   
   <slider-captcha-vue
         v-if="isSliderCaptchaVisible"
         @close="isSliderCaptchaVisible = false"
         @success="onCaptchaSuccess"
   ></slider-captcha-vue>
   ```

### 5.用户登录行为处理--md5.js加密密码

1. 在`src\api\mock\sys.js`新建登录请求

   ```js
   /**
    * 登录
    */
   export const loginUser = (data) => {
     return request({
       url: '/sys/login',
       method: 'POST',
       data
     })
   }
   ```

2. 使用vuex处理登录相关的数据，方便维护和管理：新建`user.js`，安装`npm i md5 --save`使用`md5`加密密码

   ```js
   import md5 from 'md5'
   import { loginUser } from '@/api/mock/sys'
   /**
    * user模块
    */
   export default {
     namespaced: true,
     state: () => {
       return {
         //登录的token
         token: ''
       }
     },
     mutations: {
       /**
        * 保存token
        */
       setToken(state, newToken) {
         state.token = newToken
       }
     },
     actions: {
       /**
        * 登录
        */
       async login(context, payload) {
         //加密密码
         const { password } = payload
         const data = await loginUser({
           ...payload,
           password: password ? md5(password) : ''
         })
         context.commit('setToken', data.token)
       }
     }
   }
   ```

3. 收集表单数据，在`constants/index.js`中定义登录类型常量`LOGIN_TYPE_USERNAME`，使用vuex中的`user/login`发起请求进行登录并保存token

   ```js
   /**
    * 人类行为验证通过
    */
   const onCaptchaSuccess = () => {
     isSliderCaptchaVisible.value = false
     //登录操作
     onLogin()
   }
   /**
    * 用户登录行为
    */
   const loading = ref(false)
   const loginForm = ref({
     username: '',
     password: ''
   })
   const onLogin = async () => {
     loading.value = true
     try {
       await store.dispatch('user/login', {
         ...loginForm.value,
         loginForm: LOGIN_TYPE_USERNAME
       })
     } finally {
       loading.value = false
     }
     router.push('/')
   }
   ```

### 6.用户信息获取行为

1. 在`src\api\mock\sys.js`新建获取用户信息的请求：包含`/user/`的请求中需要通过请求头：`Authorization`传递`token`验证`Bearer ${token}`

   ```js
   /**
    * 获取用户信息
    */
   export const getUserDetail = (data) => {
     return request({
       url: '/user/profile',
       method: 'GET',
       data
     })
   }
   ```

   ```js
   import store from '@/store'
   
   service.interceptors.request.use(
     (config) => {
       if (store.getters.token) {
         config.headers.Authorization = `Bearer ${store.getters.token}`
       }
       nprogress.start()
       //return出的对象，就是请求的配置对象
       return config
     },
     (err) => {}
   )
   ```

2. 在`user.js`中保存用户信息并使用`message`方法调用组件弹出欢迎消息，并在`getters.js`中简化数据获取方式

   ```js
   import md5 from 'md5'
   import { loginUser, getUserDetail } from '@/api/mock/sys'
   import { message } from '@/libs'
   /**
    * user模块
    */
   export default {
     namespaced: true,
     state: () => {
       return {
         //登录的token
         token: '',
         //用户信息
         userInfo: {}
       }
     },
     mutations: {
       /**
        * 保存token
        */
       setToken(state, newToken) {
         state.token = newToken
       },
       /**
        * 保存用户信息
        */
       setUserInfo(state, newUserInfo) {
         state.userInfo = newUserInfo
       }
     },
     actions: {
       /**
        * 登录
        */
       async login(context, payload) {
         //加密密码
         const { password } = payload
         const data = await loginUser({
           ...payload,
           password: password ? md5(password) : ''
         })
         context.commit('setToken', data.token)
         context.dispatch('profile')
       },
       /**
        * 获取用户信息
        */
       async profile(context) {
         const data = await getUserDetail()
         context.commit('setUserInfo', data)
         //提示
         message(
           'success',
           `欢迎您${
             data.vipLevel
               ? '尊贵的VIP' + data.vipLevel + '用户' + data.nickname
               : data.nickname
           }`,
           6000
         )
       }
     }
   }
   ```

3. 通过用户信息`$store.getters.token`和`$store.getters.userInfo`来动态展示`header-my`组件中对应的用户信息

   ```vue
   <template>
     <m-popover class="flex items-center" placement="bottom-left">
       <template #reference>
         <div
           class="guide-my relative flex items-center p-0.5 rounded-sm cursor-pointer duration-200 outline-none hover:bg-zinc-100 dark:hover:bg-zinc-900"
           v-if="$store.getters.token"
         >
           <!-- 头像 -->
           <img
             v-lazy
             class="w-3 h-3 rounded-sm"
             :src="
               $store.getters.token
                 ? $store.getters.userInfo.avatar
                 : '@/assets/images/1.jpg'
             "
           />
   
           <!-- 下箭头 -->
           <m-svg-icon
             name="down-arrow"
             fillClass="fill-zinc-900 dark:fill-zinc-900"
             class="h-1.5 w-1.5 ml-0.5"
           ></m-svg-icon>
           <!-- vip -->
           <m-svg-icon
             name="vip"
             fillClass="fill-zinc-900"
             class="h-1.5 w-1.5 absolute right-[16px] bottom-0"
             v-if="$store.getters.userInfo.vipLevel"
           ></m-svg-icon>
         </div>
         <div v-else>
           <m-button
             class="guide-my"
             icon="profile"
             iconColor="#fff"
             @click="onToLogin"
           ></m-button>
         </div>
       </template>
       <!-- 气泡 -->
       <div v-if="$store.getters.token" class="w-[140px] overflow-hidden">
         <div
           class="flex items-center p-1 cursor-pointer rounded hover:bg-zinc-100/60 dark:hover:bg-zinc-800"
           v-for="item in menuArr"
           :key="item.id"
         >
           <m-svg-icon
             :name="item.icon"
             class="w-1.5 h-1.5 mr-1"
             fillClass="fill-zinc-900"
           ></m-svg-icon>
           <span class="text-zinc-800 text-sm dark:text-zinc-300">{{
             item.title
           }}</span>
         </div>
       </div>
     </m-popover>
   </template>
   ```


### 7.退出登录操作

1. 在`user.js`中定义退出登录的方法：退出登录即清空`token`、清空用户信息、并刷新页面

   ```js
    /**
     * 退出登录
     */
   logout(context) {
       // 清空token
       context.commit('setToken', '')
       // 清空用户信息
       context.commit('setUserInfo', {})
       // 刷新页面以使用户跳转到无需权限的页面
       location.reload()
   },
   ```

2. 在`header-my`组件中为菜单栏绑定点击事件，并判断菜单Item项来进行操作：使用`confirm`方法创造组件，并使用`.then`传入成功的回调进行登出操作

   ```js
   /**
    * menu点击事件
    */
   const onItemClick = (item) => {
     if (item.id === 2) {
       confirm('您确定要退出登录吗？').then(() => {
         store.dispatch('user/logout')
       })
     }
   }
   ```

### 8.token超时处理

1. 通常情况下，token均具备时效性，在本项目中，token失效后，服务端会返回401

2. 当服务端返回401时，表示token超时，则需要重新登录，我们可以在axios的响应拦截器中进行对应操作：在响应拦截器中通过判断服务端返回的`code`，来进行用户登出操作`logout`

```js
service.interceptors.response.use(
  (response) => {
    nprogress.done()
    const { success, data, message } = response.data
    if (success) {
      return data
    }
    return Promise.reject(new Error(message))
  },
  (error) => {
    // 处理token超时
    if (error.response && error.response.data && error.response.data.code === 401) {
      // 退出
      store.dispatch('user/logout')
    }
    return Promise.reject(error)
  },
)
```

### 9.注册页面基本样式处理

1. 新建注册页面组件`src\views\login-register\register\index.vue`，并配置路由

   ```js
     {
       path: '/register',
       name: 'register',
       component: () => import('@/views/login-register/register/index.vue'),
     },
   ```

2. 定义密码和确认密码验证规则：在进行密码校验时，需要关联两个输入框的参数，具体做法是通过`vee-validate`提供的`defineRule`将导出的验证方法定义为规则并在`VeeField`中的`rules`里使用：` rules="validateConfirmPassword:@password" `

   ```js
   /**
    * 确认密码表单校验，关联密码所以需要注册
    * 1.定义方法
    * 2.注册这个校验
    */
   export const validateConfirmPassword = (val, password) => {
     if (val !== password[0]) {
       return '两次密码输入不一致'
     }
     return true
   }
   ```

   ```vue
   import { validateConfirmPassword, validatePassword, validateUsername } from '../validate'
   
   /**
    * 定义规则
    */
   defineRule('validateConfirmPassword', validateConfirmPassword)
   
   
   <!-- 确认密码 -->
    <VeeField
           v-model="regForm.confirmPassword"
           class="dark:bg-zinc-800 dark:text-zinc-400 border-b-zinc-400 border-b w-full outline-0 pb-1 px-1 text-base focus:boder-b-main xl:default:bg-zinc-900"
           type="password"
           name="confirmPassword"
           placeholder="确认密码"
           autocomplete="on"
           rules="validateConfirmPassword:@password" />
   ```

3. 处理注册页面基本样式

   ```vue
   <template>
     <div class="relative h-screen bg-white dark:bg-zinc-800 text-center xl:bg-zinc-200">
       <!-- 头部图片 -->
       <header-vue></header-vue>
       <!-- 表单区 -->
       <div
         class="block px-3 mt-4 dark:bg-zinc-800 xl:bg-white xl:w-[388px] xl:dark:bg-zinc-900 xl:m-auto xl:mt-8 xl:py-4 xl:rounded-sm xl:shadow-lg">
         <h3 class="hidden mb-2 font-semibold text-base text-main dark:text-zinc-300 xl:block">注册账号</h3>
         <!-- 表单 -->
         <VeeForm @submit="onRegHandler">
           <!-- 用户名 -->
           <VeeField
             v-model="regForm.username"
             class="dark:bg-zinc-800 dark:text-zinc-400 border-b-zinc-400 border-b w-full outline-0 pb-1 px-1 text-base focus:border-b-main xl:default:bg-zinc-900"
             type="text"
             name="username"
             placeholder="用户名"
             autocomplete="on"
             :rules="validateUsername" />
           <VeeErrorMessage class="text-sm text-red-600 block mt-0.5 text-left" name="username"> </VeeErrorMessage>
           <!-- 密码 -->
           <VeeField
             v-model="regForm.password"
             class="dark:bg-zinc-800 dark:text-zinc-400 border-b-zinc-400 border-b w-full outline-0 pb-1 px-1 text-base focus:border-b-main xl:default:bg-zinc-900"
             type="password"
             name="password"
             placeholder="密码"
             autocomplete="on"
             :rules="validatePassword" />
           <VeeErrorMessage class="text-sm text-red-600 block mt-0.5 text-left" name="password"> </VeeErrorMessage>
           <!-- 确认密码 -->
           <VeeField
             v-model="regForm.confirmPassword"
             class="dark:bg-zinc-800 dark:text-zinc-400 border-b-zinc-400 border-b w-full outline-0 pb-1 px-1 text-base focus:border-b-main xl:default:bg-zinc-900"
             type="password"
             name="confirmPassword"
             placeholder="确认密码"
             autocomplete="on"
             rules="validateConfirmPassword:@password" />
           <VeeErrorMessage class="text-sm text-red-600 block mt-0.5 text-left" name="confirmPassword"> </VeeErrorMessage>
           <!-- 跳转按钮 -->
           <div class="pt-1 pb-3 leading-[0px] text-right">
             <a
               class="inline-block p-1 text-zinc-400 text-right dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 text-sm duration-300 cursor-pointer"
               @click="onToLogin"
               >去登录</a
             >
           </div>
           <!-- 注册协议 -->
           <div class="text-center">
             <a
               class="text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 text-sm duration-300"
               target="_blank"
               href="https://m.imooc.com/newfaq?id=89">
               注册即同意《慕课网注册协议》
             </a>
           </div>
           <!-- 注册按钮 -->
           <m-button class="w-full dark:bg-zinc-900 xl:dark:bg-zinc-800" :is-active-anim="false" :loading="loading"
             >立即注册
           </m-button>
         </VeeForm>
       </div>
     </div>
   </template>
   ```

### 10.处理注册行为

1. 新建注册请求`registerUser`

   ```js
   /**
    * 注册
    */
   export const registerUser = (data) => {
     return request({
       url: '/sys/register',
       method: 'POST',
       data,
     })
   }
   ```

2. 在`user.js`中定义注册的方法`register`

   ```js
      /**
        * 注册
        */
       async register(context, payload) {
         // 加密密码
         const { password } = payload
         return await registerUser({
           ...payload,
           password: password ? md5(password) : '',
         })
       },
   ```

3. 实现注册逻辑：收集表单数据，展示加载图标，并使用`await`等待异步`actions`的完成然后进行后续回调操作，并在注册成功之后进行登录并跳转路由至首页，并使用`try finally`包裹捕获错误并在请求结束之后关闭加载图标展示

   ```js
   /**
    * 注册
    */
   const onRegHandler = async () => {
     loading.value = true
     try {
       const payload = {
         username: regForm.value.username,
         password: regForm.value.password,
       }
       // 注册
       await store.dispatch('user/register', payload)
       // 注册完成，触发登录
       await store.dispatch('user/login', {
         ...payload,
         loginType: LOGIN_TYPE_USERNAME,
       })
     } finally {
       loading.value = false
     }
     router.push('/')
   }
   ```

## 14.图片剪裁与上传处理方案--基于阿里云OSS处理用户资料

### 1.通用组件：input组件构建方案

使用常量区分单行文本和多行文本输入框，并使用`max`参数来控制表单控件的`maxlength`，使用`useVModel`简化组件双向数据绑定并使用`computed`计算出当前输入框文本的长度`currentNumber`，最后将`currentNumber`和`max`进行动态展示

```vue
<script>
import { useVModel } from '@vueuse/core'
import { computed } from 'vue'
// 单行
const TYPE_TEXT = 'text'
// 多行
const TYPE_TEXTAREA = 'textarea'
</script>

<script setup>
const props = defineProps({
  // v-model
  modelValue: {
    type: String,
    required: true,
  },
  // type
  type: {
    type: String,
    default: TYPE_TEXT,
    validator(value) {
      const arr = [TYPE_TEXT, TYPE_TEXTAREA]
      if (!arr.includes(value)) {
        throw new Error(`输入框的类型type必须在可选范围内${arr.join('、')}`)
      }
    },
  },
  // max
  max: {
    type: [String, Number],
  },
})
defineEmits(['update:modelValue'])
// 输入的字符
const text = useVModel(props)

// 输入的字符数
const currentNumber = computed(() => {
  return text.value.length
})
</script>

<template>
  <div class="relative leading-[0px]">
    <!-- 单行 -->
    <input
      v-if="type === TYPE_TEXT"
      v-model="text"
      type="text"
      :maxlength="max"
      class="border-gray-200 dark:border-zinc-600 dark:bg-zinc-800 duration-100 dark:text-zinc-400 border outline-0 py-0.5 px-1 text-sm rounded-sm focus:border-blue-400 w-full" />
    <!-- 多行 -->
    <textarea
      v-if="type === TYPE_TEXTAREA"
      v-model="text"
      rows="5"
      :maxlength="max"
      class="border-gray-200 dark:border-zinc-600 dark:bg-zinc-800 duration-100 dark:text-zinc-400 border outline-0 py-0.5 px-1 text-sm rounded-sm focus:border-blue-400 w-full"></textarea>
    <!-- 最大长度 -->
    <span
      v-if="max"
      class="absolute right-1 bottom-0.5 text-zinc-400 text-xs"
      :class="{ 'text-red-700': currentNumber === parseInt(max) }">
      {{ `${currentNumber}/${max}` }}
    </span>
  </div>
</template>

<style scoped lang="scss"></style>
```

### 2.构建用户资料基础样式

核心内容：构建头像选择框，使用隐藏的文件表单控件来实现头像上传选择。使用`v-show="false"`渲染文件输入框并隐藏，绑定 `ref="inputFileTarget"`和事件`  @change="onSelectImgHandler"`并使用`accept=".png,.jpeg,.jpg,.gif"`限定输入文件的格式，最后通过在头像选择框绑定点击事件，并在事件处理函数中拿到文件输入框的ref对象触发输入框的点击打开文件资源管理器

```vue
<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { isMobileTerminal } from '@/utils/flexible'
import { confirm } from '@/libs'

const store = useStore()
const router = useRouter()
/**
 * 移动端navbar左侧点击事件
 */
const onNavbarLeftClick = () => {
  router.back()
}

/**
 * 选择头像
 */
const inputFileTarget = ref(null)
const onAvatarClick = () => {
  inputFileTarget.value.click()
}
/**
 * 选中文件之后的回调
 */
const onSelectImgHandler = () => {}
/**
 * 移动端：退出登录
 */
const onLogoutClick = () => {
  confirm('确定要退出登录吗？').then(() => {
    store.dispatch('user/logout')
  })
}
</script>

<template>
  <div class="h-full bg-zinc-200 dark:bg-zinc-800 duration-500 overflow-auto xl:pt-1">
    <div
      class="relative max-w-screen-lg mx-auto bg-white dark:bg-zinc-900 duration-500 xl:rounded-sm xl:border-zinc-200 xl:dark:border-zinc-600 xl:border xl:px-4 xl:py-2">
      <!-- 移动端navbar -->
      <m-navbar
        v-if="isMobileTerminal"
        sticky
        :click-left="onNavbarLeftClick">
        个人资料
      </m-navbar>
      <!-- pc端标题 -->
      <div
        v-else
        class="text-lg font-bold text-center mb-4 dark:text-zinc-300">
        个人资料
      </div>
      <div class="h-full w-full px-1 pb-4 text-sm mt-2 xl:text-center xl:w-2/3">
        <!-- 头像部分 -->
        <div class="py-1 xl:absolute xl:right-[16%] xl:text-center">
          <span class="w-8 inline-block mb-2 font-black text-sm dark:text-zinc-300 xl:block xl:mx-auto">我的头像</span>
          <div
            class="relative w-[80px] h-[80px] group xl:cursor-pointer xl:left-1/2 xl:translate-x-[-50%]"
            @click="onAvatarClick">
            <!-- 头像 -->
            <img
              :src="$store.getters.userInfo.avatar"
              class="rounded-full w-full h-full xl:inline-block"
              alt="" />
            <!-- 鼠标移入 -->
            <div class="absolute top-0 rounded-full w-full h-full bg-black/40 hidden xl:group-hover:block duration-300">
              <m-svg-icon
                name="change-header-image"
                class="w-2 h-2 m-auto mt-2" />
              <div class="text-xs text-white dark:text-zinc-300 scale-90 mt-0.5">点击更换头像</div>
            </div>
          </div>
          <!-- 隐藏域 -->
          <input
            v-show="false"
            ref="inputFileTarget"
            accept=".png,.jpeg,.jpg,.gif"
            type="file"
            @change="onSelectImgHandler" />
          <p class="mt-1 text-zinc-500 dark:text-zinc-400 text-xs xl:w-10">
            支持jpg、png、jpeg、gif格式大小1M以内的图片
          </p>
        </div>
        <!-- 信息输入 -->
        <!-- 用户名 -->
        <div class="py-1 xl:flex xl:items-center xl:my-1">
          <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">用户名</span>
          <m-input
            v-model="$store.getters.userInfo.nickname"
            class="w-full"
            max="20"></m-input>
        </div>
        <!-- 职位 -->
        <div class="py-1 xl:flex xl:items-center xl:my-1">
          <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">职位</span>
          <m-input
            v-model="$store.getters.userInfo.title"
            class="w-full"></m-input>
        </div>
        <!-- 公司 -->
        <div class="py-1 xl:flex xl:items-center xl:my-1">
          <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">公司</span>
          <m-input
            v-model="$store.getters.userInfo.company"
            class="w-full"></m-input>
        </div>
        <!-- 个人主页 -->
        <div class="py-1 xl:flex xl:items-center xl:my-1">
          <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">个人主页</span>
          <m-input
            v-model="$store.getters.userInfo.homePage"
            class="w-full"></m-input>
        </div>
        <!-- 个人介绍 -->
        <div class="py-1 xl:flex xl:items-center xl:my-1">
          <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">个人介绍</span>
          <m-input
            v-model="$store.getters.userInfo.introduction"
            type="textarea"
            max="50"
            class="w-full"></m-input>
        </div>
        <m-button
          class="w-full mt-2 mb-4 dark:text-zinc-300 dark:bg-zinc-800 xl:w-[160px] xl:ml-[50%] xl:translate-x-[-50%]"
          >保存修改</m-button
        >
        <!-- 移动端：退出登录 -->
        <m-button
          v-if="isMobileTerminal"
          class="w-full mt-2 mb-4 dark:text-zinc-300 dark:bg-zinc-800 xl:w-[160px] xl:ml-[50%] xl:translate-x-[-50%]"
          @click="onLogoutClick"
          >保存修改</m-button
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
```

### 3.用户基本资料修改方案

1. `v-model`在`vue3`中是`:modelValue`和`update:modelValue`事件及其处理函数的简写，在对通用组件`m-input`进行双向数据绑定时，我们可以拆开`v-model`对`update:modelValue`的事件处理函数进行重写，在`update:modelValue`的事件处理函数中，参数`$event`被直接处理成为了双向绑定的值；收集到的数据将同步更新修改`vuex`中用户资料数据

   ```vue
      <!-- 用户名 -->
           <div class="py-1 xl:flex xl:items-center xl:my-1">
             <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">用户名</span>
             <m-input
               :model-value="$store.getters.userInfo.nickname"
               class="w-full"
               max="20"
               @update:modelValue="changeStoreUserInfo('nickname', $event)"></m-input>
           </div>
           <!-- 职位 -->
           <div class="py-1 xl:flex xl:items-center xl:my-1">
             <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">职位</span>
             <m-input
               :model-value="$store.getters.userInfo.title"
               class="w-full"
               @update:modelValue="changeStoreUserInfo('title', $event)"></m-input>
           </div>
           <!-- 公司 -->
           <div class="py-1 xl:flex xl:items-center xl:my-1">
             <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">公司</span>
             <m-input
               :model-value="$store.getters.userInfo.company"
               class="w-full"
               @update:modelValue="changeStoreUserInfo('company', $event)"></m-input>
           </div>
           <!-- 个人主页 -->
           <div class="py-1 xl:flex xl:items-center xl:my-1">
             <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">个人主页</span>
             <m-input
               :model-value="$store.getters.userInfo.homePage"
               class="w-full"
               @update:modelValue="changeStoreUserInfo('homePage', $event)"></m-input>
           </div>
           <!-- 个人介绍 -->
           <div class="py-1 xl:flex xl:items-center xl:my-1">
             <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">个人介绍</span>
             <m-input
               :model-value="$store.getters.userInfo.introduction"
               type="textarea"
               max="50"
               class="w-full"
               @update:modelValue="changeStoreUserInfo('introduction', $event)"></m-input>
           </div>
           <m-button
             class="w-full mt-2 mb-4 dark:text-zinc-300 dark:bg-zinc-800 xl:w-[160px] xl:ml-[50%] xl:translate-x-[-50%]"
             :loading="false"
             @click="onChangeProfile"
             >保存修改</m-button
           >
   ```

2. 在`sys.js`中新建修改用户资料接口，这个接口请求方式为`PUT`；修改个人信息时将`vuex`收集的数据传入并调用该接口

   ```js
   /**
    * 修改用户信息
    */
   export const putProfile = (data) => {
     return request({
       url: '/user/profile',
       method: 'PUT',
       data,
     })
   }
   
   /**
    * 数据本地的双向同步
    */
   const changeStoreUserInfo = (key, value) => {
     store.commit('user/setUserInfo', {
       ...store.getters.userInfo,
       [key]: value,
     })
   }
   
   /**
    * 修改个人信息
    */
   const loading = ref(false)
   const onChangeProfile = async () => {
     loading.value = true
     await putProfile(store.getters.userInfo)
     message('success', '用户信息修改成功')
     loading.value = false
   }
   ```

### 4.处理不保存时的同步问题

解决方案：拷贝一份`vuex`中的用户资料数据进行双向数据绑定，这样也不需要拆开`v-model`和重写事件处理函数

```js
/**
 * 数据本地的双向同步
 */
const userInfo = ref(store.getters.userInfo)
// const changeStoreUserInfo = (key, value) => {
//   store.commit('user/setUserInfo', {
//     ...store.getters.userInfo,
//     [key]: value,
//   })
// }

/**
 * 修改个人信息
 */
const loading = ref(false)
const onChangeProfile = async () => {
  loading.value = true
  await putProfile(userInfo.value)
  message('success', '用户信息修改成功')
  store.commit('user/setUserInfo', userInfo.value)
  loading.value = false
}
```

### 5.头像修改方案流程分析

对于该功能而言分为PC端和移动端两种情况，我们需要分别进行处理：

1. PC端：
   1. 点击更换头像
   2. 选择对应文件
   3. 通过Dialog通用组件展示图片剪裁
   4. 剪裁后图片上传
   5. 功能完成
2. 移动端：
   1. 点击更换头像
   2. 选择对应文件
   3. 通过popup通用组件展示图片剪裁
   4. 剪裁后图片上传
   5. 功能完成

### 6.通用组件：Dialog构建方案

1. 对于Dialog通用组件而言，可以参考confirm的组件的构建过程，它们两个构建方案非常类似，唯二不同的地方是：

   1. Dialog无需通过方法调用的形式展示
   2. Dialog的内容区可以渲染任意的内容

2. 创建`src/libs/dialog/index.vue`组件，定义`props`并进行代码健壮性校验，实现点击蒙版关闭组件展示：区别于`vueuse`中的`onClickOutside`，当处理复杂情况下的关闭组件展示时才使用`onClickOutside`

   ```vue
   <script setup>
   import { useVModel } from '@vueuse/core'
   const props = defineProps({
     // 控制开关
     modelValue: {
       type: Boolean,
       require: true,
     },
     // 标题
     title: {
       type: String,
     },
     // 取消按钮文本
     cancelText: {
       type: String,
       default: '取消',
     },
     // 确定按钮文本
     confirmText: {
       type: String,
       default: '确定',
     },
     // 取消按钮点击事件
     cancelHandler: {
       type: Function,
     },
     // 确定按钮点击事件
     confirmHandler: {
       type: Function,
     },
     // 关闭的回调
     close: {
       type: Function,
     },
   })
   defineEmits(['update:modelValue'])
   
   // 控制显示
   const isVisible = useVModel(props)
   /**
    * 关闭
    */
   const close = () => {
     isVisible.value = false
     if (props.close) {
       props.close()
     }
   }
   
   /**
    * 取消按钮点击事件
    */
   const onCancelClick = () => {
     if (props.cancelHandler) {
       props.cancelHandler()
     }
     close()
   }
   /**
    * 确定按钮点击事件
    */
   const onConfirmClick = () => {
     if (props.confirmHandler) {
       props.confirmHandler()
     }
     close()
   }
   </script>
   
   <template>
     <div>
       <!-- 蒙版 -->
       <transition
         name="fade"
         appear>
         <div
           v-if="isVisible"
           class="w-screen h-screen bg-zinc-900/80 z-40 fixed top-0 left-0"
           @click="close"></div>
       </transition>
       <!-- 内容区 -->
       <transition
         name="up"
         appear>
         <div
           v-if="isVisible"
           class="max-w-[80%] max-h-[80%] overflow-auto fixed top-[10%] left-[50%] translate-x-[-50%] z-50 px-2 py-1.5 rounded-sm border dark:border-zinc-600 cursor-pointer bg-white dark:bg-zinc-800 xl:min-w-[35%]">
           <!-- 标题 -->
           <div
             v-if="title"
             class="text-lg font-bold text-zinc-900 dark:text-zinc-200 mb-2">
             {{ title }}
           </div>
           <!-- 内容 -->
           <div class="text-base text-zinc-900 dark:text-zinc-200 mb-2">
             <slot></slot>
           </div>
           <!-- 按钮 -->
           <div
             v-if="cancelHandler || confirmHandler"
             class="flex justify-end">
             <m-button
               type="info"
               class="mr-2"
               @click="onCancelClick"
               >{{ cancelText }}</m-button
             >
             <m-button
               type="primary"
               @click="onConfirmClick"
               >{{ confirmText }}</m-button
             >
           </div>
         </div>
       </transition>
     </div>
   </template>
   
   <style scoped lang="scss">
   .fade-enter-active,
   .fade-leave-active {
     transition: all 0.3s;
   }
   .fade-enter-from,
   .fade-leave-to {
     opacity: 0;
   }
   //up动画
   .up-enter-active,
   .up-leave-active {
     transition: all 0.3s;
   }
   //准备进入和离开之后的状态
   .up-enter-from,
   .up-leave-to {
     opacity: 0;
     transform: translate3d(-50%, 100px, 0);
   }
   </style>
   ```


### 7.应用Dialog展示头像

1. 在`src/views/profile/index.vue`中，选中的图片会回调至`onSelectImgHandler`方法，同过`ref`对象` inputFileTarget.value.files[0]`能够获取到文件输入框中的文件；我们可以利用`URL.createObjectURL(imgFile)`获取对应的`blob`对象（`Binary Large Object`直译为二进制大对象，表示一个不可变、原始数据的类文件对象），通过这个blob对象的链接我们可以将图片展示出来

   ```js
   /**
    * 选中文件之后的回调
    */
   const onSelectImgHandler = () => {
     // 获取选中的文件
     const imgFile = inputFileTarget.value.files[0]
     // 生成blob对象
     const blob = URL.createObjectURL(imgFile)
     // 获取到blob(类文件对象)
     currentBlob.value = blob
     // 展示dialog
     isDialogVisible.value = true
   }
   ```

2. 新建`src\views\profile\components\change-avatar.vue`组件处理PC端和移动端下通用的图片剪裁逻辑

   ```vue
   <script>
   import { isMobileTerminal } from '@/utils/flexible'
   const EMITS_CLOSE = 'close'
   </script>
   
   <script setup>
   defineProps({
     blob: {
       type: String,
       required: true,
     },
   })
   const emits = defineEmits([EMITS_CLOSE])
   /**
    * 关闭按钮点击事件
    */
   const close = () => {
     emits(EMITS_CLOSE)
   }
   
   /**
    * 确定按钮点击事件
    */
   const onConfirmClick = () => {}
   </script>
   
   <template>
     <div class="overflow-auto flex flex-col items-center">
       <m-svg-icon
         v-if="isMobileTerminal"
         name="close"
         fill-class="fill-zinc-800 dark:fill-zinc-200"
         class="w-3 h-3 p-0.5 m-1 ml-auto"
         @click="close"></m-svg-icon>
   
       <img
         ref="imageTarget"
         :src="blob"
         alt="" />
   
       <m-button
         class="mt-4 w-[80%] xl:w-1/2"
         @click="onConfirmClick"
         >确定</m-button
       >
     </div>
   </template>
   
   <style scoped lang="scss"></style>
   ```

3. 处理当选择多次选择相同文件时，`input`框的`change`事件不会被触发的问题：在每次选择的图片不再被使用之后，清空掉`inputFileTarget`的value

   ```js
   /**
    * 当两次选择文件，是同一个文件的时候，input框的change事件不会被再次触发
    * 想要解决这个问题，就只需要在每次选择的图片不再被使用之后，清空掉inputFileTarget的value
    */
   watch(isDialogVisible, (val) => {
     if (!val) {
       inputFileTarget.value.value = null
     }
   })
   ```

### 8.头像剪裁构建方案--cropperjs

想要处理图片裁剪我们需要使用到`cropperjs`，它是一个`JavaScript`库，同时支持PC端和移动端，这个库跟`mockjs`冲突

1. 安装`cropperjs`：`npm install cropperjs`

2. 在`src\views\profile\components\change-avatar.vue`中导入

   ```js
   import 'cropperjs/dist/cropper.css'
   import Cropper from 'cropperjs'
   ```

3. 使用`new Cropper`进行初始化，区分PC端和移动的配置项

   ```js
   // pc端配置对象
   const pcOptions = {
     // 剪裁框固定纵横比：1:1
     aspectRatio: 1,
   }
   // 移动端配置对象
   const mobileOptions = {
     // 将裁剪框限制在画布的大小
     viewModel: 1,
     // 移动画布，剪裁框不动
     dragMode: 'move',
     // 剪裁框固定纵横比：1:1
     aspectRatio: 1,
     // 剪裁框不可移动
     cropBoxMovable: false,
     // 不可调整剪裁框大小
     cropBoxResizable: false,
   }
   
   /**
    * 图片裁剪
    */
   const imageTarget = ref(null)
   
   let cropper = null
   onMounted(() => {
     const image = document.getElementById('image')
     cropper = new Cropper(image, isMobileTerminal ? mobileOptions : pcOptions)
   })
   ```

4. 裁剪完成后生成`blob`地址

   ```js
   /**
    * 确定按钮点击事件
    */
   const onConfirmClick = () => {
     loading.value = true
     // 拿到裁剪后的图片
     cropper.getCroppedCanvas().toBolb((blob) => {
       // 裁剪后的blob地址
       URL.createObjectURL(blob)
     })
   }
   ```

### 9.阿里云OSS与腾讯云COS对象存储方案分析

通常情况下在企业开发中，图片或者文件的管理都会通过对象存储的方案进行，目前国内企业，使用的最多的云服务为阿里云，所有项目中以阿里云的OSS服务进行开发

腾讯云COS对象存储的使用：

1. 创建并配置存储桶(bucket)

2. 引入COS SDK（COS的包）：

   1. 下载依赖包：`npm i cos-js-sdk-v5 --save`

   2. 构建cos实例：初始化cos对象参数

      | 参数      | 描述                                                         |
      | :-------- | :----------------------------------------------------------- |
      | SecretId  | 开发者拥有的项目身份识别ID，用以身份认证，可在API秘钥管理页面获取 |
      | SecretKey | 开发者拥有的项目身份秘钥，可在API秘钥管理页面获取            |

      ```js
      import COS from 'cos-js-sdk-v5'
      cosnt cos =new COS({
          SecretId:'',
          SecretKey:''
      })
      ```

   3. 执行上传操作：

      ```js
      cos.putObject({
          Bucket:'',//存储桶
          Region:'',//存储桶所在地域
          Key:params.file.name//存储在桶里的对象键
          StorageClass:'STANDARD',
          Body:null,//上传的文件对象
          onProgress:function(progressData){}
      },function(err,data){
          //上传成功返回的数据，data.location为图片的地址
      })
      ```

### 10.使用临时凭证，上传剪裁图片到阿里云OSS

1. 使用`npm`安装`ali-oss`依赖包

   ```shell
   npm i --save ali-oss
   ```

2. 通过接口获取临时访问凭证，生成OSS实例：创建`src/utils/sts.js`模块，用来生成OSS实例

   ```js
   import OSS from 'ali-oss'
   import { getSts } from '@/api/sys'
   import { BUCKET, REGION } from '@/constants'
   
   export const getOSSClient = async () => {
     const res = await getSts()
     return new OSS({
       // bucket所在区域
       region: REGION,
       // 阿里云账号、RAM用户或者临时访问凭证STS的AccessKey ID
       accessKeyId: res.Credentials.AccessKeyId,
       // 阿里云账号、RAM用户或者临时访问凭证STS的AccessKey Secret
       accessKeySecret: res.Credentials.AccessKeySecret,
       // 从STS服务获取的安全令牌（SecurityToken）
       stsToken: res.Credentials.SecurityToken,
       // bucket
       bucket: BUCKET,
       // 刷新token，在token过期后自动调用
       refreshSTSToken: async () => {
         const res = await getSts()
         return {
           // id
           accessKeyId: res.Credentials.AccessKeyId,
           // secret
           accessKeySecret: res.Credentials.AccessKeySecret,
           // token
           stsToken: res.Credentials.SecurityToken,
         }
       },
       refreshSTSTokenInterval: 5 * 1000,
     })
   }
   ```

3. 利用`ossClient.put`方法，完成对应上传

   ```js
   /**
    * 进行OSS上传
    */
   let ossClient // 单例模式
   const putObjectToOSS = async (file) => {
     if (!ossClient) {
       ossClient = await getOSSClient()
     }
     try {
       const fileTypeArr = file.type.split('/')
       const filename = `${store.getters.userInfo.username}/${Date.now()}.${fileTypeArr[fileTypeArr.length - 1]}`
       // 1.存放的路径（包含名称）
       // 2.file
       const res = await ossClient.put(`images/${filename}`, file)
     } catch (e) {
       message('error', e)
     }
   }
   ```

4. 获取到OSS返回的图片访问url，更新本地和服务器的用户头像数据：图片文件存放在OSS中，而服务端保存的是图片的访问地址

   ```js
   /**
    * 上传新头像到服务器
    *  图片文件存放在OSS中，图片文件访问的URL存放在后端服务器中
    */
   const onChangeProfile = async (avatar) => {
     // 更新本地数据
     store.commit('user/setUserInfo', {
       ...store.getters.userInfo,
       avatar,
     })
     // 更新服务器数据（更新头像url）
     await putProfile(store.getters.userInfo)
     message('success', '用户头像修改成功')
     // 关闭loading
     loading.value = false
     close()
   }
   ```

### 11.登录鉴权解决方案：处理退出登录后，停留在profile页面的问题

目前退出登录之后，应用依然会停留在profile页面，这显然是不合理的，所以下面我们需要处理该问题，针对于该问题我们可以通过`vue-router`的全局前置守卫`beforeEach`来进行实现，在`src\premission.js`中定义鉴权策略：**当退出登录时，刷新页面路径，使重新跳转路由执行全局前置守卫的鉴权策略**

```js
import { message } from './libs'
import router from '@/router'
import store from '@/store'
/**
 * 使用router的全局前置守卫beforeEach处理需要登录页面的访问权限
 * return false表示取消当前的跳转
 * return 路由地址则跳转到对应的地址
 * return undefined或true表示跳转有效
 */
router.beforeEach((to) => {
  // 无需登录的页面访问
  if (!to.meta.user) {
    return true
  }
  // 已登录
  if (store.getters.token) {
    return true
  }
  // 需要登录才能访问的页面，并且用户还没登录
  message('warn', '登录失效，请重新登录')
  return '/'
})
```

## 15.移动端路由切换解决方案--虚拟任务栈让你的H5像APP一样丝滑

### 1.通用组件：trigger-menu和trigger-menu-item构建方案

1. `trigger-menu`：对于它而言，只起到一个包裹容器的作用，所以我们只需要提供一个对应的插槽即可

   ```vue
   <script setup></script>
   
   <template>
     <div class="min-w[180px] bg-white dark:bg-zinc-800 rounded-full shadow flex items-center justify-between px-2 py-1">
       <slot></slot>
     </div>
   </template>
   
   <style scoped lang="scss"></style>
   ```

2. `trigger-menu-item`：起到了对应的展示作用，展示包括了`icon`和文字，所以内部英国存在`svg-icon`用来展示图片，存在一个插槽用来展示文字

   ```vue
   <script setup>
   import { useRouter } from 'vue-router'
   const props = defineProps({
     icon: {
       type: String,
       required: true,
     },
     iconClass: {
       type: String,
     },
     textClass: {
       type: String,
       default: 'text-zinc-900 dark:text-zinc-200',
     },
     to: {
       type: String,
     },
   })
   const router = useRouter()
   const onItemClick = () => {
     if (!props.to) {
       return null
     }
     router.push(props.to)
   }
   </script>
   
   <template>
     <div
       class="w-5 flex flex-col items-center justify-center col mx-0.5"
       @click="onItemClick">
       <m-svg-icon
         :name="icon"
         :fill-class="iconClass"
         class="w-2 h-2"></m-svg-icon>
       <p
         class="text-sm mt-0.5"
         :class="textClass">
         <slot></slot>
       </p>
     </div>
   </template>
   
   <style scoped lang="scss"></style>
   ```

### 2.前台业务下的H5的应用场景

通常情况下我们说起移动端项目，指的一般是两种：

1. 原生APP
2. H5网页

H5网页应用到手机端的时候，通常也有两种运行的形式 ：

1. 直接在手机端浏览器中运行：这种使用情况相对较少，在这种情况下，用户明显的知道这就是一个网页
2. 在原生组件`WebView`中运行（混合开发）：通常会被嵌入到APP之中，这种使用情况比较多，在这种情况下，用户会认为该内容为APP的一部分，不会把它当作网页，而是把它当作原生APP，那么一旦用户把它作为APP来进行衡量，那么就会对这块应用有更高的要求

因此，为了给用户提供像原生APP那样更好的体验，我们需要优化路由跳转过渡动画，路由切换回退不再发生网络请求，路由切换回退记录用户浏览位置等操作

### 3.通用组件：transition-router-view构建方案分析与虚拟任务栈

1. 过渡动画：通过`vue-router`提供的过渡动效来实现，在这个功能的官方描述中，主要包含了三个对应的组件：

   ```vue
   <!--路由出口-->
   <router-view v-slot="{ Component }">
       <!--动画组件-->
       <transition name="fade">
           <!--动态组件-->
           <component :is="Component" />
        </transition>
   </router-view>
   ```

2. 组件缓存：通过虚拟任务栈配合`keep-alive`中的`include`实现

   1. 通过`keep-alive`组件在动态切换组件时缓存组件实例

   ```vue
   <!-- 使用router-view时，对应的视图组件被插进视图组件中，通过作用域插槽获取内部组件的信息并解构出Component，然后在component这个特殊元素中展示 -->
   <!--路由出口-->
   <router-view v-slot="{ Component }">
       <!--动画组件-->
       <transition name="fade">
           <!--缓存组件-->
           <keep-alive>
              <!--动态组件-->
              <component :is="Component" />
           </keep-alive>
       </transition>
   </router-view>
   ```

   2. 虚拟任务栈：
      1. 我们把组件的进入和退出流程，比作一个栈，那么只有进入到栈中的组件才需要被缓存，这就像Android 中的任务栈概念一样
      2. 在我们的移动端组件处理中，我们同样期望有一个这样的栈来维护我们的组件进入和退出流程，所以我们把这样的一套流程，称作虚拟任务栈
      3. 对于这样的一个虚拟任务栈而言，我们可以通过数组来进行维护，因为数组和栈的概念相同都是：先进后出的流程

### 4.通用组件：transition-router-view构建方案之过渡动效

1. 首先区分需要过渡动效的场景：在`app.js`中保存路由跳转类型`routerType`并添加修改`routerType`的方法，然后再`getters`中对PC端和移动端路由跳转类型进行处理

   ```js
     // 路由跳转方式
     routerType: (state) => {
       // 在PC端下，永远没有跳转动画
       if (!isMobileTerminal) {
         return 'none'
       }
       return state.app.routerType
     },
   ```

2. 在路由跳转之前修改`vuex`中的`routerType`值，`router.push`时为`'push'`，`router.back`时为`'back'`

   ```js
   /**
    * 登录按钮点击事件
    */
   const onToLogin = () => {
     // 移动端下跳转的类型
     store.commit('app/changeRouterType', 'push')
     router.push('/login')
   }
   ```

3. 使用`m-transition-router-view`替换原本的`router-view`

   ```vue
    <m-transition-router-view
         :router-type="$store.getters.routerType"
         main-component-name="home"></m-transition-router-view>
   ```

### 5.通用组件：处理过渡动效展示样式错误的问题

当在切换到我的页面时，首页视图盖住了我的页面，导致展示效果不好，解决方案：**为`component`元素添加动态的样式，当动画开始时添加样式，当动画结束后移出样式**

```vue
/**
 * 处理动画状态
 */
const isAnimation = ref(false)
const beforeEnter = () => {
  isAnimation.value = true
}
const afterLeave = () => {
  isAnimation.value = false
}
</script>

<template>
  <!-- 使用router-view时，对应的视图组件被插进视图组件中，通过作用域插槽获取内部组件的信息并解构出Component，然后在component这个特殊元素中展示 -->
  <router-view v-slot="{ Component }">
    <transition
      :name="transitionName"
      @before-enter="beforeEnter"
      @after-leave="afterLeave">
      <keep-alive>
        <component
          :is="Component"
          :class="{ 'fixed top-0 left-0 w-screen z-50': isAnimation }"></component>
      </keep-alive>
    </transition>
  </router-view>
</template>
```

### 6.通用组件：虚拟任务栈处理

目前的`keep-alive`组件会对所有路由组件都进行缓存，但我们只期望对任务栈中的组件进行缓存：

1. 使用数组模拟任务栈实现`keep-alive`组件的`include`管理
2. `keep-alive`组件的`include`管理的是路由的名称，所以在缓存组件时，组件的路由名称应该与组件的名称相同，注意在保存时组件名称变成了大写，对应的路由名称以及传入的` main-component-name="Home"`同样需要改为大写
3. 使用` :key="$route.fullPath"`来限定动态路由不执行过渡动效和组件缓存

```vue
// 虚拟任务栈的数组，用它来表示栈操作
const virtualTaskStack = ref([props.mainComponentName])
/**
 * 清空栈
 */
const clearTask = () => {
  virtualTaskStack.value = [props.mainComponentName]
}
/**
 *  router的前置守卫
 *  在路由跳转之间，指定路由的过渡动画名称
 */
router.beforeEach((to, from) => {
  // 定义动画名称
  transitionName.value = props.routerType
  // 根据动画名称执行入栈或者出栈操作：push、back

  if (props.routerType === ROUTER_TYPE_PUSH) {
    // 入栈
    virtualTaskStack.value.push(to.name)
  } else if (props.routerType === ROUTER_TYPE_BACK) {
    // 出栈
    virtualTaskStack.value.pop()
  }
  // 当进入首页之后
  if (to.name === props.mainComponentName) {
    clearTask()
  }
})


<template>
  <!-- 使用router-view时，对应的视图组件被插进视图组件中，通过作用域插槽获取内部组件的信息并解构出Component，然后在component这个特殊元素中展示 -->
  <router-view v-slot="{ Component }">
    <transition
      :name="transitionName"
      @before-enter="beforeEnter"
      @after-leave="afterLeave">
      <keep-alive :include="virtualTaskStack">
        <component
          :is="Component"
          :key="$route.fullPath"
          :class="{ 'fixed top-0 left-0 w-screen z-50': isAnimation }"></component>
      </keep-alive>
    </transition>
  </router-view>
</template>
```

### 7.通用组件：记录页面滚动位置--vueuse-useScroll

`keep-alive`组件只能够帮助我们缓存组件，但是不能够记录页面的滚动位置，**这里我们使用vueuse提供的`useScroll`方法获取滚动位置并记录，然后在缓存后的组件再次被激活时为容器的滚动距离赋值**

```js
/**
 * 记录滚动
 */
const containerTarget = ref(null)
const { y: containerTargetScrollY } = useScroll(containerTarget)
// 被缓存的组件再次可见时会回到onActivated方法
onActivated(() => {
  if (!containerTarget.value) {
    return null
  }
  containerTarget.value.scrollTop = containerTargetScrollY.value
})
```

## 16.VIP通用业务构建方案--处理VIP服务

### 1.VIP服务业务构建

1. 分别在PC端和移动端下添加二级路由

   ```js
   {
           path: '/member',
           name: 'member',
           component: () => import('@/views/member/index.vue'),
           // 标记当前的页面只有用户登录之后才可以进入
           meta: {
             user: true,
           },
    },
   ```

2. 新建`src\api\mock\pay.js`并添加获取VIP支付数据的请求

   ```js
   import request from '@/utils/mockRequest.js'
   
   /**
    * 获取VIP支付数据
    */
   export const getVipPayList = () => {
     return request({
       url: '/user/vip/pay/list',
     })
   }
   ```

3. 新建`src\views\member\components\pay-menu-item.vue`组件

   ```vue
   <script>
   const EMITS_CLICK = 'click'
   </script>
   
   <script setup>
   const props = defineProps({
     // 数据源
     data: {
       type: Object,
       required: true,
     },
     // 是否热选
     hot: {
       type: Boolean,
     },
     // 是否被选中
     select: {
       type: Boolean,
       default: false,
     },
   })
   
   const emits = defineEmits([EMITS_CLICK])
   
   const onItemClick = () => {
     emits(EMITS_CLICK, props.data)
   }
   </script>
   
   <template>
     <!-- 单个的支付项 -->
     <div
       class="flex-none flex flex-col items-center w-[100px] mt-2 mr-2 py-3 border-[1px] hover:bg-orange-50 hover:border-orange-300 rounded-md relative cursor-pointer xl:w-[150px] xl:py-2"
       :class="[
         select
           ? 'bg-orange-50 dark:bg-orange-50/10 border-orange-300 '
           : 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-500',
       ]"
       @click="onItemClick">
       <!-- 标题 -->
       <p
         class="text-base"
         :class="[select ? 'text-yellow-800 dark:text-orange-300' : 'text-yellow-800 dark:text-zinc-300']">
         {{ data.title }}
       </p>
       <!-- 价格 -->
       <p
         class="text-[32px] tracking-tighter font-sans font-bold"
         :class="[select ? 'text-yellow-800 dark:text-orange-300' : 'text-yellow-800 dark:text-zinc-300']">
         <span class="text-base">￥</span>
         {{ data.price }}
       </p>
       <!-- 原价 -->
       <p class="text-xs text-yellow-500 line-through">￥{{ data.oldPrice }}</p>
       <!-- 热销 -->
       <div
         v-if="hot"
         class="absolute right-[-1px] top-[-12px] h-[22px] w-[48px] leading-[22px] text-center text-yellow-700 bg-gradient-to-r from-orange-300 to-orange-100 text-[12px] rounded-tr-[10px] rounded-bl-[10px]">
         热销
       </div>
     </div>
   </template>
   ```

4. 新建`src\views\member\index.vue`组件并处理事件：在事件处理函数中，默认会传入`$event`事件对象，如果在`v-for`指定中使用默认传入的是每个`item`对象

   ```vue
   <script setup>
   import { ref } from 'vue'
   import { useRouter } from 'vue-router'
   import { useStore } from 'vuex'
   import payMenuItemVue from './components/pay-menu-item.vue'
   import { isMobileTerminal } from '@/utils/flexible'
   import { getVipPayList } from '@/api/mock/pay'
   
   const router = useRouter()
   const store = useStore()
   // 所有支付数据
   const vipPayListData = ref([])
   // 当前选中的支付数据
   const currentPayListData = ref({})
   /**
    * 获取支付数据的方法
    */
   const getVipPayListData = async () => {
     const res = await getVipPayList()
     vipPayListData.value = res
     currentPayListData.value = vipPayListData.value[0]
   }
   /**
    * 移动端navbar左侧按钮点击事件
    */
   const onNavbarLeftClick = () => {
     store.commit('app/changeRouterType', 'back')
     router.back()
   }
   
   /**
    * item点击事件
    */
   const onChangeCurrentPay = (item) => {
     currentPayListData.value = item
   }
   getVipPayListData()
   </script>
   
   <template>
     <div class="h-full bg-zinc-200 dark:bg-zinc-800 duration-300 xl:pt-1">
       <div
         class="max-w-screen-lg mx-auto bg-white dark:bg-zinc-900 duration-300 xl:rounded-sm xl:border-zinc-200 xl:dark:border-zinc-600 xl:border-[1px] xl:px-4">
         <!-- 移动端navbar处理 -->
         <m-navbar
           v-if="isMobileTerminal"
           sticky
           :click-left="onNavbarLeftClick">
           精选会员
         </m-navbar>
         <div class="py-2 px-1">
           <h2 class="text-center text-[34px] font-bold tracking-widest text-yellow-600">精选VIP</h2>
           <p class="text-center text-lg text-yellow-500">升级精选VIP，畅享所有内容</p>
           <div
             class="flex justify-between mt-5 overflow-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
             <pay-menu-item-vue
               v-for="item in vipPayListData"
               :key="item.id"
               :hot="item.isHot"
               :select="item.id === currentPayListData.id"
               :data="item"
               @click="onChangeCurrentPay">
             </pay-menu-item-vue>
           </div>
           <p class="mt-1 text-sm text-zinc-500">
             {{ currentPayListData.desc }}
           </p>
           <!-- 支付 -->
         </div>
       </div>
     </div>
   </template>
   
   <style scoped lang="scss"></style>
   ```

### 2.通用组件：倒计时构建方案--dayjs

1. 通过监听传入的`time`时间戳进行一次倒计时时长的拷贝，并使用拷贝后的数据`duration`进行对应的倒计时操作，使用`setInterval`开启定时器使时间戳减1000毫秒，并在倒计时结束或用户离开页面时清除定时器

   ```vue
   <script>
   import { computed, onUnmounted, ref, watch } from 'vue'
   import dayjs from './utils.js'
   // 倒计时结束
   const EMITS_FINISH = 'finish'
   // 倒计时改变
   const EMITS_CHANGE = 'change'
   // 倒计时的时间间隔
   const INTERVAL_COUNT = 1000
   // 倒计时改变
   </script>
   
   <script setup>
   const props = defineProps({
     // 毫秒时间-时间戳
     time: {
       type: Number,
       require: true,
     },
     // 遵循dayjs format标准
     format: {
       type: String,
       default: 'HH:mm:ss',
     },
   })
   
   const emits = defineEmits([EMITS_FINISH, EMITS_CHANGE])
   
   // 倒计时的时长
   const duration = ref(0)
   
   /**
    * 开始倒计时
    */
   let interval
   const start = () => {
     close()
     interval = setInterval(() => {
       durationFn()
     }, INTERVAL_COUNT)
   }
   /**
    * 倒计时的执行行为
    */
   const durationFn = () => {
     duration.value -= INTERVAL_COUNT
     emits(EMITS_CHANGE)
     // 监听结束的行为
     if (duration.value <= 0) {
       duration.value = 0
       emits(EMITS_FINISH)
       close()
     }
   }
   /**
    * 倒计时结束
    */
   const close = () => {
     interval && clearInterval(interval)
   }
   
   /**
    * 监听传入的时间戳以开始倒计时
    */
   watch(
     () => props.time,
     (val) => {
       duration.value = val
       start()
     },
     {
       immediate: true,
     },
   )
   
   /**
    * 组件销毁时，清理定时器
    */
   onUnmounted(() => {
     close()
   })
   </script>
   
   <template>
     <div>
       <slot>
         <p class="text-sm">{{ showTime }}</p>
       </slot>
     </div>
   </template>
   
   <style scoped lang="scss"></style>
   ```

2. 使用`dayjs`处理时间展示：

   1. 使用`npm`安装`dayjs`：`npm i --save dayjs`

   2. 新建`utils.js`对初始化`dayjs`实例：

      1. 处理中文国际化
      2. 将时间戳转化为时长

      ```js
      import dayjs from 'dayjs'
      import 'dayjs/locale/zh-cn'
      import duration from 'dayjs/plugin/duration'
      
      // 处理中文国际化
      dayjs.locale('zh')
      // 插件：使用duration来获取时间戳对应的时长而不是时间
      dayjs.extend(duration)
      
      export default dayjs
      ```

   3. 传入时间戳并展示时间

      ```js
      /**
       * 显示时间格式
       */
      const showTime = computed(() => {
        return dayjs.duration(duration.value).format(props.format)
      })
      ```

### 3.支付模块：PC端支付样式处理

1. 新建`src\views\member\components\payment\pc-payment\index.vue`处理PC端的支付

   ```vue
   <script setup>
   import DiscountsVue from '../discounts.vue'
   </script>
   
   <template>
     <div>
       <!-- 特惠提示 -->
       <DiscountsVue></DiscountsVue>
       <div
         class="flex flex-col items-center justify-evenly border-zinc-200 dark:border-zinc-600 border-[1px] py-3 rounded-md mt-1">
         <p class="text-[32px] text-orange-600 font-sans">
           <span class="text-base text-zinc-900 dark:text-zinc-200">支付金额：</span>
           <span class="text-lg mr-[-12px]">￥</span>
           19
         </p>
   
         <div class="flex mt-3">
           <!-- 支付宝支付 -->
           <div
             class="border border-zinc-200 dark:border-zinc-600 rounded-sm w-[220px] h-[60px] flex items-center pl-2 cursor-pointer duration-200 hover:bg-zinc-50 hover:dark:bg-zinc-800">
             <img
               class="w-4 h-4"
               src="@/assets/images/alipay.png"
               alt="" />
             <p class="text-xl ml-1 text-zinc-800 dark:text-zinc-200">支付宝</p>
           </div>
         </div>
       </div>
     </div>
   </template>
   
   <style scoped></style>
   ```

2. 新建`src\views\member\components\payment\discounts.vue`抽离PC端和移动端通用的特惠提示模块

   ```vue
   <script setup>
   import { ref } from 'vue'
   // 倒计时是否结束
   const isCountDownFinish = ref(false)
   </script>
   
   <template>
     <div
       v-if="!isCountDownFinish"
       class="flex justify-center items-center py-0.5 bg-orange-100 border-orange-300 border-t xl:border xl:rounded-sm">
       <m-svg-icon
         name="countdown"
         class="w-1.5 h-1.5 mr-1"
         fill-class="fill-red-600"></m-svg-icon>
       <p class="text-xs text-red-600 font-bold">
         限时特惠 | 距离优惠结束仅剩
         <m-count-down
           :time="52 * 60 * 1000"
           class="inline-block"
           @finish="isCountDownFinish = true"></m-count-down>
       </p>
     </div>
   </template>
   
   <style scoped></style>
   ```

### 4.支付模块：移动端支付样式处理

1. 处理移动端支付基本展示

   ```vue
   <script setup>
   import { ref } from 'vue'
   import discountsVue from '../discounts.vue'
   import mobilePaySelectVue from './mobile-pay-select.vue'
   
   const isOpenPopup = ref(false)
   const onConfirmClick = () => {
     isOpenPopup.value = !isOpenPopup.value
   }
   </script>
   
   <script>
   export default {
     name: 'Index',
   }
   </script>
   
   <template>
     <div class="fixed left-0 bottom-0 w-screen text-center bg-white dark:bg-zinc-800 xl:hidden">
       <!-- 特惠提示 -->
       <discounts-vue></discounts-vue>
       <!-- 支付 -->
       <div class="flex justify-between text-xs px-1 py-0.5">
         <div class="text-left text-zinc-900 dark:text-zinc-200">
           <p class="">
             券后合计：<span class="text-red-600 text-[16px] font-sans font-medium">￥</span
             ><span class="text-red-600 text-[22px] font-sans font-medium">9</span>
           </p>
           <p class="text-red-600">优惠券：限时立减 ￥10</p>
         </div>
         <m-button
           class="w-[120px]"
           :is-active-anim="false"
           @click="onConfirmClick"
           >立即开通</m-button
         >
       </div>
       <m-popup
         v-model="isOpenPopup"
         class="rounded">
         <mobile-pay-select-vue></mobile-pay-select-vue>
       </m-popup>
     </div>
   </template>
   
   <style scoped></style>
   
   ```

2. 点击支付按钮弹出框选择支付方式：出现了一个问题`const emits = defineEmits([EMITS_CLICK])`，在粗心不使用数组形式的时候，触发点击事件执行了两次的思考：**vue能够在组件上绑定原生DOM事件因此能够触发，在不使用数组形式，vue应该是认为这是两个不同的事件，因此触发了两次**

   ```vue
   <script setup></script>
   
   <template>
     <div class="py-2 h-[80vh] flex flex-col">
       <h2 class="text-xl text-zinc-900 dark:text-zinc-200 font-bold mb-2 px-1">选择支付方式</h2>
       <!-- 支付宝 -->
       <div
         class="flex items-center px-2 py-2 border-b border-b-zinc-200 dark:border-b-zinc-600 active:bg-zinc-200 dark:active:bg-zinc-900">
         <img
           class="w-4 h-4"
           src="@/assets/images/alipay.png"
           alt="" />
         <p class="text-xl ml-1 text-zinc-800 dark:text-zinc-200">支付宝</p>
       </div>
     </div>
   </template>
   
   <style scoped></style>
   ```

## 17.登录通用解决方案--第三方登录处理

### 1.第三方平台登录解决方案流程大解析

1. 点击第三方登录按钮：执行window.open方法，打开一个第三方指定的URL窗口，该地址会指向第三方登录的URL，并且由第三方提供一个对应的二维码
2. 弹出一个小窗口，展示对应二维码：此处展示的二维码，即为上一步中第三方提供的二维码
3. 手机打开对应的APP进行扫码之后，会跳转到同意界面，同时浏览器端也会显示扫码成功：在第三方中会一直对该页面进行轮询，配合第三方APP来判断是否扫码成功
4. 手机端操作同意登录之后，会出现两种情况：在APP中同意之后，第三方会进行对应的跳转，跳转地址为你指定的地址，在该地址中可以获取到第三方的用户信息，该信息即为第三方登录时要获取到的关键数据
5. 至此，第三方操作完成，接下来需要进行本平台的登录判定
   1. 该注册指的是第三方用户是否在本平台中进行了注册
   2. 因为在之前的所有操作中，我们拿到的是第三方的用户信息
   3. 该信息可以帮助我们直接显示对应的用户名和头像，但是因为不包含关键信息（手机号、用户名、密码），所以我们无法使用该信息帮助用户直接登录
   4. 所以我们需要判断当前用户是否在自动的平台中完成了注册
      1. 当前用户已注册：直接登录
      2. 当前用户未注册：执行注册功能

### 2.QQ登录对接流程：获取QQ用户信息

1. 在`index.html`中，导入`QQ JS SDK`

   ```html
    <script
         type="text/javascript"
         charset="utf-8"
         src="https://connect.qq.com/qc_jssdk.js"
         data-appid="101998494"
         data-redirecturi="https://imooc-front.lgdsunday.club/login"></script>
   ```

2. 新建`src\views\login-register\login\qq-login.vue`组件，使用`window.open()`打开QQ登录二维码视窗，使用`QC.Login()`同样可以打开QQ登录二维码视窗，这里使用`window.open()`更灵活

   ```js
   /**
    * 处理QQ登录视窗
    */
   const openQQWindow = () => {
     /**
      * 1.打开的url
      * 2.打开方式或窗口的名称
      * 3.打开的窗口的属性
      * 4.是否进入浏览器堆栈管理
      */
     window.open(
       QQ_LOGIN_URL,
       'oauth2Login_10609',
       'left=250,height=525,width=585,tollbar=no,menubar=no,scrollbars=no,status=no,location=yes,resizable=yes',
     )
   }
   ```

3. 在`onMounted()`中使用QQ登录的主要目的是绑定登录成功之后的回调函数，注意在扫码登录后，回调的地址为部署后的线上地址，所以后续的调试必须在线上进行，可以部署到线上的测试环境中进行下一步调试

   ```js
   // 点击进行QQ登录，同样可以打开登录视窗，可以传入登录之后的回调
   onMounted(() => {
     QC.Login(
       {
         btnId: 'qqLoginBtn',
       },
       // 点击确认登录即登录成功之后的回调，会在登录之后重定向的页面中执行
       // QQ登录存在缓存，登录成功一次之后，下次进入页面会自动重新登录
       (data, opts) => {
         // 注销登录，防止下一次打开页面直接展示上一次的用户信息
         QC.Login.signOut()
         // 拿到QQ用户的唯一标识，通过这个标识来判断当前用户是否已经注册了
         const accessToken = /access_token=((.*))&expires_in/.exec(window.location.hash)[1]
         // 拼接获取到的数据对象
         const oauthObj = {
           nickname: data.nickname,
           headimgurl: data.figureurl_qq_2,
           accessToken,
         }
         broadcast.send(oauthObj)
         window.close()
       },
     )
   })
   ```

### 3.QQ登录对接流程：跨页面信息传输

想要实现跨页面信息传输，通常有两种方式：

1. `BroadcastChannel`：直译为广播频道，允许同源的不同浏览器窗口，`Tab`页，`frame`或者`iframe`下的不同文档之间相互通信，但是会存在兼容性问题
2. `localStorage+window.onstorage`：通过`localStorage`进行同源的数据传输，用来处理`BroadcastChannel`不兼容的浏览器

依据以上两个API，我们可以实现对应的通讯模块：新建`src\views\login-register\login\broadcast.js`，在`QC.Login()`回调中发送消息，在登录页面中监听消息

```js
// 频道名
const LOGIN_SUCCESS_CHANNEL = 'LOGIN_SUCCESS_CHANNEL'

let broadcastChannel = null
if (window.BroadcastChannel) {
  broadcastChannel = new BroadcastChannel(LOGIN_SUCCESS_CHANNEL)
}
/**
 * 等待回调
 */
const wait = () => {
  return new Promise((resolve) => {
    if (broadcastChannel) {
      broadcastChannel.onmessage = (event) => {
        resolve(event.data)
      }
    } else {
      window.onstorage = (event) => {
        if (event.key === LOGIN_SUCCESS_CHANNEL) {
          resolve(JSON.parse(event.newValue))
        }
      }
    }
  })
}
/**
 * 发送消息
 */
const send = (data) => {
  if (broadcastChannel) {
    broadcastChannel.postMessage(data)
  } else {
    localStorage.setItem(LOGIN_SUCCESS_CHANNEL, JSON.stringify(data))
  }
}
/**
 * 销毁
 */
const clear = () => {
  if (broadcastChannel) {
    broadcastChannel.close()
    broadcastChannel = null
  } else {
    localStorage.removeItem(LOGIN_SUCCESS_CHANNEL)
  }
}

export default {
  wait,
  send,
  clear,
}
```

### 4.QQ登录对接流程：认证是否已注册，完成QQ登录流程

1. `import { useStore } from 'vuex'`与`import store from '@/store'`的区别：钩子函数 的 useStore 在vue 组件的setup 中使用，别的地方不能用；直接使用实例可以在别的场景和文件中使用，`vue-router`也如此
2. 使用`vuex`中`user.js`模块中的登录接口将`oauthData`用户信息和认证服务器的token传给后端进行判断：
   1. 如果返回的code码为204，则表示用户尚未关联注册，此时需要将`oauthData`以路由传参的方式传递并跳转到注册页面进行注册操作
   2. 如果返回的code码不为204，表示用户已注册，此时直接跳转到首页即可

```js
import store from '@/store'
import { LOGIN_TYPE_OAUTH_NO_REGISTER_CODE } from '@/constants'
import { message } from '@/libs'
import router from '@/router'
/**
 * 第三方登录统一处理方法
 * @param {*} oauthType 登录方式
 * @param {*} oauthData 第三方数据
 */
export const oauthLogin = async (oauthType, oauthData) => {
  // 触发登录操作，根据登录操作的返回来判断用户是否已经注册了
  // 1.登录
  const code = await store.dispatch('user/login', {
    loginType: oauthType,
    ...oauthData,
  })
  // 2.是否注册
  if (code === LOGIN_TYPE_OAUTH_NO_REGISTER_CODE) {
    message('success', `欢迎您${oauthData.nickname}，请创建您的账号`, 6000)
    router.push({
      path: '/register',
      query: {
        reqType: oauthType,
        ...oauthData,
      },
    })
    return
  }
  // 3.用户已注册
  router.push('/')
}
```

### 5.移动端QQ登录对接：触发吊起操作，完成移动端QQ登录

1. 在移动端中进行访问时，出现了一些问题，原因是：对于移动端而言，通过移动端触发QQ登录会展示三个页面，原页面，QQ吊起页面、回调页面，并且移动端一个页面展示整屏内容，我们不用跨页面数据传输，可以直接传递数据，且无法直接通过`window.close()`关闭

   ```js
   onMounted(() => {
     QC.Login(
       {
         btnId: 'qqLoginBtn',
       },
       // 点击确认登录即登录成功之后的回调，会在登录之后重定向的页面中执行
       // QQ登录存在缓存，登录成功一次之后，下次进入页面会自动重新登录
       (data, opts) => {
         // 注销登录，防止下一次打开页面直接展示上一次的用户信息
         QC.Login.signOut()
         // 拿到QQ用户的唯一标识，通过这个标识来判断当前用户是否已经注册了
         const accessToken = /access_token=((.*))&expires_in/.exec(window.location.hash)[1]
         // 拼接获取到的数据对象
         const oauthObj = {
           nickname: data.nickname,
           headimgurl: data.figureurl_qq_2,
           accessToken,
         }
         broadcast.send(oauthObj)
   
         // 移动端下没有窗口的概念，我们不用跨页面数据传输，可以直接传递数据
         oauthLogin(LOGIN_TYPE_QQ, oauthobj)
         // 在pc端下，关闭第三方窗口
         window.close()
       },
     )
   ```

2. 注意：此时不可通过`isMobileTerminal`来进行PC端和移动端的区别判断，因为此时为窗口模式，宽度将小于1280，可以通过`navgator.userAgent`来判断用户设备是否为移动端设备

   ```js
   /**
    * 实际开发通过正则判断用户代理可以更准确的判断移动端设备
    */
   export const isMobileTerminal = computed(() => {
     return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
       navigator.userAgent
     )
   })
   ```

### 6.对接微信扫码登录

1. 通过微信登录前置数据获取接口，获取登录数据（比如APP ID），根据获取到的数据，拼接得到open url地址，打开该地址，展示微信登录二维码

   1. 新建获取微信登录前置数据的接口

      ```js
      /**
       * 微信登录前置数据获取
       */
      export const getWXLoginData = () => {
        return request({
          url: '/sys/wxlogin/data',
        })
      }
      ```

   2. 获取到微信登录前置数据后，使用`window.open()`打开二维码窗口

      ```js
        // 1.获取微信前置登录数据
        const { appId, appSecret, redirectUri, scope, state } = await getWXLoginData()
        // 2.open url
        window.open(
          `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`,
          '',
          'left=270,top=200,height=525,width=585,tollbar=no,menubar=no,scrollbars=no,status=no,location=yes,resizable=yes',
        )
      ```

2. 移动端微信扫码确认登录后，从当前窗口解析`window.location.search`得到用户的`code`数据，并根据`appId、appSecret、code`通过接口获取用户的`access_token`，再根据`access_token`获取用户信息，拿到用户信息后触发`oauthLogin`方法

   1. 解析窗口的查询参数并使用正则获取用户的`code`数据，并将`code`发送给登录页面

      ```js
      /**
       * 微信登录成功之后，数据解析
       */
      if (window.location.search) {
        const code = /code=((.*))&state/.exec(window.location.search)[1]
        if (code) {
          broadcast.send({
            code,
          })
          // 窗口关闭
          window.close()
        }
      }
      ```

   2. 登录页面拿到code等数据之后发送请求获取`access_token和openid`

      ```js
      /**
       * 微信登录获取access_token
       */
      export const getWXLoginToken = (appid, secret, code) => {
        return request({
          url: '/sys/wxlogin/access_token',
          params: {
            appid,
            secret,
            code,
          },
        })
      }
      ```

   3. 使用`access_token和openid`发起请求获取用户信息

      ```js
      /**
       * 微信登录获取用户信息
       */
      export const getWXLoginUserInfo = (access_token, openid) => {
        return request({
          url: '/sys/wxlogin/userinfo',
          params: {
            access_token,
            openid,
          },
        })
      }
      ```

## 18.用户反馈解决方案--兔小巢构建反馈功能

1. 登录兔小巢创建项目，首先需要获取该产品的url，一般由`https://support.qq.com/product/+产品ID`组成

2. 当用户点击立即反馈时，跳转到对应的兔小巢反馈地址即可

   ```js
   /**
    * 用户反馈
    */
   const onToFeedback = () => {
     window.open(FEEDBACK_URL, '_blank')
   }
   ```

## 19.分享通用解决方案--第三方平台分享

### 1.第三方分享整体方案分析

1. 对于微信分享而言，主要是聊天分析和朋友圈分享，这两种分享方式，本质上指的都是：把一段信息或图片，发送到聊天或朋友圈中，但是对于微信而言：它不支持普通网站的分享，仅支持：APP或微信公众号、企业号、服务号的分享内容
2. 微博的分享原理与微信一样：把一段信息或图片，发送到微博中

### 2.微博分享对接实现

1. 在`index.html`中，导入微博分享的js

   ```html
    <script
         src="https://tjs.sjs.sinajs.cn/open/api/js/wb.js"
         charset="utf-8"
         type="text/javascript"></script>
   ```

2. 在`src\constants\index.js`定义微博的Key和UID

   ```js
   // 微博APP Key
   export const WEI_BO_APP_KEY = '3454329089'
   // 微博用户的 UID
   export const WEI_BO_UID = '5984245953'
   ```

3. 创建`src/utils/share.js`分享模块

   ```js
   import { WEI_BO_APP_KEY, WEI_BO_UID } from '@/constants'
   /**
    * 微博分享
    * @param {*} imgUrl 分享的图片
    * @param {*} path 网页的链接
    */
   export const weiboShare = (imgUrl, path) => {
     window.open(
       `https://service.weibo.com/share/share.php?appkey=${WEI_BO_APP_KEY}&relateUid=${WEI_BO_UID}&pic=${imgUrl}&title=这张图不错哦，给大家分享一下 ${path}`,
       '_blank',
     )
   }
   ```

4. 在`item.vue`中为分享按钮绑定点击事件并添加事件处理函数

   ```js
   /**
    * 分享按钮点击处理
    */
   const onShareClick = () => {
     weiboShare(props.data.photo, `https://imooc-front.lgdsunday.club/pins/${props.data.id}`)
   }
   ```

## 20.支付通用解决方案--第三方平台支付处理

### 1.支付宝平台大解析

整个支付宝开放平台的注册分为5个大步骤，分别为：

1. 注册认证支付宝企业账号（`个人无法使用支付功能`）
2. 入驻开放平台
3. 创建应用
4. 关联商家号
5. 上线应用

### 2.支付宝支付功能技术对接

1. 想要完成支付宝支付功能，需要我们对接两个接口，在`src\api\mock\pay.js`中：

   ```js
   /**
    * 支付宝下单
    */
   export const getAliPay = (subject, totalAmount, body, isMobile) => {
     return request({
       url: '/user/alipay',
       params: {
         subject,
         totalAmount,
         body,
         isMobile,
       },
     })
   }
   /**
    * 根据订单号获取支付结果
    */
   export const getPayResult = (out_trade_no) => {
     return request({
       url: '/sys/pay/result',
       params: {
         out_trade_no,
       },
     })
   }
   ```

2. 新建`src\utils\pay.js`进行拉取支付宝支付

   ```js
   import { isMobileTerminal } from './flexible'
   import { getAliPay } from '@/api/mock/pay'
   /**
    * 触发支付宝支付
    * @param {*} title 支付标题
    * @param {*} desc 支付的描述
    */
   export const alipay = async (title, desc) => {
     const { encodeURI } = await getAliPay(title, '0.01', desc, isMobileTerminal.value)
     window.location.href = decodeURIComponent(encodeURI)
   }
   
   ```

3. 在支付成功之后，需要接收支付的结果，因此需要创建支付成功之后的回调页面：

   1. 定义对应路由

      ```js
       {
              path: '/pay/result',
              name: 'payResult',
              component: () => import('@/views/pay/index.vue'),
              // 标记当前的页面只有用户登录之后才可以进入
              meta: {
                user: true,
              },
      },
      ```

   2. 创建`src/views/pay/index.vue`组件：在支付完成后，会重定向到对应的页面路由`/pay/result`并添加查询参数，因为我们定义过这个路由，所以此时我们可以通过`route.query`来获取查询参数，之前使用正则获取参数是因为不需要通过路由来展示结果

      ```vue
      <script setup>
      import { ref } from 'vue'
      import { useRoute, useRouter } from 'vue-router'
      import { useStore } from 'vuex'
      import { getPayResult } from '@/api/mock/pay'
      // 支付是否成功
      const isSuccess = ref(null)
      const route = useRoute()
      const router = useRouter()
      const store = useStore()
      /**
       * 获取支付结果
       */
      const getResultData = async () => {
        const res = await getPayResult(route.query.out_trade_no)
        isSuccess.value = res
      }
      /**
       * 点击确定按钮跳转到首页并且更新用户信息
       */
      const onConfirm = () => {
        // 获取用户信息
        store.dispatch('user/profile')
        router.push('/')
      }
      </script>
      
      <template>
        <div class="h-full bg-zinc-200 dark:bg-zinc-800 duration-400 xl:pt-1">
          <div
            class="mx-auto h-full pt-[50%] px-1 bg-white dark:bg-zinc-900 duration-400 xl:h-[360px] xl:rounded-sm xl:py-10 xl:border-zinc-200 xl:dark:bodrder-zinc-600 xl:border-[1px] xl:px-4 xl:max-w-screen-lg">
            <div
              v-if="JSON.stringify(isSuccess) !== 'null'"
              class="flex justify-center items-center">
              <m-svg-icon
                v-if="!isSuccess"
                name="pay-success"
                class="w-8 h-8 mr-4"></m-svg-icon>
              <m-svg-icon
                v-if="!isSuccess"
                name="pay-fail"
                class="w-8 h-8 mr-4"></m-svg-icon>
              <p class="text-ml text-zinc-900 dark:text-zinc-200">{{ isSuccess ? '支付成功' : '支付失败' }}</p>
            </div>
      
            <m-button
              class="w-full mt-8 mx-auto dark:bg-zinc-800 xl:w-[120px]"
              @click="onConfirm"
              >确定</m-button
            >
          </div>
        </div>
      </template>
      
      <style scoped lang="scss"></style>
      ```

4. 处理移动端支付，与PC端逻辑类似

   ```vue
   <script setup>
   import discountsVue from '../discounts.vue'
   import { alipay } from '@/utils/pay'
   const props = defineProps({
     payData: Object,
   })
   const onAliPayClick = () => {
     alipay(props.payData.title, props.payData.desc)
   }
   </script>
   
   <template>
     <div>
       <!-- 特惠提示 -->
       <discounts-vue></discounts-vue>
       <div
         class="flex flex-col items-center justify-evenly border-zinc-200 dark:border-zinc-600 border-[1px] py-3 rounded-md mt-1">
         <p class="text-[32px] text-orange-600 font-sans">
           <span class="text-base text-zinc-900 dark:text-zinc-200">支付金额：</span>
           <span class="text-lg mr-[-12px]">￥</span>
           19
         </p>
   
         <div class="flex mt-3">
           <!-- 支付宝支付 -->
           <div
             class="border border-zinc-200 dark:border-zinc-600 rounded-sm w-[220px] h-[60px] flex items-center pl-2 cursor-pointer duration-200 hover:bg-zinc-50 hover:dark:bg-zinc-800"
             @click="onAliPayClick">
             <img
               class="w-4 h-4"
               src="@/assets/images/alipay.png"
               alt="" />
             <p class="text-xl ml-1 text-zinc-800 dark:text-zinc-200">支付宝</p>
           </div>
         </div>
       </div>
     </div>
   </template>
   
   <style scoped></style>
   ```

### 3.支付宝支付对接--技术对接前后端都做了什么

1. 用户在前端页面点击支付宝支付功能
2. 前端调用服务端接口
3. 服务端接收到请求，利用`alipay-sdk(nodekjs)`创建支付订单信息，得到支付宝返回的url
4. 服务端需要对该`url`进行`encode(encodeURIComponent)`操作，以防止意外的转码
5. 服务端返回该`url`（`encode`之后的）到前端
6. 前端进行`decode`解码，得到支付的`url`
7. 前端控制跳转到该`url`，即为支付宝用户支付页面
8. 用户在该页面完成支付，支付完成之后，支付宝会回调两个地址：
   1. `returnUrl`：支付完成的跳转地址，用于用户视觉感知支付已成功
   2. `notifyUrl`：异步通知地址，以`http`或者`https`开头的，商户外网可以`post`访问的异步地址，用于接收支付宝返回的支付结果
9. 前端通过`returnUrl`告知用户支付完成
10. 服务端通过`notifyUrl`完成用户支付之后的数据变更，同时需要对通知信息进行验签操作，并且在验签通过之后返回`success`给支付宝
11. 区分PC端支付和移动端支付的关键在于：通过判断客户端设备来区分
    1. 电脑端：服务端触发的接口为：`alipay.trade.page.pay`
    2. 移动端：服务端触发的接口为：`alipay.trade.wap.pay`

## 21.发布处理方案--前台项目构建与发布处理

1. 使用`xshell`连接从阿里云购买的ECS云服务器，并配置`Nginx`环境

   1. `nginx`编译时依赖`gcc`环境：

      ```shell
      yum -y install gcc gcc-c++
      ```

   2. 安装`prce`，让`nginx`支持重写功能：

      ```shell
      yum -y install prce*
      ```

   3. 安装`zlib`，`nginx`使用`zlib`对`http`包内容进行`gzip`压缩：

      ```shell
      yum -y install zlib zlib-devel
      ```

   4. 安装`openssl`，用于通讯加密：

      ```shell
      yum -y install openssl openssl-devel
      ```

   5. 下载并安装nginx：

      1. 下载`nginx`压缩包：

         ```shell
         wget https://nginx.org/download/nginx-1.11.5.tar.gz
         ```

      2. 解压`nginx`：

         ```shell
         tar -zxvf nginx-1.11.5.tar.gz
         ```

      3. 进入`nginx-1.11.5`目录

         ```shell
         cd nginx-1.11.5
         ```

      4. 检查平台安装环境：执行configure这一可执行程序，并添加安装的路径前缀

         ```shell
         ./configure --prefix=/usr/local/nginx
         ```

      5. 进行源码编译并安装

         ```shell
         make && make install
         ```

      6. 查看`nginx`配置

         ```shell
         /usr/local/nginx/sbin/nginx -t
         ```

   6. 制作`nginx`软链接

      1. 进入`usr/bin`目录

         ```shell
         cd /usr/bin
         ```

      2. 制作软链接

         ```shell
         ln -s /usr/local/nginx/sbin/nginx nginx
         ```

   7. 对`nginx`进行配置：

      1. 首先进入到nginx的默认配置文件中

         ```shell
         vim /usr/local/nginx/conf/nginx.conf
         ```

      2. 根据需要修改监听的端口号，并在最底部增加配置项（引入外部配置文件），然后保存并退出

         ```shell
         include /nginx/*.conf
         ```

      3. 创建新的配置文件：

         ```shell
         touch /nginx/nginx.conf
         ```

      4. 进入到`/root/nginx/nginx.conf`文件

         ```shell
         vim /nginx/nginx.conf
         ```

      5. 写入如下配置保存并退出

         ```shell
         #imooc-front
         server {
           #端口
           listen 80;
           #域名
           server_name http://xxx.com;
           #资源地址
           root /nginx/dist/;
           #目录浏览
           autoindex on;
           #缓存处理
           add_header Cache-Control "no-cache,must-revalidate"
           #请求配置
           location / {
             #跨域
             add_header Access-Control-Allow-Origin *;
             #返回index.html
             try_files $uri $uri/ /index.html;
           }
         }
         ```

      6. 创建`dist`目录，并重启`nginx`服务

         ```shell
         nginx -s reload
         # 如果没生效执行另一段命令，使nginx使用该配置文件进行启动
         nginx -c /usr/local/nginx/conf/nginx.conf
         ```

2. 使用`xftp`工具将项目打包后的`dist`目录传到服务器`nginx`服务对应的`dist`目录下

