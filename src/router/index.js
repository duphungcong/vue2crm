import Vue from 'vue'
import Router from 'vue-router'
import ErrorPage from '@/components/404'

import Dashboard from '@/components/Dashboard'
import Orders from '@/components/Orders'
import Order from '@/components/Order'
import About from '@/components/About'
import Customers from '@/components/Customers'
import Customer from '@/components/Customer'
import Products from '@/components/Products'
import Product from '@/components/Product'

import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import ChangePassword from '@/components/ChangePassword'

import store from '@/utils/store'

Vue.use(Router)

function requireAuth (to, from, next) {
  if (store.getters.user !== null && store.getters.user !== undefined) {
    next()
  } else {
    next('/login')
  }
}

export default new Router({
  base: __dirname,
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/404', component: ErrorPage, name: 'ErrorPage' },
    { path: '/dashboard', component: Dashboard, name: 'Dashboard', beforeEnter: requireAuth },
    { path: '/about', component: About, name: 'About', beforeEnter: requireAuth },
    { path: '/orders', component: Orders, name: 'Orders', beforeEnter: requireAuth },
    { path: '/neworder', component: Order, name: 'NewOrder', beforeEnter: requireAuth },
    { path: '/order/:id', component: Order, name: 'Order', beforeEnter: requireAuth },
    { path: '/customers', component: Customers, name: 'Customers', beforeEnter: requireAuth },
    { path: '/newcustomer', component: Customer, name: 'NewCustomer', beforeEnter: requireAuth },
    { path: '/customer/:id', component: Customer, name: 'Customer', beforeEnter: requireAuth },
    { path: '/product/:id', component: Product, name: 'Product', beforeEnter: requireAuth },
    { path: '/products', component: Products, name: 'Products', beforeEnter: requireAuth },
    { path: '/newproduct', component: Product, name: 'NewProduct', beforeEnter: requireAuth },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/signup', component: SignUp, name: 'SignUp' },
    { path: '/changePassword', component: ChangePassword, name: 'ChangePassword' },
    { path: '/', redirect: '/dashboard' },
    { path: '*', redirect: '/login' }
  ],
  meta: {
    progress: {
      func: [
        {call: 'color', modifier: 'temp', argument: '#ffb000'},
        {call: 'fail', modifier: 'temp', argument: '#6e0000'},
        {call: 'location', modifier: 'temp', argument: 'top'},
        {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
      ]
    }
  }
})
