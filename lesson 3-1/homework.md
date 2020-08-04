# 简答题
第一题： 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如果把新增成员设置成响应式数据，它的内部原理是什么。<br>
```js
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```
答：不是响应式的，VUE不允许动态添加根级别的响应式属性，因此我们没法直接对已经创建的vue实例新增响应式属性。我们可以通过Vue.set来给Vue的下级对象添加新的响应式数据。对于以上代码的`this,dog.name`的直接复制可以使用`Vue.set(this.dog,'name',"trump");`来间接添加响应式属性<br>

第二题：请简述 Diff 算法的执行过程<br>
答：Diff算法就是在虚拟DOM数据更改后，对比新旧节点的算法。它会比较新旧节点，找到差异，更新虚拟DOM，然后将差异渲染到真实的DOM中去。其中会调用`patch`函数，这个函数接收`OldVNode`和新增的`VNode`参数，首先我们会对比这两个节点进行比较，即调用`sameVnode`函数，比较二者是否为同一个节点（sel选择器和key相同，VUE中的可能会有所不同，但是总体思路是一样的），如果不是同一个节点，我们要做的就很简单了，我们将会新建新节点替换并移除老节点。如果这两个节点是同一个节点。那么我们会继续往下比较，这是则会调用`patchVnode`继续往下比较，这时这个函数会做以下几个事情：<br>`updateChildren`的源码<br>
* 判断`Vnode`和`oldVnode`是否相同(sameNode)，如果是，那么直接return；
* 如果他们都有定义文本并且不相等，那么将更新为`Vnode`的文本并更新。
* 如果`oldVnode`有子节点而`Vnode`没有，则删除`oldVnode`的子节点同时会更新DOM。
* 如果`oldVnode`没有子节点而`Vnode`有，则将批量创建`Vnode`的子节并插入到DOM。
* 如果两者都有子节点，则执行`updateChildren`函数比较子节点，而这个函数也是diff逻辑最多的一步<br>

`updateChildren`的源码是非常长的，它主要是比较子节点的各种情况。下面我们分步骤来细分。
1. 我们将节点数组设置了开始和结束标记，对比的时候我们通过移动index来进行遍历，分别是`oldStartNode`,`oldEndNode`,`newStartNode`,`newEndNode`四种，而这其中对比的方式一共有如下四种
   * oldStartVNode/newStartVnode(旧开始节点/新开始节点)，当对比新旧开始节点时，如果是`sameNode`，我们会调用`patchNode`函数，然后index都增加。
   * oldEndVNode/newEndtVnode(旧结束节点/新结束节点)，当对比新旧结束节点时，操作相同，最后我们要做的就是`index--`
   * oldStartVNode/newEndVnode(旧开始节点/新结束节点)，同样的，最后`start++`，`end--`
   * oldEndVNode/newStartVnode(旧结束节点/新开始节点),同样的，最后`start++`，`end--`
2. 做完准备后，我们先对old节点检查是否为空，如果为空则start往后移或者end向前移。
3. 对比准备中的四种情况，如果`sameNode`，则执行`patchNode`并操作`index`。
4. 如果不属于上述四种情况，使用`newStartNode`的key在老节点数组中寻找相同的节点，如果没有找到，说明`newStartNode`是新节点，我们就要创建对应的DOM元素并且插入到DOM树中，如果找到了，则判断和老节点是否为`sameNode`，如果不相同，则说明节点被修改了，也是新节点，要重新创建，如果相同的话，则把它移动到数组的左边，并且继续调用`patchNode`。然后继续移动index比较下一个节点。
5. 遍历完成后，有两种情况，一种是`oldVnode`有剩余，需要删除多余的节点，一个是`Vnode`有剩余，则要将这些新节点插入到`oldVnode`中。在这个过程中，按照顺序从头遍历到尾对比开始节点，如果相同则往后移动`startNode`，当遇到第一个不同，则停止移动开始节点，然后从结束节点开始对比，如果相同则往前移动`EndNode`，直到对比出不同才停止移动。这样`startNode`和`EndNode`之间的部分就是多余出来的节点。<br>

编程题<br>
1、模拟 VueRouter 的 hash 模式的实现<br>
[两种模式的router](vueRouterPro/src/vuerouter/index.js)<br>
2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。<br>
[Vue的Compiler](vueProj/js/Compiler.js)<br>
3、参考 Snabbdom 提供的电影列表的示例，利用Snabbdom 实现类似的效果。<br>
[Snabbdom做一个电影列表](virtualDom/src/index.js)<br>
