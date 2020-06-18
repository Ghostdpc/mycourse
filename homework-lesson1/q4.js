const PENDING = "pending"; // 等待
const FULLFILLED = "fullfilled"; // 成功
const REJECTED = "rejected"; // 失败

class MyPromise {
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
        // 异步操作时
        // 将成功回调和失败回调存储起来
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

  catch(failCallback) {
    return this.then(undefined, failCallback);
  }

  //模拟all
  static all(array) {
    let result = [];
    let index = 0;
    return new MyPromise((resolve, reject) => {
      function addData(key, value) {
        result[key] = value;
        index++;
        if (index === array.length) {
          resolve(result);
        }
      }
      for (let i = 0; i < array.length; i++) {
        let current = array[i];
        if (current instanceof MyPromise) {
          // promise 对象
          current.then(
            (value) => addData(i, value),
            (errMsg) => reject(errMsg)
          );
        } else {
          // 普通值
          addData(i, array[i]);
        }
      }
    });
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise((resolve) => resolve(value));
  }
}

  //处理传入then的值是否是promise，并且是不是重复
function resolvePromise(newPromise, resolveResult, resolve, reject) {
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
