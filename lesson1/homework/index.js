console.log("hello world");

const MyPromise = require("./q4");
const { result } = require("lodash/fp");
const { values } = require("lodash");

function p1() {
  return new MyPromise(function (resolve, reject) {
    setTimeout(() => {
      resolve("p1");
    }, 2000);
  });
}
function p2() {
  return new MyPromise(function (resolve, reject) {
    // reject("失败");
    resolve('成功');
  });
}

console.log(p2());
p2()
  .then((value) => console.log(value))
  .catch((reason) => {
    console.log(reason);
    console.log("catch");
  });
MyPromise.all(["a", "b", p1(), p2(), "c"]).then((result) => {
  console.log(result);
});
MyPromise.resolve(100).then((value) => console.log(value));
MyPromise.resolve(p1()).then((value) => console.log(value));
p1()
  .finally(() => {
    console.log("finally");
  })
  .then((value) => console.log(value));
