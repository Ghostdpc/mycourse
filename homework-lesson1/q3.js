const fp = require("lodash/fp");
const { Maybe, Container } = require("./support");
const { values } = require("lodash");
//练习1
let maybe = Maybe.of([5, 6, 1]);
let ex1 = () => {
  return maybe.map(function (value) {
    for (var n = 0; n < value.length; ++n) value[n] += 1;
    return value;
  })._value;
};
console.log(ex1());

//练习2
let xs = Container.of(["do","ray","mi","fa","so","la","ti","do"]);
let ex2= () =>{
    return xs.map(value=>{
        return fp.first(value);
    })._value;
};
console.log(ex2());
//练习3

let safeProp = fp.curry(function(x,o) {
    return Maybe.of(o[x]);
})
fp.first
let user = { id: 2, name: "Albert" };
// console.log(safeProp(user.id,user.name));
let ex3 = (user)=>{
    let may=safeProp("name",user);
    let name = may.map(value=>{
        return fp.first(value);
    })._value;
    return safeProp(0,name)._value;
};
console.log(ex3(user));


//练习4 

let ex4 = function(n) {
    let m = Maybe.of(n);
    return m.map(function(value){
        return parseInt(value);
    })._value;
}
console.log(ex4("1.231"))