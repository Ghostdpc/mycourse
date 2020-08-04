//负责编译模板，解析指令/插值表达式
//负责页面的首次渲染
//当数据变化后重新渲染视图
class compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.methods = vm.$methods;
    this.compile(this.el);
  }
  //编译模板，处理文本节点和元素节点
  compile(el) {
    let childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => {
      //处理文本节点
      if (this.isTextNode(node)) {
        this.compileText(node);
      }
      //处理元素节点
      else if (this.isElementNode(node)) {
        this.compileElement(node);
      }
      //判断node是否有子节点，确定是否递归调用
      if (node.childNodes && node.childNodes.length) {
        this.compile(node);
      }
    });
  }
  //编译元素节点，处理指令
  compileElement(node) {
      //遍历所有节点
      Array.from(node.attributes).forEach(attr=>{
          //判断是否是指令
          let attrName = attr.name;
          if(this.isDirective(attrName)){
            //v-去除
            attrName = attrName.substr(2);
            let key = attr.value;
            if (attrName.startsWith('on')) {
              const event = attrName.replace('on:', '') // 获取事件名
                  // 事件更新
              //单独处理ON
              return this.onUpdater(node, event, key)
            } else {
              this.update(node,key,attrName);
            }
          }
      })
  }

  //指令特化的函数
  update(node,key,attrName) {
      let updateFn= this[attrName+'Updater'];
      updateFn && updateFn.call(this,node,this.vm[key],key);
  }
  // 处理v-text
  textUpdater(node,value,key) {
    node.textContent = value;
    new Watcher (this.vm,key,(newValue)=>{
        node.textContent = newValue;
    })
  }

  //v-mode
  modelUpdater(node,value,key) {
      node.value = value;
      new Watcher (this.vm,key,(newValue)=>{
        node.value = newValue;
    })
    //双向绑定
    node.addEventListener('input',()=>{
        this.vm[key] = node.value;
    })
  }

  //v-html
  htmlUpdater(node,value,key) {
    node.innerHTML = value;
    new Watcher (this.vm,key,(newValue)=>{
        node.innerHTML = newValue;
    })
  }

  //v-on
  //单独处理Von
  onUpdater(node,event,key) {
      node.addEventListener(event, (e) => this.methods[key](e))
  }

  //编译文本节点，处理差值表达式
  compileText(node) {
    //正则标表达式获得值，匹配插值表达式
    let reg = /\{\{(.+?)\}\}/;
    let value = node.textContent;
    if (reg.test(value)) {
      let key = RegExp.$1.trim();
      node.textContent = value.replace(reg, this.vm[key]);

      //创建watcher对象，当数据改变更新视图
      new Watcher(this.vm,key,(newvValue)=>{
        node.textContent = newvValue;
      })
    }
  }

  //处理元素属性是否是指令
  isDirective(attrName) {
    return attrName.startsWith("v-");
  }
  //判断节点是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }
  //判断节点是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }
}
