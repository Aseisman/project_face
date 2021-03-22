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

// let temp = [];
// function demo(pre, vin) {
//   if (pre.length == 0 || vin.length == 0) return;
//   var index = vin.indexOf(pre[0]);
//   var left = vin.slice(0, index);
//   var right = vin.slice(index + 1);
//   demo(pre.slice(1, index + 1), left);
//   demo(pre.slice(index + 1), right);
//   temp.push(pre[0]);
// }
// demo([1, 2, 3, 4, 5, 6, 7], [3, 2, 4, 1, 6, 5, 7])
// console.log(temp);

// function vue2(){
//   let state={
//     count:0
//   }
//   let active;
//   function defineReactive(obj){
//     for(let key in obj){
//       let value=obj[key];
//       let dep=[];
//       Object.defineProperty(obj,key,{
//         get(){
//           if(active){
//             dep.push(active);
//           }
//           return value;
//         },
//         set(newValue){
//           value=newValue;
//           dep.forEach(watcher=>watcher());
//         }
//       })
//     }
//   }
//   defineReactive(state);
//   //模拟,watcher将一个个fn，即监听者放入dep数组中。
//   const watcher=(fn)=>{
//     active=fn;
//     fn();
//     active=null;
//   }
//   watcher(()=>{
//     app.innerHTML=state.count;
//   })
//   watcher(()=>{
//     console.log(state.count);
//   })
// }

// var hobby = 'basketball'
// var obj0 = {
//     hobby:'football',
//     myRealHobby: this.hobby,//这里的this是指向了全局
//     f2(){
//         var s = 'hpf'
//         console.log('对象内this指向' + this.myRealHobby)
//         //这道题在浏览器与node下都是非严格模式，非严格模式下this指向的就是window or global
//         //obj0.f2()执行到这里的时候，this是obj0，obj0.myRealHobby也就是全局的hobby，
//         //对于浏览器，全局默认指向window，而node指向global
//         //window.hobby=basketball
//         //global.hobby=undefined
//         console.log('对象内父函数this指向' + this)
//         return function(){
//             console.log('函数内子函数this指向' + this)
//             return s
//         }
//     }
// }
// var f = obj0.f2()
// //f2()中的this是指向obj0
// console.log(f());
// console.log(global.hobby);//undefined
// console.log(this.hobby);//undefined
// console.log(hobby);//basketball

// const a=1
// const o={
//   a:12,
//   fn:function(){
//     console.log(this.a)
//   }
// }
// const fn=o.fn;
// fn()

// function fun(n,o){
//     console.log(o);
//     return {
//         fun:function(m){
//             return fun(m,n);
//         }
//     }
// }
// var a=fun(0);
// a.fun(1)
// a.fun(2)
// a.fun(3)

// var i=1;
// (function(){
//   var start=new Date().getTime();
//   var si=setInterval(function(){
//     var now=new Date().getTime();
//     if(now<(start+100)){
//       i++;
//     }else{
//       console.log(i);
//       clearInterval(si);
//     }
//   },10);
// })();

// var s1 = new String('zxc');
// var s2 = new String('zxc');
// console.log(s1 == s2);//false
// console.log(s1 === s2);//false
// //reduce的原理是累加
// Array.prototype.reduce=function(callback,prev){
//     for(let i=0;i<this.length;i++){
//         if(typeof prev==='undefined'){
//             prev=callback(this[i],this[i+1],i+1,this);
//         }else{
//             prev=callback(prev,this[i],i,this);
//         }
//     }
//     return prev;
// }

// function myNew(fun){
//     let temp={}
//     temp.__proto__=fun.prototype
//     fun.call(temp,...arguments);
//     return temp;
// }

// function find(coins, amount) {
//   //动态规划
//   //dp代表什么，dp[i]表示凑到i元的最少硬币数
//   let dp = new Array(amount + 1).fill(Infinity);
//   dp[0] = 0;
//   for (let i = 1; i <= amount; i++) {
//     for (let coin of coins) {
//       if (i - coin >= 0) {
//         dp[i] = Math.min(dp[i], dp[i - coin] + 1);
//       }
//     }
//   }
//   return dp[amount] == Infinity ? -1 : dp[amount];
// }

// console.log(find([1, 2, 5], 11));

// Array.prototype.reverse=function(){
//     let arr=this;
//     var left=0,right=arr.length-1;
//     while(left<right){
//       [arr[left],arr[right]]=[arr[right],arr[left]];
//       left++;
//       right--;
//     }
//   }
//   var arr=[1,2,3,4,5];
//   arr.reverse();
//   console.log(arr);

// function isPrinme(n) {
//   if (n == 0 || n == 1) {
//     return false;
//   }
//   if (n == 2) {
//     return true;
//   }
//   for (var i = 2; i < Math.sqrt(n); i++) {
//     if (n % i == 0) {
//       return false;
//     }
//   }
//   return true;
// }
// function find(num) {
//   for (let i = 2; i <= ((num / 2) | 0); i++) {
//       if(isPrinme(i)&&isPrinme(num-i)){
//           console.log(i,num-i);
//           return;
//       }
//   }
// }
// find(210);

// function demo(s) {
//   let res = 0,
//     temp = "";
//   const len = s.length;
//   for (let i = 0; i < len; i++) {
//     if (temp.indexOf(s[i]) == -1) {
//       temp += s[i];
//       res = Math.max(res, temp.length);
//     } else {
//       temp = temp.slice(temp.indexOf(s[i]) + 1);
//       temp += s[i];
//     }
//   }
//   return res;
// }
// console.log(demo("abcdefgabasdabcde"));

// const name="abc"
// const obj={
//   name:"ccc",
//   say:function(){
//     console.log(this.name);
//   }
// }
// const f=obj.say
// f()

// const a=1
// const o={
//   a:12,
//   fn:function(){
//     console.log(this.a);
//   }
// }
// const fn=o.fn
// fn()