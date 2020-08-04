//数据变化时，dep通知所有watcher实例更新试图
//实例化时往DEP对象中添加自己
class Watcher {
    constructor(vm,key,cb) {
        this.vm = vm;
        //data中的属性
        this.key = key;
        //回调函数用来更新视图
        this.cb = cb;
        //吧watcher对象记录到dep类的静态属性target中
        Dep.target = this;
        //触发get方法，在get方法中调用addsub
        this.oldValue = vm[key];
        Dep.target = null;
    }
    //当数据发生变化时更新视图
    update() {
      let newValue = this.vm[this.key];
      if(this.oldValue === newValue) {
          return;
      }
      this.cb(newValue);  
    }
}


