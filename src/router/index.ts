import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'blog',
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/admin/index.vue')
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@/views/article/index.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/about/index.vue')
  },
  {
    path: '/message',
    name: 'message',
    component: () => import('@/views/message/index.vue')
  },
]

const router = createRouter({
  // hash 模式
  history: createWebHashHistory(),
  routes
})

export default router