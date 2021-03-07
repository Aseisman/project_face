// let obj = {
//     0: 10,
//     1: 20,
//     2: 30,
//     3: 40,
//     length: 4,
//     //第一种方法，调用其他已有迭代器的标志
//     // [Symbol.iterator]: Array.prototype[Symbol.iterator]
//     //第二种方法：手写一个
//     [Symbol.iterator]: function () {
//         let self = this,
//             index = 0;
//         return {
//             next() {
//                 if (index > self.length - 1) {
//                     return {
//                         value: undefined,
//                         done: true
//                     };
//                 }
//                 return {
//                     value: self[index++],
//                     done: false
//                 };
//             }
//         };
//     }
// };
// for (let item of obj) {
//     console.log(item);
// }
// let a={
//     b:1,
//     c:2,
//     [Symbol.iterator]: Array.prototype[Symbol.iterator]
// }
// for(let i of a){
//     console.log(i)
// }

// function curry(){
//     //类数组转为数组
//     var _args=Array.prototype.slice.call(arguments);
//     var adder=function(){
//       _args.push(...arguments);
//       return adder;
//     };
//     adder.toString=function(){
//       return _args.reduce(function(a,b){
//         return a+b;
//       });
//     }
//     return adder;
//   }
// // ==比较的时候会先调用toString
//   console.log(curry(1)(2)(3)(4)==10)

let temp = [];
function demo(pre, vin) {
  if (pre.length == 0 || vin.length == 0) return;
  var index = vin.indexOf(pre[0]);
  var left = vin.slice(0, index);
  var right = vin.slice(index + 1);
  demo(pre.slice(1, index + 1), left);
  demo(pre.slice(index + 1), right);
  temp.push(pre[0]);
}
demo([1, 2, 3, 4, 5, 6, 7], [3, 2, 4, 1, 6, 5, 7])
console.log(temp);
