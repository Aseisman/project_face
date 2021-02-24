# 网络

1. Grpc:

-   RPC: 框架提供了一套机制（类似 http 协议）使得应用程序间可以进行通信，遵从 server/client 模型，底层是 Http2.0 协议，而 restful api 不一定是 http2.0
    -   1： 通过 proto 通信，定义接口等，有更加严格的接口约束条件；安全性（接口约束）
    -   2： 二进制编码，减少传输的数据量 高性能
    -   3： 支持流式通信（streaming 模式），而 restful api 似乎很少这么用，视频流等都会用专门的协议 HLS，RTMP 等。
        （http2.0 的知识点）

2. http 协议：

-   http 协议分为 1.0 1.1 和 2.0

-   http2 和 http1 的区别：

    -   多路复用：允许单一的 HTTP2 连接同时发起多重请求-响应消息。（可以设置优先级）
    -   二进制编码：HTTP2.0 讲所有的传输信息分割为更小的信息或帧，然后对他们进行二进制编码的首部压缩。
    -   首部压缩：HTTP1.1 的请求和响应都是由状态行、请求/响应头部、消息主体三部分组成，状态行和头部却没有经过任何压缩。而 2.0 支持对 header 进行压缩；
    -   服务器推送（server push）,同 SPDY 一样，http2.0 也具有 server push 功能。

-   http1.0 和 1.1 的区别：

    -   长连接：http1.1 默认开启长连接
    -   节约带宽：http1.1 支持只发送 header 信息，不带任何 body 信息，服务器觉得有权限：返回 100；无权限返回 401；有权限后再发 body 信息。
    -   host 域：http1.0 认为每台服务器只有一个唯一的 ip，因此请求信息中没有传递 hostname，即不存在我们的 host 域；但是我们现在一台服务器可以有多个虚拟主机，共享一个 ip 地址，所以 1.1 在请求消息中添加了 host 域，没给会报 400
    -   缓存处理：1.0 有 if-modify-since（last-modify）、expire；1.1 添加了 E-tag 中的 if-match 和 if-not-match，cache-control 等。
    -   1.1 新增了 24 个错误状态响应码。

-   http 缓存
    -   强缓存：判断是否有 Cache-controller、Expire（no-cache\no-store）、过没过期；
    -   协商缓存：与服务器端对比资源是否进行更新，没更新返回 304，有更新 200，（E-tag，Last-Modified）
    -   Cache-controll(http1.1):no-cache、no-store、max-age（xx 秒）、public/private、must-revalidate
    -   Expires(http1.0):时间点
    -   E-Tag(http1.1):If-Not-Match（hash 算法）
    -   Last-Modified(http1.0):If-Modified-Since:时间点

3. DNS 解析：

4. options 请求：

-   options 方法发起请求，响应报文里面包含一个 allow 首部字段，该字段的值表明了服务器支持的方法；
-   options 的预检请求：在 cors 中，可使用 options 发起预检请求，返回`Access-Control-Request-Method`即服务器可用的 HTTP 方法。

5. 怎样不发 options 请求

-   跨域资源共享 CORS 分为简单请求和非简单请求，发送简单请求不会发起 options 请求
-   简单请求的要素：
    -   只能是 GET POST HEAD
    -   请求头：Accept、Accept-Language、Content-type、等等（不能自定义用户信息）
    -   Content-type 只能取 application/x-www-form-urlencoded、multipart/form-data、text/plain
    -   XMLHTTPRequestUpload 对象没有注册事件监听器，没有 ReadableStream 对象
-   不满足以上任何一点则为非简单请求
    -   PUT、DELETE，不满足
    -   header 带用户信息 token，不满足
    -   Content-type 有些是 application/json，不满足
-   只能减少发起 options 的次数：
    -   后端请求头返回 `Access-Control-Max-Age:number`，表示 options 返回的信息可以缓存多少秒
    -   不同浏览器有不同的上限，火狐 24 小时，谷歌 10 分钟

6. 同源策略：协议+域名+端口都要相同，不同的域名指向同一个 ip 地址，也是非同源的。

