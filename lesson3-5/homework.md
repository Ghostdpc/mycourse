1、Vue 3.0 性能提升主要是通过哪几方面体现的？
* 主要通过以下几点
  * 响应式系统的升级，包括使用了proxy对象重写响应式系统
  * 重写虚拟DOM，diff时只需要对比动态节点的内容，新增了静态标记（PatchFlag），只比对带有 PF 的节点
 跳过静态（常量）节点，只处理动态（模板）节点。从而提升巨大性能
  * 优化打包体积，增加了tree-shaking机制，依赖es6的模块化的语法，将无用的代码(dead-code)进行剔除


2、Vue 3.0 所采用的 Composition Api 与 Vue 2.x使用的Options Api 有什么区别？
* Options Api包含一个描述组件选项（props、data、methods 等）的对象，开发复杂组件，同一个功能逻辑的代码被拆分到不同选项，但是Composition Api提供了一种基于函数的API，让我们可以更灵活、更合理的组织组件的逻辑和代码结构，同一功能的代码不需要拆分，有利于对代码的提取和重用（高内聚，低耦合），这样做，在组件复杂，功能很多的情况下，我们都能快速的定位到这个功能所用到的所有API

3、Proxy 相对于 Object.defineProperty 有哪些优点？
* * Proxy 可以直接监听对象而非属性，除了有 set 和 get 监听之外，还有其他对于对象的监听回调，可 以监听动态新增的属性、监听删除的属性。has deleteProperty ownKeys apply 等等
  * Proxy 更好的支持数组对象的监视监听，可以监听数组的索引和 length 属性defineProperty 不具备的；
  * Proxy 是以非侵入的方式监管了对象的读写，不会修改原对象


4、Vue 3.0 在编译方面有哪些优化？
* * 静态Node不再作更新处理（hoistStatic -> SSR 优化）
  * Fragments 片段，模板中可以直接放文本内容或同级标签(vscode中要升级 vetur 插件)
  * 静态节点提升到 render 函数外部，只在初始化时执行一次，再次render无需再次执行
  * Patch flag，标记动态节点（记录节点内容、节点属性），diff时跳过静态根节点 只需关心动态节点内容
  * 缓存事件处理函数，减少了不必要的更新操作



5、Vue.js 3.0 响应式系统的实现原理？
* Vue3 使用 Proxy 对象重写响应式系统，这个系统主要有以下几个函数来组合完成
  * reactive/ref/toRefs/computed
  * effect (watch函数内部使用的底层函数)
  * track 收集依赖的函数
  * trigger 触发更新的函数
* 使用 Proxy 对象实现属性监听，初始化时不需要遍历所有属性对其 defineProperty，如果有多属性嵌套，在访问属性的过程中才会处理下一级属性（递归处理），性能会更好，同时它会默认监听动态添加的属性,监听属性的删除操作，监听数组索引和 length 属性的修改操作。同时这个模块可以作为单独的模块使用。

