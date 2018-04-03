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
import Checks from '@/components/Checks'
import NewCheck from '@/components/NewCheck'
import EditCheck from '@/components/EditCheck'
import MaintSchedule from '@/components/MaintSchedule'
import Shifts from '@/components/Shifts'
import Shift from '@/components/Shift'
import Tasks from '@/components/Tasks'
import ShiftBar from '@/components/ShiftBar'
import BarcodeIn from '@/components/BarcodeIn'
import BarcodeOut from '@/components/BarcodeOut'

import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import ChangePassword from '@/components/ChangePassword'

import store from '@/store'

Vue.use(Router)

let router = new Router({
  base: __dirname,
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/404', component: ErrorPage, name: 'ErrorPage' },
    { path: '/dashboard', component: Dashboard, name: 'Dashboard', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    { path: '/about', component: About, name: 'About', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    { path: '/orders', component: Orders, name: 'Orders', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    { path: '/neworder', component: Order, name: 'NewOrder', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    { path: '/order/:id', component: Order, name: 'Order', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    { path: '/customers', component: Customers, name: 'Customers', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    { path: '/newcustomer', component: Customer, name: 'NewCustomer', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    { path: '/customer/:id', component: Customer, name: 'Customer', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    { path: '/product/:id', component: Product, name: 'Product', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    { path: '/products', component: Products, name: 'Products', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    { path: '/newproduct', component: Product, name: 'NewProduct', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    { path: '/checks', component: Checks, name: 'Checks', meta: {
        requireAuth: true,
        requireFollowing: false
      }
    },
    { path: '/newcheck', component: NewCheck, name: 'NewCheck', meta: {
        requireAuth: true,
        requireFollowing: false
      }
    },
    { path: '/editcheck/:id', component: EditCheck, name: 'EditCheck', meta: {
        requireAuth: true,
        requireFollowing: false
      }
    },
    { path: '/maintschedule', component: MaintSchedule, name: 'MaintSchedule', meta: {
        requireAuth: true,
        requireFollowing: false
      }
    },
    {
      path: '/shifts', component: Shifts, name: 'Shifts', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    {
      path: '/shift', component: Shift, name: 'Shift', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    {
      path: '/shiftbar', component: ShiftBar, name: 'ShiftBar', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    {
      path: '/tasks', component: Tasks, name: 'Tasks', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    {
      path: '/barcodein', component: BarcodeIn, name: 'BarcodeIn', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    {
      path: '/barcodeout', component: BarcodeOut, name: 'BarcodeOut', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/signup', component: SignUp, name: 'SignUp' },
    { path: '/changePassword', component: ChangePassword, name: 'ChangePassword' },
    { path: '/', redirect: '/dashboard' },
    { path: '*', redirect: '/dashboard' }
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

router.beforeEach((to, from, next) => {
  let isAuth = false
  let isFollowing = false
  if (store.getters.user !== null && store.getters.user !== undefined) {
    isAuth = true
  }
  if (store.getters.following !== null && store.getters.following !== undefined) {
    isFollowing = true
  }

  let requireAuth = to.matched.some(record => record.meta.requireAuth)
  let requireFollowing = to.matched.some(record => record.meta.requireFollowing)

  if (requireAuth && !isAuth) {
    // console.log('step 1')
    next('/login')
  } else if (requireFollowing && !isFollowing) {
    // console.log('step 2')
    // console.log('requireFollowing : ' + requireFollowing)
    // console.log('isFollowing : ' + isFollowing)
    next('/checks')
  } else {
    // console.log('step 3')
    // console.log('requireFollowing : ' + requireFollowing)
    // console.log('isFollowing : ' + isFollowing)
    next()
  }
})

export default router