import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'blog',
    component: () => import('@/views/Blog.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/Admin.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@/views/Detail.vue')
  },
]

const router = createRouter({
  // hash 模式
  history: createWebHashHistory(),
  routes
})

export default router