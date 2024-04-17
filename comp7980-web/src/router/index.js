import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home/shop',
          component: () => import('@/views/shop/ShopPage.vue')
        },
        {
          path: '/home/cart',
          component: () => import('@/views/cart/CartPage.vue')
        },
        {
          path: '/home/manage',
          component: () => import('@/views/manage/ManageShop.vue')
        },
        {
          path: '/home/order',
          component: () => import('@/views/order/OrderView.vue')
        },
        {
          path: '/home/orderM',
          component: () => import('@/views/order/OrderMView.vue')
        },
        {
          path: '/home/analysis',
          component: () => import('@/views/analysis/AnalysisView.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/order/OrderView.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        },
        {
          path: '/home/chatbot',
          component: () => import('@/views/chatbot/ChatBot.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore() // 获取用户状态

  // 检查用户是否登录，未登录且访问非登录页面时重定向到登录页面
  if (!userStore.token && to.path !== '/login') {
    next('/login')
  } else if (to.path === '/home') {
    // 根据用户角色决定重定向目标
    if (userStore.user.role === 'admin') {
      next('/home/manage') // 管理员访问管理页面
    } else {
      next('/home/shop') // 普通用户访问购物页面
    }
  } else {
    next() // 其他路径正常处理
  }
})
export default router
