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