7. 跨域资源共享（CORS）：服务端设置 Access-Control-Allow-Origin 即可，前端无须设置，若要带 cookie 请求：前后端都需要设置（withCredentials: true）

8. 跨域：

跨域资源共享（CORS）：服务端设置 Access-Control-Allow-Origin 即可，前端无须设置，若要带 cookie 请求：前后端都需要设置（withCredentials: true）

vue 的`proxy`代理跨域 or react 的`http-proxy-middleware`：设置 proxy 代理接口。`webpack.config.js` `vue.config.js` `setupProxy.js`

websocket：`ws`或者`wss`连接标志.websocket 不会受同源策略的约束。

nginx 的反向代理接口：`nginx.config`

`jsonp`、`document.domain+iframe`、`window.name+iframe`、`postMessage`(主要是对于两个不同域名的一些数据的传递，`postMessage(数据,地址)`)

# HTML&CSS

1. 清除浮动：父元素因为子级元素浮动引起的内部高度为 0 的问题

-   额外标签：最后加个 div，设置为 clear:both;
-   父级添加 overflow:hidden(触发 BFC)
-   after 伪元素清除浮动：`clear:both;content:"",height:0;`
    -   IE 不支持伪元素：加 css：`*zoom:1;`
-   before 和 after 添加双伪元素清除浮动：

```css
.clearfix:after,
.clearfix:before {
    content: '';
    display: table;
}
.clearfix:after {
    clear: both;
}
.clearfix {
    *zoom: 1;
}
```

2. BFC:块级格式化上下文

-   BFC 是一种属性：是一种不受外界影响的独立容器；
-   就比如说对于我们的盒模型来说，两个都设置了 margin 的父子元素，子元素想相对于父元素进行定位时，没有对父元素进行相对定位：而是造成了 margin 塌陷：
-   这个时候我们就可以对于子元素设置 BFC 属性，让他不受我们的父元素的干扰：

-   触发 BFC 属性的 4 种方法：
    -   position:absolute;
    -   display:inline-block;
    -   float:left/right;
    -   overflow:hidden;

3. CSS 布局:

-   圣杯布局（三栏布局）：
-   双飞翼布局（三栏布局）：
-   flex 布局：
-   两栏布局：
-   响应式布局：rem、@media 媒体查询

4. `animation、transition、transform、translate`

-   transform（变形）:可以旋转、缩放、移动、扭曲
-   translate（移动）:是 transform 的一个属性值
-   transition（过渡动画）：transform 是 transition 的一个属性值
-   animation、transition 是 css3 中的两种动画属性:
    -   animation 强调流程与控制，对元素的一个或多个属性的变化进行控制（animation 与@keyframes 结合使用）
    -   transition 强调过渡，是元素的一个或多个属性发生变化时产生的过渡效果。

5. animation 参数及算法

-   animation-timing-function:使用名伟三次贝塞尔函数的数学函数来生成速度曲线
    -   linear：匀速
    -   ease：默认，低->加快->慢
    -   ease-in：低速开始
    -   ease-out:低速结束
    -   ease-in-out：低速开始和结束
    -   cubic-beaier(n,n,n,n)贝塞尔函数

# JavaScript

1. 数组 API

-   Splice 返回什么？
    -   改变原数组，以数组的形式返回被修改的内容。
-   push、unshift 返回新长度
-   pop、shift 返回弹出的值
-   sort、reverse 返回新数组
-   7 个会改变原数组的 API：splice、push、pop、shift、unshift、sort、reverse。

2. 事件循环机制

-   宏仁务：` ` `script、setTimeout、setInterval、I/O、setImmediate(node环境)` ` `
-   微任务：` ` ``promise`、mutationObserver、process.nextTick()` ` `

1、主线程：一开始从上往下；遇到其他宏仁务，放置到宏仁务列队中，遇到微任务，放置到微任务列队中

2、然后等主线程宏仁务做完，就检查是否有微任务，然后就做完微任务，

