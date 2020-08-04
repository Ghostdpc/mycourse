//这个类负责数据劫持
//负责吧data中的属性转换成响应式数据，也会转化data中是对象的属性

//数据变化发送通知
class Observer {
    constructor (data) {
        this.walk(data)
    }
    walk (data) {
        //1.data是否是对象
        if(!data||typeof data !== 'object') {
            return;
        }
        //2.遍历data所有的属性
        Object.keys(data).forEach(key=>{
            this,this.defineReactive(data,key,data[key]);
        })

    }
    defineReactive(obj,key,val) {
        const that = this;
        //收集依赖和发送通知
        let dep = new Dep()
        //将对象内部的数据也转换成响应式数据
        //转化时增加目标
        that.walk(val);
        Object.defineProperty(obj,key,{
            enumerable: true,
            configurable: true,
            get() {
                
                Dep.target&&dep.addSub(Dep.target);
                return val;
            },
            set(newValue) {
                if(newValue === val) {
                    return;
                }
                that.walk(newValue);
                val = newValue;
                //每次变化都通知watcher
                dep.notify();
            }
        })
    }

}