import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _4e8446be = () => interopDefault(import('..\\pages\\layout' /* webpackChunkName: "" */))
const _fb086fd4 = () => interopDefault(import('..\\pages\\home' /* webpackChunkName: "" */))
const _6594f9dc = () => interopDefault(import('..\\pages\\login' /* webpackChunkName: "" */))
const _2f07d712 = () => interopDefault(import('..\\pages\\profile' /* webpackChunkName: "" */))
const _43331bda = () => interopDefault(import('..\\pages\\settings' /* webpackChunkName: "" */))
const _6621fa38 = () => interopDefault(import('..\\pages\\editor' /* webpackChunkName: "" */))
const _15d21a5f = () => interopDefault(import('..\\pages\\article' /* webpackChunkName: "" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _4e8446be,
    children: [{
      path: "",
      component: _fb086fd4,
      name: "home"
    }, {
      path: "/login",
      component: _6594f9dc,
      name: "login"
    }, {
      path: "/register",
      component: _6594f9dc,
      name: "register"
    }, {
      path: "/profile/:uername",
      component: _2f07d712,
      name: "profile"
    }, {
      path: "/settings",
      component: _43331bda,
      name: "settings"
    }, {
      path: "/editor",
      component: _6621fa38,
      name: "editor"
    }, {
      path: "/article/:slug",
      component: _15d21a5f,
      name: "article"
    }]
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