3、微任务做完后，再看看有没有宏仁务，有的话就继续做宏仁务。

-   DOM 事件是一个过程
    -   行为触发：（异步）什么时候用户点击、返回响应，这都是未知的也就是异步的。（宏仁务）（addListener 是宏仁务）
    -   事件处理：（同步）系统接收到事件触发，找到对应 dom 的回调函数、并执行的过程是同步的。(用户点击执行 click 是同步)

3. nodejs 事件循环机制

-   Node.js 采用事件驱动和异步 I/O，实现单线程、高并发的运行环境

```
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<─────┤  connections, │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```

-   每个阶段结束后都会判断是否存在微任务，有则执行。
    -   微任务分为：process.nextTick()和 ` promise``.then `(),nextTick 比 then 早。
-   初次进入事件循环，从 timer 开始，会判断是否存在 setTimeout 和 setInterval，存在则执行，完毕->微任务->I/O callbacks ->Idle/prepare ->poll 轮询
-   poll 轮询回调列队：
    -   列队不为空：执行回调
        -   触发了相应的微任务，等这个回调执行完毕就执行对于的微任务
    -   列队为空：
        -   有 setTimeout 和 setInterval 倒计时结束，会结束 poll，去 timer 执行 callback
        -   有 setImmidate,结束 poll，去 check
        -   否则阻塞，等待新的回调进来
-   check: 处理 setImmediate 的回调。
-   close callback:执行一些回调，线程 socket 等。

4. 类型判断方法

-   typeof:

    -   返回字符串形式："number"、'string'、'function'
    -   只能判断普通类型和函数，数组等 object 类型均返回'object'

-   instanceof: 用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。

    -   对于 number 和 string 等普通类型的定义来说，除了用 new 去创建的，其他类似`var a=123`用`a instance of Number`去判断结果都是 false
    -   `{}`除外,对于 Object 类型来说，`var a={b:123}`可以用 instanceof 去判断。
    -   String、Date、Number 等的都是基于 Object 衍生的，原型链可以解释。所以对于 Number 等类型来说，instanceof Object 均为 true -`!mycar instanceof Car`和`!(mycar instanceof Car)`不一样，`!mycar`对隐式转换成 boolean 值。
    -   详情参考 MDN：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof

-   isNaN():判断是不是 NaN 类型

    -   会对传入的值进行隐式转换成 Number 类型，如果能够转换成功，则不是 NaN 类型，如果转换失败，则返回 true

-   Object.is()
    -   传入两个值，判断两个值类型是否相等

5. 深拷贝&&浅拷贝

-   深拷贝：

    -   JSON.stringify()\JSON.parse()
    -   遍历对象的 key，把对应的 value 赋给新的对象的 key 上。由于有的 value 还是个对象，所以需要递归克隆；
    -   循环引用的问题：es6 的 WeakMap 可以解决，或自己开一个数组保存遍历过的值，判断是否存在。
    -   WeakMap 是以对象为键的键值对，所以我们把对象存进去判断是否有该对象，如果有的话我们就不用再进行循环了。

    ```js
    //判断是什么类型
    function isObject(obj) {
        return (
            Object.prototype.toString.call(obj) === '[object Object]' ||
            Object.prototype.toString.call(obj) === '[object Array]'
        ); //判断是不是对象，typeof不可行，typeof无法解决正则、Date类型
    }
    function deepcopy(source, hash = new WeakMap()) {
        if (!isObject(source)) return source;
        if (hash.has(source)) return hash.get(source); //已经深拷贝过一次了，直接返回
        // 判断参数是对象还是数组来初始化返回值
        let res = Array.isArray(source) ? [] : {};
        hash.set(source, res); // 哈希表添加新对象
        //循环
        for (let key in source) {
            //属于本身
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (isObject(source[key])) {
                    res[key] = deepcopy(source[key], hash);
                } else {
                    res[key] = source[key];
                }
            }
        }
        return res;
    }
    ```

-   浅拷贝：只拷贝对象的第一层
    -   `Object.assign({},obj)`返回新的对象
    -   展开运算符`a={...b}`

