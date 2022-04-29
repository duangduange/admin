import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/Users.vue'
import Rights from '@/components/Rights.vue'
import Roles from '@/components/Roles.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

//路由守卫
router.beforeEach((to, from , next) => {
  if(to.path == '/login') return next()
  if(!window.sessionStorage.getItem('token')) return next('/login')
  next()
})

export default router
