//1
var hobby = 'basketball'
var obj0 = {
    hobby:'football',
    myRealHobby: this.hobby,//这里的this是指向了全局
    f2(){
        var s = 'hpf'
        console.log('对象内this指向' + this.myRealHobby)
        //这道题在浏览器与node下都是非严格模式，非严格模式下this指向的就是window or global
        //obj0.f2()执行到这里的时候，this是obj0，obj0.myRealHobby也就是全局的hobby，
        //对于浏览器，全局默认指向window，而node指向global
        //window.hobby=basketball
        //global.hobby=undefined
        //node模式中，每个模块都有对应的模块作用域，而不是全局作用域
        console.log('对象内父函数this指向' + this)
        return function(){
            console.log('函数内子函数this指向' + this)
            return s
        }
    }
}
var f = obj0.f2()
//f2()中的this是指向obj0
console.log(f());
console.log(global.hobby);//undefined
console.log(this.hobby);//undefined
console.log(hobby);//basketball

// 差别在作用域上，node 默认没有启用严格模式。
// 浏览器中，全局作用域下声明的变量会自动成为全局变量（window 下的一个属性）。
// node中，每个模块（文件）有自己模块作用域，你在里面声明一个变量并不会成为 node 的全局变量，而只是这个模块作用域下的变量。


//2
const a=1
const o={
  a:12,
  fn:function(){
    console.log(this.a)
  }
}
const fn=o.fn;
fn()//undefined
//知识点：const和let定义的变量不放在全局上。只是在一个块级作用域中

//3
var a = 1;
(function a() {
    a = 2;
    console.log(a);
})();
console.log(a);
//对于立即执行函数，不会存在变量提升与函数提升的情况！！
//立即执行函数有自己独立的作用域。
//函数的name是只读的。
//function a(){} Object.getOwnPropertyDescriptor(a,'name');
//会输出 {'value':'a','writable':false,'enumerable':false};
//我们会发现。对于一个函数是不可写的，所以a=2这句话中的a其实是function的a，赋值失效。在严格模式下会报错。
//所以打印的a其实是这个函数function a(){ a=2;console.log(a);}
//第二个console.log(a)依然是1，没有变过

// 4
var a = {};
b = { key: 'b' };
c = { key: 'c' };
a[b] = 123;
a[c] = 456;
console.log(a); //{ '[object Object]': 456 }​​​​​
console.log(a[b]); //456
//b和c没有声明，默认声明var到全局
//a[b]和a.b不一样
//a[b]是将b的值作为属性
//a.b是将'b'直接作为属性
//所以a打印的是a:{[object Object]:456}
//因为属性是字符串，默认转换，所以是[object Object]
//就像 b.toString()

//5
console.log(1+'2'+'2')//122
console.log(1+ +'2'+'2')//32
console.log(1+ -'1'+'2')//02
console.log(+'1'+'1'+'2')//112
console.log('A'-'B'+'2')//NaN2
console.log('A'-'B'+2)//NaN

//6 
var i=1;
(function(){
  var start=new Date().getTime();
  var si=setInterval(function(){
    var now=new Date().getTime();
    if(now<(start+100)){
      i++;
    }else{
      console.log(i);
      clearInterval(si);
    }
  },10);
})();//8,9,10都有可能
//异步编程的问题

//7
var s1 = new String('zxc');
var s2 = new String('zxc');
console.log(s1 == s2);//false
console.log(s1 === s2);//false
//基本包装类比较的是对象的地址，各自new了一个对象之后，地址不同
//如果是 s1='zxc' s2='zxc',那么他们就是同一个地址。

//8 未解决
new Promise((resolve) => {
  console.log(0);
  resolve(Promise.resolve(4));
}).then((res) => {
  console.log(res);
});

new Promise((resolve) => {
  console.log(1);
  resolve();
})
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(5);
  })
  .then(() => {
    console.log(6);
  });
//额外知识点：交替执行因为每次 then 里面 都会默认 return Promise 进入微任务队列
//0,1,2,3,4,5,6
//这里的promise.resolve相当于微任务里面又创建了一个微任务，也就是说当0、1后本来应该是这个微任务执行的，但是执行的却是新增加了一个微任务

//9.未解决
Promise.resolve('a').then('b').then(Promise.resolve('c')).then(console.log);
//答案：a

//10
!function say(){console.log(234)}();
say();
// 在函数前加！+ - ~等都是作为一个自执行函数的一个方式，所以会立即执行
// 由于自执行函数有个独立的作用域，所以say方法在全局是不存在的，会报错，找不到这个函数

//11
let arr=[1,2,3,4,5]
console.log(arr.reverse());
console.log(arr.reverse(1));
console.log(arr.reverse(1,-1));
//reverse没有参数

console.log(arr.slice(1,-1));
//slice参数：从1开始，到倒数第二个结束。（不包括倒数第二个）
console.log(arr.slice(1,3));
//从下标1开始，到下标3结束 （不包括3）

//12
(function(){
  try{
    throw new Error();
  }catch(x){
    var x=1,y=2;
    console.log(x);
  }
  console.log(x);
  console.log(y);
})();
//输出 1 undefined 2
//对于catch中的x来说，x是catch作用域的变量，已经在函数catch声明时已经定义好了，下面的var已经不起作用了，所以一开始的x是错误语句，然后被赋值成1了
//所以catch中的log是1,而对于外面的log(x)，x不是全局变量，所以不存在，undefined
//log(y)中的y在catch中，var y=2;设为了全局变量了，所以log(y)为2；

//13
var length=10;
function fn(){
  console.log(this.length);
}
var obj={
  length:5,
  method: function(fn){
    fn();
    argument[0]();
  }
};
obj.method(fn,1);
//obj调用了method，所以method中的this是obj，而method中的fn()是没有this指向的，也就是默认全局的fn执行，所以输出10
//argument类数组的特点：类数组中的this.length指的是这个数组的长度，所以argument[0]()的时候，对于这个argument[0]也就是fn,fn执行的时候的this指的是类数组，所以输出2

//14
// 问题：当var a=_____时，if(a==1&&a==2&&a==3)console.log(1);会输出1；

//1
//如果原始类型和对象比较，对象会转为原始类型的值在进行比较。
// 对象转换为原始类型的值，先调用对象的 valueOf 方法，如果返回的还是对象，再接着调用 toString 方法
//a.valueOf()是a的这个对象，a.valueOf().toString()返回自定义的东西
var a={
  i:1,
  toString:function(){
    return a.i++;
  }
};

//2
//array也是对象，array的toString
// console.log(a.toString());  输出：1,2,3
//aray隐式转换的时候，自动调用toString 方法返回一个字符串（该字符串由数组中的每个元素的 toString() 方法返回值，再经过调用 join() 方法连接（由逗号隔开）组成）。
//数组 toString 方法会调用本身的 join() 方法
//这里把自己的 join() 方法改写为 shift() 方法,并删除前一个值，从而达到目的
var a=[1,2,3];
a.join=a.shift;

if(a==1&&a==2&&a==3)console.log(1);