6. 遍历对象的方法

-   foreach
-   for...in、for...of
-   Array.prototype.map()
-   Array.prototype.reduce((v1,v2,index,arr)=>{})v1 是累加值、v2 是当前值、index 为当前索引、arr 为原数组
-   Array.prototype.filter(()=>{})返回新数组
-   Array.prototype.every(()=>{})参数为函数，每一项都返回 true，则 true。false 则退出遍历。
-   Array.prototype.some(()=>{})参数为函数，只要有一项返回 true，则退出遍历，返回 true。否则一直循环，最后返回 false。
-   Array.prototype.keys() values() entries()遍历键、值、键值对

7. 迭代器 Iterator

-   提供统一的接口，为不同的数据结构提供统一的访问机制。(Map,Set,Array)
-   迭代器对象包含一个 next()方法，调用 next()返回(done:boolean , value:any)(与生成器一致，后面可以用生成器模拟)
-   标志：Symbol.iterator

8. 生成器 Generator

-   function 有个\*号
-   yield 表达式:函数内使用，走到哪停到哪
-   生成器函数执行后，会返回一个迭代器对象{done,value}
-   生成器可以看作是迭代器的语法糖

9. 普通对象迭代方法：

-   用生成器构造 Symbol.iterator 即可

```js
let obj = {
    0: 10,
    1: 20,
    2: 30,
    3: 40,
    length: 4,
    //第一种方法，调用其他已有迭代器的标志
    // [Symbol.iterator]: Array.prototype[Symbol.iterator]
    //第二种方法：手写一个
    [Symbol.iterator]: function () {
        let self = this,
            index = 0;
        return {
            next() {
                if (index > self.length - 1) {
                    return {
                        value: undefined,
                        done: true,
                    };
                }
                return {
                    value: self[index++],
                    done: false,
                };
            },
        };
    },
};
for (let item of obj) {
    console.log(item);
}
```

10. Promise

-   是什么： 异步编程的一种解决方案
-   定义：

    -   `promise` 构造函数是同步执行的，`promise.then` 是异步执行的。
    -   `promise` 有 3 种状态，pending、fulfilled、rejected。只能从 pengding->fulfilled 或者 pending->rejected
    -   构造函数种 resolve 和 reject 只有第一次执行有效，多次调用没有任何作用。
    -   `promise` 可以链式调用，每次 `promise` 调用`.then` 或者.catch 都会返回一个新的 `promise` 对象
    -   `.then` || .catch 返回的值不能是 `promise` 本身，否则会造成死循环
    -   `.then` 可以接收两个回调函数：成功函数、失败函数。`.catch` 是`.then` 的第二个参数的简便写法，
        -   不同: `.then` 的错误函数捕获不了第一个成功函数抛出的错误，而`.catch` 可以。

-   `Promise.all`: 接受 promise 对象数组，全成功->`.then` 或者 只要出现一个失败，则失败`.catch`。注意：如果在单个请求中定义了 catch 方法，则不会进入 promise.all 的 catch 中。

    -   原理：

    ```js
    Peomise.all = function (values) {
        return new Promise((resolve, reject) => {
            let results = []; // 结果数组
            let i = 0;
            let processData = (value, index) => {
                results[index] = value;
                // 当成功的个数 和 当前的参数个数相等就把结果抛出去
                if (++i === values.length) {
                    resolve(results);
                }
            };
            for (let i = 0; i < values.length; i++) {
                let current = values[i]; // 拿到数组中每一项
                // 判断是不是一个promise
                if (
                    (typeof current === 'object' && current !== null) ||
                    typeof current == 'function'
                ) {
                    // 如果是promise
                    if (typeof current.then == 'function') {
                        // 就调用这个promise的then方法，把结果和索引对应上,如果任何一个失败了返回的proimise就是一个失败的promise
                        current.then(y => {
                            processData(y, i);
                        }, reject);
                    } else {
                        processData(current, i);
                    }
                } else {
                    processData(current, i);
                }
            }
        });
    };
    ```

