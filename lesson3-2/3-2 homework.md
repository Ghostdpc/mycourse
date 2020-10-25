## Vue首次渲染过程
1. Vue初始化，实例成员、静态成员
初始化的时候，首先进行vue的初始化，即初始化实例成员及静态成员，初始化结束以后，调用vue的构造函数`new Vue()`，在构造函数中调用`this._init()`方法。
2. this.init()
`this.init()`相当于整个项目的入口，在这个方法中，最终调用`vm.$mount()`函数，`$mount()`是`src/platform/web/entry-runtime-with-compiler.js`中定义的，核心作用是把模板编译为render函数，判断是否有`render`选项，如果没有，则会获取`template`选项，如果`template`也没有，会把`el`中的内容作为模板，通过`compileToFunctions()`方法将模板编译为`render`函数，编译好以后，将`render`存入到`options.render`中。这也就是为什么在运行时版本中，无法编译template的原因
3. vm.$mount()
接下来，会调用`src/platforms/web/runtime/index.js`文件中的`$mount`方法,这个方法中会重新获取`el`，因为如果是运行时版本的话，是不会走`entry-runtime-with-compiler.js`这个入口中获取`el`，所以如果是运行时版本的话，我们会在`runtime/index.js`的`$mount()`中重新获取el。
4. `mountComponent(this,el)`
这个方法在`src/core/instance/lifecycle.js`中定义的,首先判断是否有`render`选项，如果没有但是传入了模板，并且当前是开发环境，则发出警告（运行时版本不支持编译器），触发`beforeMount`钩子函数（开始挂载之前），定义`updateComponents`函数但是并未调用，这个函数中调用`render()`和`update()`两个方法，`render`是生成虚拟dom，update是将虚拟dom转化为真实dom并挂载到页面上，
5. Watcher实例对象
创建Watcher对象时，传递函数`updateComponents`，然后调用get方法，创建完毕后，触发钩子函数`mounted()`,挂载结束，返回vue实例。
6. 调用Watcher.get()
创建完watcher，会调用一次get，在get方法中会调用`updateComponent()`,`updateComponent`会调用实例化时传入的`render（）`或者是编译模板以后生成的`render（）`，返回`vnode`。然后调用`vm._update`，调用`vm.__patch__`方法，将虚拟dom转化为真实dom并挂载到页面上，将生成的真实dom记录到vm.$el()中

***
## Vue的数据响应式原理
数据响应式是指，当数据发生变化自动更新视图，不需要手动操作dom，在这个过程中，Vue做的操作为
1. initState
整个响应式是从init方法中开始的，在init方法中，调用initState方法初始化状态，在initState方法中调用initData（），将data属性注入到vue实例上，并且调用observe（）将其转化为响应式对象，observe是响应式的入口
2. observe
observer的意思是观测者，`observe（value）`函数位于`src/core/observer/index.js`，首先判断value是否是对象，如果不是对象直接返回，判断value对象是否有`__ob__`,如果有证明value已经做过响应化处理，是响应式数据，则直接返回，如果没有，则在第三步创建observer对象，并将其返回。然后是`Observe()`函数，位于`src/core/observer/index.js`,给value对象定义不可枚举的`__ob__`属性，记录当前的`observer`对象，进行数组的响应化处理，设置数组中的方法push、pop、sort等，这些方法会改变原数组，所以当这些方法被调用的时候，会发送通知，找到`observe`对象中的`dep`，调用`dep.notify()`方法，然后调用数组中的每一个成员，对其进行响应化处理，如果成员是对象，也会将转化为响应式对象，如果value是对象的话，会调用`walk()`，遍历对象中的每一个成员，调用`defineReactive()`
3. defineReactive设置响应式
defineReactive函数位于`src/core/observer/index.js`,为每一个属性创建dep对象，如果当前属性是对象，递归调用observe()
getter:为每一个属性收集依赖，如果当前属性是对象，也为对象的每一个属性收集依赖，最终返回属性值。
setter:保存新值，如果新值是对象，则调用observe,派发更新（发送通知），调用dep.notify()
4. 依赖收集
在watcher对象的get方法中调用pushTarget，会把当前的watcher记录Dep.target属性，访问的data成员的时候收集依赖，访问值的时候会调用defineReactive的getter中收集依赖，把属性对应的watcher对象添加到dep的subs数组中，如果属性是对象，则给childOb收集依赖，目的是子对象添加和删除成员时发送通知。
5. Watcher
当数据发生变化时，会调用`dep.notify()`，调用watcher对象的`update()`方法，在update方法中会调用`queueWatcher()`，方法中会判断watcher是否被处理，如果没有，则将其添加到queue队列中，并调用`flushSchedulerQueue()`刷新任务队列，在`flushSchedulerQueue`中，会触发`beforeUpdate`钩子函数，然后调用`watcher.run（）`，然后清空上一次的依赖，触发actived钩子函数，触发update钩子函数。

***
## 请简述虚拟 DOM 中 Key 的作用和好处。
总结而言，key的作用是可以减少 dom 的操作，减少 diff 和渲染所需要的时间，提升了性能。详细而言，获得虚拟DOM之后，Vue底层会通过算法计算真实DOM树与虚拟DOM树的区别，并得到需要更新的节点，尽可能的复用现成的DOM节点，而不是去更新全部的DOM树，从而达到减少计算资源消耗的目的。在实际项目中，DOM树可能极其复杂。为了提升真实DOM树和虚拟DOM树之间的比较效率，Vue提出了同层级比较的算法。即每次只比较处于同一个层级的DOM元素的变化情况。不同层级的不予比较。当同一层的DOM节点中，如果能够判断节点的唯一性，那么尽可能的采用移动，插入等逻辑保持复用。如果不能保证唯一性，那么则采用更新，删除等操作实现目的。而key就是用来确定该节点的唯一性的。

***
##  Vue 中模板编译的过程
模板编译的主要目的是将模板template转化为渲染函数render,编译模板的过程使用了AST抽象语法树，使用对象的形式描述树形的代码结构，模板编译是将模板字符串首先转化为AST对象，然后优化AST对象，优化的过程是在标记静态根节点，然后吧优化号的AST对象转化为字符串形式的代码，最终把字符串形式代码通过newFunction转化为匿名函数，这个匿名函数就是最终生成的函数render函数，模板编译就是啊模板字符串转化为渲染函数。
整体流程如下
入口函数，`compileToFunctions(template.....)`
1. check cache
先从缓存中加载编译好的render函数， 读取缓存中的CompiledFunctionResult对象，如果有直接返回，缓存中没有，则调用compile（template,options）
2. compile
合并options， baseCompile(template.trim(),finalOptions)
3. baseCompile(template.trim(),finalOptions)
   parse(),将模板字符串首先转化为AST对象
   optimize()标记AST tree中的静态sub trees,检测到静态子树，设置为静态，不需要在每次重新渲染的时候重新生成节点,patch阶段跳过静态子树
   generate(),AST tree生成js的创建代码
4. compileToFunctions（template…）
    继续把上一步中生成的字符串形式js代码转化为函数
    createFunction()
    options.render = render
    options.staticRenderFns = staticRenderFns
    render和staticRenderFns 初始化完毕，挂载到vue实例的options对应的属性中

