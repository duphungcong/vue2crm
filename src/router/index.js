import Vue from 'vue'
import Router from 'vue-router'

import ErrorPage from '@/components/404'
import Dashboard from '@/components/Dashboard'
import Checks from '@/components/Checks'
import NewCheck from '@/components/NewCheck'
import EditCheck from '@/components/EditCheck'
import MaintSchedule from '@/components/MaintSchedule'
import Shifts from '@/components/Shifts'
import Shift from '@/components/shared/Shift'
import Tasks from '@/components/Tasks'
import BarcodeIn from '@/components/BarcodeIn'
import BarcodeOut from '@/components/BarcodeOut'
import NRCs from '@/components/NRCs'
import Spares from '@/components/Spares'

import Login from '@/components/Login'
import SignUp from '@/components/SignUp'

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
      path: '/tasks', component: Tasks, name: 'Tasks', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    {
      path: '/nrcs', component: NRCs, name: 'NRCs', meta: {
        requireAuth: true,
        requireFollowing: true
      }
    },
    {
      path: '/spares', component: Spares, name: 'Spares', meta: {
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