-   `Promise.race`: 接受 promise 对象数组，谁跑的快，则执行谁的回调函数。
-   例题：

    -   `promise.race`使用情况：发送一个请求，限制时间为 2 秒

    ```js
    function request() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('来自服务器的message');
            }, Math.random() * 5000);
        });
    }
    function resolve() {
        //code here
        let second = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject('超时');
            }, 2000);
        });
        let arr = [request(), second];
        return Promise.race();
    }
    resolve()
        .then(res => console.log(res))
        .catch(err => console.log(err));
    ```

    -   实现一个批量请求函数 multiRequest(urls,maxNum):
        -   最大并发数 maxNum
        -   每当有一个请求返回，就留下一个空位，可以增加新的请求
        -   所有请求完成后，结果按照 urls 里面的顺序依次打出

    ```js
    function multiRequest(urls = [], maxNum) {
        const len = urls.length;
        const result = new Array(len).fill(false);
        let count = 0;
        return new Promise((resolve, reject) => {
            //count来限制并发个数
            while (count < maxNum) {
                next();
            }
            function next() {
                let current = count++;
                if (current >= len) {
                    !result.includes(false) && resolve(result);
                    return;
                }
                const url = urls[current];
                console.log(`开始请求`);
                fetch(url)
                    .then(res => {
                        result[current] = res;
                        console.log('完成');
                        if (current < len) {
                            next();
                        }
                    })
                    .catch(err => {
                        console.log('结束');
                        result[current] = err;
                        if (current < len) {
                            next();
                        }
                    });
            }
        });
    }
    ```

11. 判断数组的方法：

-   obj instanceof Array;
-   toString(obj)返回`[object Array]`
-   Array.isArray(obj);
-   Array.prototype.isPrototypeOf([1,2,3]):判断 Array 是不是在 obj 的原型链上。如果是则返回 true。

# React

1. 什么是虚拟 DOM：

-   真实 DOM 的内存表示，一种编程概念，一种模式。

2. 类组件和函数组件之间有什么区别？

-   共同点：都是纯函数，无法修改 props

-   区别：
    -   函数组件性能比类组件高；
    -   类组件使用时需要实例化，而函数组件可以直接执行，返回结果即可。
    -   this、生命周期、state 等等的区别。

3. refs 作用是什么？

-   refs 提供访问 DOM 元素或者某个组件实例的入口

4. react 的事件处理机制（SyntheticEvent）

```markdown
-   事件处理机制

三阶段:捕获、目标、冒泡

可以通过事件目标对象的 eventPhase 属性来得知当前事件在什么阶段。（1 捕获，2 目标，3 处理）

addEventListener 注册事件，其中参数有 useCapture：true 时该事件在捕获阶段触发，false 在冒泡阶段触发。默认是冒泡。

e.stopPropation:阻止事件向下捕获或者向上冒泡。

为什么要阻止事件传递：因为防止点透现象（父与子都有 click，都被触发，但我们只想触发子的）
e.preventDefault：阻止默认事件，不会阻止事件传递。

事件代理：事件委托：
多个子元素的同一事件可以绑定在父元素上。提高效率，减少代码量。

-   父元素通过`e.target`或者`e.srcElement`（IE）识别子元素。然后再判断子元素是不是相应的标签`nodeName`
```

-   React 中，默认事件传播方式为冒泡：
-   onClickCapture 来绑定捕获事件，
-   React 事件委托，由于有冒泡机制，用 e.stopPropation 阻止冒泡
-   SyntheticEvent 中事件的 event 对象，不是原生的 event 对象

5. state 和 props 有什么区别？

6. setState 是异步还是同步？

-   合成事件中是异步（多个 setState 合在一起，提高性能）
-   钩子函数中是异步（setState 中提供一个回调函数）
-   原生事件中是同步（addEventListener 事件）
-   setTimeout 中是同步

7. react@16.4+生命周期

