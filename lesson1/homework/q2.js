const fp = require("lodash/fp");
const cars = [
  {
    name: "ferrari FF",
    horsepower: 660,
    dollar_value: 700000,
    instock: true,
  },
  {
    name: "Spyker C12 Zagato",
    horsepower: 650,
    dollar_value: 64800,
    instock: false,
  },
  {
    name: "Jaguar XKR-S",
    horsepower: 550,
    dollar_value: 132000,
    instock: false,
  },
  {
    name: "Audi R8",
    horsepower: 525,
    dollar_value: 114200,
    instock: false,
  },
  {
    name: "Aston Martin One-77",
    horsepower: 750,
    dollar_value: 1850000,
    instock: true,
  },
  {
    name: "Pagani Huayra",
    horsepower: 700,
    dollar_value: 1300000,
    instock: true,
  },
];

//练习1
const last = (a) => fp.last(a);
const prop = (a) => fp.prop("instock", a);
const isLastInStock = fp.flowRight(prop, last);
console.log(isLastInStock(cars));

//练习2
const first = (a) => fp.first(a);
const p2 = (a) => fp.prop("name", a);
const getName = fp.flowRight(p2, first);
console.log(getName(cars));

//练习3
let _average = function (xs) {
  return fp.reduce(fp.add, 0, xs) / xs.length;
};
let dollarValues = (c) => {
  return fp.map(function (car) {
    return car.dollar_value;
  }, c);
};
let averageDollarValue = fp.flowRight(_average, dollarValues);
console.log(averageDollarValue(cars));

//练习4

let _underscore = fp.replace(/\W+/g, `_`);
let getNames = (c) => {
  return fp.map(function (car) {
    return car.name;
  }, c);
};
let lowerCase = (names) => {
  return fp.map(function (name) {
    return _underscore(fp.lowerCase(name));
  }, names);
};
let sanitizeNames = fp.flowRight(lowerCase, getNames);
console.log(sanitizeNames(cars));
