class Vue {
  constructor(options) {
    //1.通过属性保存选项的数据
    this.$options = options || {};
    this.$data = options.data || {};
    this.$el =typeof options.el === "string" ? document.querySelector(options.el) : options.el;
    this.$methods = options.methods;
    //2.将data中的数据通过proxy设置getter和setter，注入到VUE实例中
    this._proxyData(this.$data);
    //3.调用observer对象监控这些数据
    new Observer(this.$data);
    //4. 调用compiler解析指令，表达式等
    new compiler(this)
  }
  _proxyData(data) {
    //遍历所有属性并注入到vue实例中
    //箭头函数不会改变指向，因此用箭头函数
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        enumberable: true,
        configurable: true,
        get() {
          return data[key];
        },
        set(newVal) {
          if (newVal === data[key]) {
            return;
          }
          data[key] = newVal;
        },
      });
    });
  }
}