-   三阶段：挂载阶段、组件更新阶段、卸载阶段
-   16 前：
    -   挂载阶段：constructor、conponentWillMount、componentDidMount、conponentWillUnMount；
    -   更新阶段：
        -   `componentWillReceiverProps(nextProps)`：父组件传过来的 props 更新，进行 props 对比，更新 props 中的 state。
        -   `shouldComonentUpdate(props,state)`:性能优化，对比 props、state 是否改变，改变了则可以重新渲染。
        -   `componentWillUpdate(nextprops,nextstate)`;
        -   `componentDidUpdate(preprops,prestate)`;
    -   render:渲染：
-   16 后：
    -   `getDerivedStateFromProps(nextProps,nextState)`:代替`componentWillReceiveProps`
    -   `getSnapshotBeforeUpdate(preProps,preState)`:代替`componentWillUpdate`可以读取到 DOM 元素，在 render 之前被调用，保证 dom 与 componentDidUpdate 一致。

| class 组件                | Hooks 组件                |
| ------------------------- | ------------------------- |
| getDerivedStateFromProps  | useState 中的 update 函数 |
| shouldComponentUpdate     | useMemo                   |
| componentDidMount、Update | useEffect                 |

8. useEffect(fn,[])和 componentDidMount 有什么差异？

-   useEffect 会捕获初始的 props 和 state、想获取最新的值，可以使用 refs

9. hooks 为什么不能放在条件判断里？

-   以 setState 为例，在 react 内部，每个组件中的 hooks 都是以链表的形式存在 memoizeState 属性中的，如果用条件判断，导致 setState 不生效，则没有执行 setState 中的方法，导致链表后面的 next 没有执行，setState 的取值出现偏移，导致异常。

10. fiber 是什么？

-   React Fiber 是一种基于浏览器的单线程调度算法
-   React Fiber 用类似 requestIdleCallback 的机制来做异步 diff。但是之前数据结构不支持这样的实现异步 diff，于是 React 实现了一个类似链表的数据结构，将原来的 递归 diff 变成了现在的 遍历 diff，这样就能做到异步可更新了。

11. diff 算法

-   传统 diff 时间复杂度 O（n^3）,最后 O(n)
-   1、tree diff:同层对比 dom 节点，忽略 dom 节点的跨层级移动
-   2、组件 diff：如果不是同一类型的组件，会删除旧的组件、创建新的组件
-   3、同一层级的一组子节点，通过唯一 id 进行区分、也就是唯一 key

12. setState 之后发生了什么？

-   setState 时，创建一个 updateQueue 的更新列队。
-   触发 reconciliation：触发 fiber 的调度算法，生成新的 fiber 树，异步可中断的执行
-   react scheduler 会根据优先级高低，限制性优先级高的节点，具体是 doWork 方法。
-   在 doWork 方法中，React 会执行一遍 updateQueue 中的方法，以获得新的节点。然后对比新旧节点，为老节点打上 更新、插入、替换 等 Tag。
-   当前节点 doWork 完成后，会执行 performUnitOfWork 方法获得新节点，然后再重复上面的过程。
-   当所有节点都 doWork 完成后，会触发 commitRoot 方法，React 进入 commit 阶段。
-   在 commit 阶段中，React 会根据前面为各个节点打的 Tag，一次性更新整个 dom 元素。

13. 为什么虚拟 dom 会提高性能?

-   虚拟 dom 相当于在 JS 和真实 dom 中间加了一个缓存，利用 diff 算法避免了没有必要的 dom 操作，从而提高性能。

14. 错误边界

-   在 React 中，如果任何一个组件发生错误，它将破坏整个组件树，导致整页白屏。这时候我们可以用错误边界优雅地降级处理这些错误。

15. React 组件间有那些通信方式?

-   父组件向子组件通信
    -   1、 通过 props 传递
-   子组件向父组件通信
    -   1、 主动调用通过 props 传过来的方法，并将想要传递的信息，作为参数，传递到父组件的作用域中
-   跨层级通信
    -   1、 使用 react 自带的 Context 进行通信，createContext 创建上下文， useContext 使用上下文。
    -   使用 Redux 或者 Mobx 等状态管理库
    -   使用订阅发布模式

