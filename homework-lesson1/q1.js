// setTimeout(() => {
//     var a = "hello";
//     setTimeout(()=>{
//         var b = "lagou";
//         setTimeout(() => {
//             var c = "I love u";
//             console.log(a+b+c);
//         }, 10);
//     },10)
// }, 10);

var sentence = new Promise(function (resolve, reject) {resolve();});
sentence.then(() => {
    var a = "hello ";
    return a;
  })
  .then((value) => {
    var b = "lagou ";
    return value + b;
  })
  .then((value) => {
    var c = "I love u";
    console.log(value + c);
});