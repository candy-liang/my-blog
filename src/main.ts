import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
// import axios from "axios";
import '@icon-park/vue-next/styles/index.css';
//引入组件库
//引入样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


app.use(router)
  .use(createPinia())
  .mount('#app')