16. React 父组件如何调用子组件中的方法？

-   如果是在方法组件中调用子组件（>= react@16.8），可以使用 useRef 和 useImperativeHandle:
-   如果是在类组件中调用子组件（>= react@16.4），可以使用 createRef；

17. React 有哪些优化性能的手段?

-   类组件中的优化手段
    -   1、使用纯组件 PureComponent 作为基类。
    -   2、使用 React.memo 高阶函数包装组件。
    -   3、使用 shouldComponentUpdate 生命周期函数来自定义渲染逻辑。
-   方法组件中的优化手段
    -   1、使用 useMemo。
    -   2、使用 useCallBack。
-   其他方式
    -   1、在列表需要频繁变动时，使用唯一 id 作为 key，而不是数组下标。
    -   2、必要时通过改变 CSS 样式隐藏显示组件，而不是通过条件判断显示隐藏组件。
    -   3、使用 Suspense 和 lazy 进行懒加载

18. react hook 优缺点：

-   优点：更容易复用代码：通过自定义 hooks 来复用状态，解决类组件有时候难以复用的逻辑。
    -   具体：useHook 生成一份独立的状态，开辟内存空间。
    -   与高阶组件对比：高阶组件也能做到，但是对于 hooks 实现起来代码量少，而且高阶组件太多层，代码会难以阅读。
    -   写的舒服，清爽的代码风格
-   缺点：
    -   响应式的 useEffect：useEffect 和 useCallback 等 api 的第二个参数的触发时机难掌控；
    -   状态不同步：函数的运行是独立的，有独立的作用域，异步操作的时候，经常会朋友异步回调的变量引用时之前的。（可以通过用 UseRef 来解决）

19. useMemo 和 useCallback 的好处

-   usememo 和 useCallback 都可以通过监听特定的参数来判断是否在渲染阶段重新计算对应的数值或者是对应的函数，好处便是做到性能的优化。
-   区别：useMemo 通常用于计算一个数值，可以是状态的改变等；而 useCallback 缓存的是函数，就比如子组件啥的，只要 props 没有改变，那么子组件就不需要刷新，使用 useCallback 可以不用让子组件刷新。

20. useEffect 和 useLayoutEffect 的区别：

-   useEffect 在渲染时是异步执行，并且要等到浏览器将所有变化渲染到屏幕后才会被执行。
-   useLayoutEffect 在渲染时是同步执行，其执行时机与 componentDidMount，componentDidUpdate 一致

21. useEffect 和 useLayoutEffect 哪一个与 componentWillUnmount 的是等价的？
- useLayoutEffect 的 detroy 函数的调用位置、时机与 componentWillUnmount 一致，且都是同步调用。

22. 为什么建议将修改 DOM 的操作里放到 useLayoutEffect 里，而不是 useEffect？
- 减少回流、重绘
- DOM 已经被修改，但但浏览器渲染线程依旧处于被阻塞阶段，所以还没有发生回流、重绘过程。由于内存中的 DOM 已经被修改，通过 useLayoutEffect 可以拿到最新的 DOM 节点，并且在此时对 DOM 进行样式上的修改，假设修改了元素的 height，这些修改会在步骤 11 和 react 做出的更改一起被一次性渲染到屏幕上，依旧只有一次回流、重绘的代价。
# 算法

-   快排：(分治法)

```js
function quickSort(arr) {
    if (arr.length < 2) return arr;
    let left = [],
        right = [];
    let temp = arr[0];
    arr.forEach(e => {
        if (e < temp) left.push(e);
        else if (e > temp) right.push(e);
    });
    return quickSort(left).concat(biaoji, quickSort(right));
}
function quickSort(arr, i, j) {
    if (i < j) {
        let left = i,
            right = j;
        let temp = arr[left];
        while (i < j) {
            while (arr[j] >= temp && i < j) {
                j--;
            }
            if (i < j) {
                arr[i++] = arr[j];
            }
            while (arr[i] <= temp && i < j) {
                i++;
            }
            if (i < j) {
                arr[j--] = arr[i];
            }
        }
        arr[i] = temp;
        quickSort(arr, left, i - 1);
        quickSort(arr, i + 1, right);
        return arr;
    }
}
```

