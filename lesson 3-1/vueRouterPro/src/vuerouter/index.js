/* eslint-disable */
let _Vue = null;
export default class VueRouter {
  static install(Vue) {
    //1.判断插件是否安装
    //2.记录VUE的构造函数
    //3.将创建vue时传入的router对象挂载到所有vue实例上
    //4.初始化router
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true;
    _Vue = Vue;
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          //只挂router
          _Vue.prototype.$router = this.$options.router;
          this.$options.router.init();
        }
      }
    });
  }
  //将初始化执行的参数放到一个函数中
  init() {
    this.createRouteMap();
    this.initComponents(_Vue);
    this.initEvent();
  }
   //数据的初始化
  constructor(options) {
    this.options = options;
    this.routeMap = {};
    this.data = _Vue.observable({
      current: "/"
    });
    //不同的模式
    this.mode =
      options.mode === "hash" || options.mode === "history"? options.mode : "hash";
  }
  createRouteMap() {
    //遍历所有路由规则然后解析，存到routeMap数据中
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component;
    });
  }

  // 运行时版本vue不会编译temple为render
  // 完整版的会编译template
  // template: '<a :herf="to"><slot></slot></a>'
  initComponents(Vue) {
    Vue.component("router-link", this.routerLinkTemplate(this.mode));

    const self = this;
    Vue.component("router-view", {
      render(h) {
        const component = self.routeMap[self.data.current];
        return h(component);
      }
    });
  }

  initEvent() {
    //使用不同的事件，这个注册事件主要用于浏览器前进后退
    if (this.mode === "history") {
      window.addEventListener("popstate", () => {
        this.data.current = window.location.pathname;
      });
    } else {
      //使用bind来绑定this，这样子效果和上面使用箭头函数this不变一样
      window.addEventListener("load", this.hashChange.bind(this));
      window.addEventListener("hashchange", this.hashChange.bind(this));
    }
  }
  hashChange() {
    if (!window.location.hash) {
      //初始化的时候或者直接在某个标签页刷新
      window.location.hash = "#/";
    }
    this.data.current = window.location.hash.substr(1);
  }
  routerLinkTemplate(mode) {
    return {
      props: {
        to: String
      },
      render(h) {
        return h(
          "a",
          {
            attrs: {
              herf: mode === "hash" ? "#" + this.to : this.to
            },
            on: {
              click: this.clickHandler
            }
          },
          [this.$slots.default]
        );
      },
      methods: {
        clickHandler(e) {
          //点击事件
          if (mode === "hash") {
            window.location.hash = "#" + this.to;
          } else {
            history.pushState({}, "", this.to);
          }
          this.$router.data.current = this.to;
          e.preventDefault();
        }
      }
    };
  }
}
