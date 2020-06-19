const PENDING = "pending"; // 等待
const FULLFILLED = "fullfilled"; // 成功
const REJECTED = "rejected"; // 失败

class MyPromise {
  //每个promise都需要有一个传入处理函数的构造函数
  constructor(resover) {
    try {
      resover(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }
  // promsie 状态
  status = PENDING;
  // 成功之后的返回值
  result = undefined;
  // 失败后的返回信息
  errMsg = undefined;
  // 成功回调数组
  fullfillCallback = [];
  // 失败回调数组
  rejectCallback = [];

  //模拟resolve函数
  resolve = (value)=>{
    //如果状态不是等待，则不可执行
    if (this.status !== PENDING) return;
    this.status = FULLFILLED;
    this.result = value;
    //处理回调
    while (this.fullfillCallback.length) this.fullfillCallback.shift()();
  }

  //模拟直接使用resolve函数返回一个promise
  static resolve(value) {
    if (value instanceof MyPromise) return value;
    //返回被包裹的数据
    return new MyPromise((resolve) => resolve(value));
  }

  //模拟rejet函数
  reject = (errMsg)=>{
    if (this.status !== PENDING) return;
    this.status = REJECTED;
    this.errMsg = errMsg;
    while (this.rejectCallback.length) this.rejectCallback.shift()();
  }


  //模拟then
  then(resolveCallback, rejectCallback) {
    //空then调用,直接传递
    resolveCallback = resolveCallback ? resolveCallback : parm => parm;
    //向外继续抛出错误
    rejectCallback = rejectCallback ? rejectCallback : errMsg => {throw errMsg;};
 

    //then函数返回一个promise
    let resultPromise = new MyPromise((resolve, reject) => {
      //判断执行哪个函数
      if (this.status === FULLFILLED) {
        //将创建promise变为异步
        setTimeout(() => {
          try {
            let successResult = resolveCallback(this.result);
            resolvePromise(resultPromise, successResult, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else if (this.status === REJECTED) {
        //reject的情况
        setTimeout(() => {
          try {
            let failResult = rejectCallback(this.errMsg);
            resolvePromise(resultPromise, failResult, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else {
        // 异步操作时，不会马上返回结果，需要将成功回调和失败回调存储起来
        this.fullfillCallback.push(() => {
          setTimeout(() => {
            try {
              let successResult = resolveCallback(this.result);
              resolvePromise(resultPromise, successResult, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.rejectCallback.push(() => {
          setTimeout(() => {
            try {
              let failResult = rejectCallback(this.errMsg);
              resolvePromise(resultPromise, failResult, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return resultPromise;
  }

  //finally函数的模拟，不管是成功还是失败都会执行一次CALLBACK
  finally(callback) {
    return this.then(
      (value) => {
        return MyPromise.resolve(callback()).then(() => value);
      },
      (reason) => {
        return MyPromise.resolve(callback()).then(() => {
          throw reason;
        });
      }
    );
  }
  //捕获异常
  catch(failCallback) {
    return this.then(undefined, failCallback);
  }

  //模拟all
  static all(array) {
    //ALL是传入需要执行的数组
    let result = [];
    let index = 0;
    return new MyPromise((resolve, reject) => {
      //将数据按照顺序推入result数组
      function addData(key, value) {
        result[key] = value;
        index++;
        if (index === array.length) {
          resolve(result);
        }
      }
      for (let i = 0; i < array.length; i++) {
        //处理当前执行的任务是否能够成功
        let current = array[i];
        if (current instanceof MyPromise) {
          // promise 对象需要返回then调用
          current.then(
            (value) => addData(i, value),
            (errMsg) => reject(errMsg)
          );
        } else {
          // 普通值则返回
          addData(i, array[i]);
        }
      }
    });
  }
}

  //处理传入then的值是否是promise，并且是不是重复
function resolvePromise(newPromise, resolveResult, resolve, reject) {
    //处理循环调用的情况
    if (newPromise === resolveResult) {
      return reject(new TypeError("Chaining cycle detected"));
    }
    if (resolveResult instanceof MyPromise) {
      resolveResult.then(resolve, reject);
    } else {
      return resolve(resolveResult);
    }
}

module.exports = MyPromise;