-   插排：

```js
function insertSort(arr) {
    let len = arr.length;
    var preIndex, current;
    for (let i = 1; i < len; i++) {
        preIndex = i - 1;
        current = arr[i];
        while (current < arr[preIndex] && preIndex >= 0) {
            arr[preIndex + 1] = arr[preIndex];
            preIndex--;
        }
        arr[preIndex + 1] = current;
    }
    console.log(arr);
    return arr;
}
```

-   防抖:一段时间内，多次执行某个方法，只执行最新的那个请求

```js
function debounce(func, wait) {
    var timeout = null;
    return function () {
        let context = this;
        let args = arguments;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}
```

-   节流：一段时间内，多此执行某个方法，在一段时间内只执行一次。多次发起请求，不会理会。

```js
function throttle(func, wait) {
    let timeout = null;
    return function () {
        let context = this;
        let args = arguments;
        if (!timeout) {
            timeout = setTimeout(() => {
                func.apply(context, args);
                timeout = null;
            }, wait);
        }
    };
}
```

-

# 其他

1. 事件处理机制：

-   三阶段：捕获、目标、冒泡
-   可以通过事件目标对象的 eventPhase 属性来得知当前事件在什么阶段。（1 捕获，2 目标，3 处理）
-   addEventListener 注册事件，其中参数有 useCapture：true 时该事件在捕获阶段触发，false 在冒泡阶段触发。默认是冒泡。
-   e.stopPropation:阻止事件向下捕获或者向上冒泡。
-   e.preventDefault:阻止默认事件，不会阻止事件传递。

2. 为什么要阻止事件传递：

-   因为防止点透现象（父与子都有 click，都被触发，但我们只想触发子的）

3. 事件委托：

-   多个子元素的同一事件可以绑定在父元素上，提高效率，减少代码量。
-   父元素通过`e.target`或者`e.srcElement`（IE）识别子元素。然后再判断子元素是不是相应的标签`nodeName`

# 项目

1. Grpc:

-   RPC: 框架提供了一套机制（类似 http 协议）使得应用程序间可以进行通信，遵从 server/client 模型，底层是 Http2.0 协议，而 restful api 不一定是 http2.0
    -   1： 通过 proto 通信，定义接口等，有更加严格的接口约束条件；安全性（接口约束）
    -   2： 二进制编码，减少传输的数据量 高性能
    -   3： 支持流式通信（streaming 模式），而 restful api 似乎很少这么用，视频流等都会用专门的协议 HLS，RTMP 等。
        （http2.0 的知识点）

2. 前端架构：

基础结构：

-   MPA(multi-page-application)多页面应用：
    -   跳转需要刷新所有的资源，css、js 等公共资源需要选择性加载
    -   数据传递可以用 url 路径携带、localstorage、cookie 等
-   SPA(single-page-application):单页面
    -   单页面跳转仅仅只是刷新局部资源，css、js 等公共资源仅需加载一次
-   MPA 结合 SPA:
    -   路由导航+资源加载框架

解决的问题：

-   人多、团队多、普通应用变成巨型应用，不可维护问题；

方式：

-   乾坤

# 性能优化

1. 图片

-   缩短请求响应时间
    -   浏览器针对同一个域名有并发请求数量限制，可静态资源采用多个子域名，特别是图片域名（京东 PC 页面用到的商品图片域名就是多个子域名的方法）
    -   CDN
-   减少请求数
    -   缓存（浏览器缓存）
    -   图片 base64 编码
    -   图片懒加载（react-loadLazy）
-   减少请求大小
    -   图片使用 webp 格式：大小缩小 30%-50%，懒加载过程中，判断是否支持 webp，后期可以优化为：服务器依据请求头是否支持 webp，支持则自动返回 webp 格式的图片。
