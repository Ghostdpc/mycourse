
//   var a = [];
//   for(let i = 0;i<10;i++) {
//       a[i] = function() {
//           console.log(i);
//       }
//   };
//   a[7]();


// var temp = 123;
// if(true) {
//     let temp;
//     console.log(temp);
// }

// var arr = [12,34,32,89,4];
// var arr =4;
// var minNum = Math.min(...arr);
// console.log(minNum)



var a = 10;
var obj = {
  a: 20,
  fn() {
    setTimeout(() => {
        console.log("fn1"+this.a);
    }, 0);
  },
  fn2: () => {
    console.log("fn2"+this.a);
  },
  fn3() {
    console.log("fn3"+this.a);
  },
  fn4() {
    setTimeout(() => {
        console.log("fn4"+this.a);
      }, 0);
  }
};
obj.fn();
obj.fn2();
obj.fn3();
obj.fn4();


// const name = 'tom'
// // 可以通过 ${} 插入表达式，表达式的执行结果将会输出到对应位置
// const msg = `hey, ${name} --- ${1 + 2} ,
// ---- ${Math.random()}`
// console.log(msg)

// var a = 10;
// var obj = {
// a: 20,
// fn() {
//   setTimeout(() => {
//     console.log(this.a);
//   }, 0);
// },
// };
// obj.fn();