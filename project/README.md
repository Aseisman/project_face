# 网络

1. Grpc:

- RPC: 框架提供了一套机制（类似 http 协议）使得应用程序间可以进行通信，遵从 server/client 模型，底层是 Http2.0 协议，而 restful api 不一定是 http2.0
  - 1： 通过 proto 通信，定义接口等，有更加严格的接口约束条件；安全性（接口约束）
  - 2： 二进制编码，减少传输的数据量 高性能
  - 3： 支持流式通信（streaming 模式），而 restful api 似乎很少这么用，视频流等都会用专门的协议 HLS，RTMP 等。
    （http2.0 的知识点）

2.  从输入 url 到页面展示，这中间发生了什么？

- 1. URL 解析

  - 协议、域名、端口
    - HTTP 是明文传输协议，连接简单，是无状态的。
    - HTTPS 协议是由 SSL+HTTP 协议构建的可进行加密传输、身份认证的网络协议，比 HTTP 协议安全。
    - 端口号：HTTP 80，HTTPS 443。FTP 21
  - 编码
    - encodeURI 编码/ decodeURI 解码

- 2. 缓存检查

  - 打开网页：查找硬盘缓存中是否有匹配，如有则使用，如没有则发送网络请求。
  - 普通刷新 (F5)：因 TAB 没关闭，因此内存缓存是可用的，会被优先使用，其次才是硬盘缓存。
  - 强制刷新 (Ctrl + F5)：浏览器不使用缓存，因此发送的请求头部均带有 Cache-control: no-cache，服务器直接返回 200 和最新内容。
  - 强缓存与协商缓存

- 3. DNS 解析：将域名解析成 IP 地址；

  - 1. 递归查询：主机向本地域名服务器的查询采用递归查询
    - 客户端->浏览器缓存->本地 hosts 文件->本地 DNS 解析缓存->本地 DNS 服务器
  - 2. 迭代查询：本地域名服务器向根域名服务器的查询
    - 客户端->本地 DNS 服务器<====>根域名服务器
      本地 DNS 服务器<====>顶级域名服务器
      本地 DNS 服务器<====>权威域名服务器

- 4. TCP 连接：TCP 三次握手；
- 5. 发送 HTTP 请求；
- 6. 服务器处理请求并返回 HTTP 的报文；
- 7. 浏览器解析渲染页面；
  - 根据 html 文件构建 DOM 树和 CSSOM 树。构建 DOM 树期间，如果遇到 JS，阻塞 DOM 树及 CSSOM 树的构建，优先加载 JS 文件，加载完毕，再继续构建 DOM 树及 CSSOM 树。
  - 构建渲染树（Render Tree）
  - 页面的重绘（repaint）与重排（reflow，也有称回流）。页面渲染完成后，若 JS 操作了 DOM 节点，根据 JS 对 DOM 操作动作的大小，浏览器对页面进行重绘或是重排。
- 8. 断开连接：TCP 四次挥手

3. http 协议：

- http 协议分为 1.0 1.1 和 2.0
  - http2 源自 SPADY/2，设计目标是降低 50% 的页面加载时间
- http2：

  - 多路复用：允许单一的 HTTP2 连接同时发起多重请求-响应消息。（可以设置优先级）
  - 二进制编码：HTTP2.0 讲所有的传输信息分割为更小的信息或帧，然后对他们进行二进制编码的首部压缩。
  - 首部压缩：HTTP1.1 的请求和响应都是由状态行、请求/响应头部、消息主体三部分组成，状态行和头部却没有经过任何压缩。而 2.0 支持对 header 进行压缩；
  - 服务器推送（server push）,同 SPDY 一样，http2.0 也具有 server push 功能。

- 1.1 的区别：

  - 长连接：http1.1 默认开启长连接
  - 节约带宽：http1.1 支持只发送 header 信息，不带任何 body 信息，服务器觉得有权限：返回 100；无权限返回 401；有权限后再发 body 信息。
  - host 域：http1.0 认为每台服务器只有一个唯一的 ip，因此请求信息中没有传递 hostname，即不存在我们的 host 域；但是我们现在一台服务器可以有多个虚拟主机，共享一个 ip 地址，所以 1.1 在请求消息中添加了 host 域，没给会报 400
  - 缓存处理：1.0 有 if-modify-since（last-modify）、expire；1.1 添加了 E-tag 中的 if-match 和 if-not-match，cache-control 等。
  - 1.1 新增了 24 个错误状态响应码。

- http 缓存
  - 强缓存：判断是否有 `Cache-controller`（no-cache\no-store）、`Expire`、过没过期；
  - 发起 http 请求时，浏览器根据这个请求头信息进行判断是否命中强缓存。
  - 协商缓存：与服务器端对比资源是否进行更新，没更新返回 304，有更新 200，（`E-tag`，`Last-Modified`）
  - Cache-controll(http1.1):no-cache、no-store、max-age（xx 秒）、public/private、must-revalidate
  - Expires(http1.0):时间点
  - E-Tag(http1.1):If-Not-Match（hash 算法）
  - Last-Modified(http1.0):If-Modified-Since:时间点

4. DNS 解析：

- 1. 递归查询：主机向本地域名服务器的查询采用递归查询
  - 客户端->浏览器缓存->本地 hosts 文件->本地 DNS 解析缓存->本地 DNS 服务器
- 2. 迭代查询：本地域名服务器向根域名服务器的查询
  - 客户端->本地 DNS 服务器<====>根域名服务器
    本地 DNS 服务器<====>顶级域名服务器
    本地 DNS 服务器<====>权威域名服务器

5. options 请求：

- options 方法发起请求，响应报文里面包含一个 allow 首部字段，该字段的值表明了服务器支持的方法；
- options 的预检请求：在 cors 中，可使用 options 发起预检请求，返回`Access-Control-Request-Method`即服务器可用的 HTTP 方法。

6. 怎样不发 options 请求

- 跨域资源共享 CORS 分为简单请求和非简单请求，发送简单请求不会发起 options 请求
- 简单请求的要素：
  - 只能是 GET POST HEAD
  - 请求头：Accept、Accept-Language、Content-type、等等（不能自定义用户信息）
  - Content-type 只能取 application/x-www-form-urlencoded、multipart/form-data、text/plain
  - XMLHTTPRequestUpload 对象没有注册事件监听器，没有 ReadableStream 对象
- 不满足以上任何一点则为非简单请求
  - PUT、DELETE，不满足
  - header 带用户信息 token，不满足
  - Content-type 有些是 application/json，不满足
- 只能减少发起 options 的次数：
  - 后端请求头返回 `Access-Control-Max-Age:number`，表示 options 返回的信息可以缓存多少秒
  - 不同浏览器有不同的上限，火狐 24 小时，谷歌 10 分钟

7. 同源策略：协议+域名+端口都要相同，不同的域名指向同一个 ip 地址，也是非同源的。

8. 跨域资源共享（CORS）：服务端设置 Access-Control-Allow-Origin 即可，前端无须设置，若要带 cookie 请求：前后端都需要设置（withCredentials: true）

9. 跨域：

跨域资源共享（CORS）：服务端设置 Access-Control-Allow-Origin 即可，前端无须设置，若要带 cookie 请求：前后端都需要设置（withCredentials: true）

vue 的`proxy`代理跨域 or react 的`http-proxy-middleware`：设置 proxy 代理接口。`webpack.config.js` `vue.config.js` `setupProxy.js`

websocket：`ws`或者`wss`连接标志.websocket 不会受同源策略的约束。

nginx 的反向代理接口：`nginx.config`

`jsonp`、`document.domain+iframe`、`window.name+iframe`、`postMessage`(主要是对于两个不同域名的一些数据的传递，`postMessage(数据,地址)`)

10. 三次握手：

- Seq 作用：保持信息对等；防止脏连接，不会浪费资源。
- 目的：在代价最低的层面上保证最高的连接成功率（资源浪费）；
- 为什么有第三次握手：第二次握手的时候如果出现网络延迟等情况，可能会发送多次请求给服务端，这个时候服务端如果没有第三次握手，直接就把多次请求都建立连接，就会造成资源浪费。
- ACK:回应的标志
- SYN:发起连接的标志

11. 四次挥手：

- 第一次：客户端通知服务端说：客户端不再发送数据了
- 第二次：服务端收到信息，回答客户端：好的我知道了
- 第三次：服务端通知客户端说：我也不发送数据了
- 第四次：客户端收到信息，回答服务端：好的我知道了

- 为什么是 4 次：  
  第二次服务器端回复客户端的时候，可能服务器端还有数据没有发送完，正在发送的过程中，这个时候如果将第三次合并进来的话，就会发生传送中断。

- 为什么第四次挥手后客户端要等待 2msl 的时间才能关闭  
  为了确保第四次挥手的 ACK 能够到达服务端，
  如果 1ms 后服务器端没收到消息，就会重发第三次挥手，这个时候一来一回就需要 2msl，
  如果这个时候客户端没有等待，那么服务器就无法进入正常的关闭连接状态。

12. 重排（回流）与重绘：

- 重排（reflow）：dom 发生变化
  - 触发页面重布局的属性（回流）
  - 盒子模型相关属性会触发重布局
  - 定位属性及浮动会触发重布局
  - 改变节点内部文字结构会触发重布局
- 重绘(repaint)：css 发生改变

13. localstorage、sessionstorage、cookie

- 相同点：cookie，localStorage，sessionStorage 都是在客户端保存数据的，存储数据的类型：都是字符串。
- 不同点：

  - 生命周期：
    - cookie：如果不设置有效期，那么就是临时存储（存储在内存中）；设置了有效期，那么 cookie 存储在硬盘里，有效期到了，就自动消失了。
    - localstorage：生命周期是永久的，关闭页面或浏览器之后 localStorage 中的数据也不会消失。localStorage 除非主动删除数据，否则数据永远不会消失。
    - sessionstorage：仅在当前会话下有效。sessionStorage 引入了一个“浏览器窗口”的概念，sessionStorage 是在同源的窗口中始终存在的数据。只要这个浏览器窗口没有关闭，即使刷新页面或者进入同源另一个页面，数据依然存在。但是 sessionStorage 在关闭了浏览器窗口后就会被销毁。同时独立的打开同一个窗口同一个页面，sessionStorage 也是不一样的。
  - 网络通信：
    - cookie 的数据每次都会发给服务器端
    - localstorage 和 sessionStorage 不会与服务器端通信
  - 大小：
    - cookie 大小限制在 4KB
    - localstorage 和 sessionStorage 在 5M
  - 安全：WebStorage 不会随着 HTTP header 发送到服务器端，所以安全性相对于 cookie 来说比较高一些，不会担心截获。
  - 使用更方便：webStorage 有 api 调用。

- 优化：
  - 用 translate 替代 top 改变
  - 不要使用 table 布局，可能很小的一个小改动都会造成整个 table 的重新布局
  - 用 opacity 替代 visibility

14. localstorage 超过 5m 怎么存储：

- localStorage 最大容量 5M 的意思是每一个域名下的 localStorage 容量是 5M，假如现在 a.com 域名下 localstorage 存不下了，我们可以使用 iframe 创建 b.com 域框架（子页面）用于存储 a.com 剩下的数据。然后使用 postMessage 读写数据。
- window.postMessage() 方法可以安全地实现跨源通信。通常，对于两个不同页面的脚本，只有当执行它们的页面位于具有相同的协议（通常为 https），端口号（443 为 https 的默认值），以及主机 (两个页面的模数 Document.domain 设置为相同的值) 时，这两个脚本才能相互通信。window.postMessage() 方法提供了一种受控机制来规避此限制，只要正确的使用，这种方法就很安全。

15. xss csrf

- xss：跨站脚本攻击
  - 反射型：xss 代码出现在 url 中，作为输入提交到服务器端，服务器解析后相应内容和脚本一起传回浏览器，然后浏览器解析执行 xss 代码
  - 存储型：提交的代码会存储在服务器端，下次获取后在前端执行
  - DOMxss：触发 XSS 靠的是浏览器端的 DOM 解析，完全是客户端的事情
- 防御：

  - cookie
    - http-only(只允许 http 或 https 获取 cookie，js 无法读取 cookie)
    - secure-only(只允许 https 读取，cookie)
    - host-only(只允许主机域名与 domain 设置完全一致时才能访问 cookie)
  - header 设置：x-xss-protection：0 禁用 xss 保护，1 启用 xss 保护。
  - html 编码：unicodeComponent

- csrf：跨站请求伪造：攻击者盗用身份，以你的名义发送恶意请求
  - 劫持 cookie，在受害者不知情的前提下发送伪造请求给服务器。
- 防御（header）：
  - 验证 referer（记录 host 地址）
  - samesite:管制哪些跨站申请能够携带 cookie
    - Strict:同站才能发送 cookie；
    - lax：安全的跨站申请才能发送 cookie；
      - 浏览器把哪些跨站申请看作平安的申请：同步的 GET 申请，form 的 get 形式提交，window.open()等等。
    - none；
  - token 验证

16. https 握手

- 用户在浏览器输入一个 https 网址，连接到服务器的 443 端口。
- 服务器返回给浏览器证书（证书里面包含公钥）
- 浏览器首先会验证公钥是否有效，比如颁发机构，过期时间等等，如果发现异常，则会弹出一个警示框，提示证书存在的问题。如果证书没有问题，那么就生成一个随机值。然后用公钥对这个随机值进行非对称加密。（这个随机值就是以后进行对称加密的公钥）
- 服务器拿私钥解密出对称加密的公钥。然后以后就用这个公钥进行对称加密。
- 浏览器就可以用这个公钥进行解密和加密了。

17. websocket 和 http2 的服务器推送有什么区别

- ws 需要握手建立连接，同时没缓存
- http2 的推送是有缓存的，推送功能不需要握手

# 计算机网络

1. 五层结构 and 七层结构

- 五层：物理层、数据链路层、网络层、传输层、应用层
- OSI 七层：物理层、数据链路层、网络层、传输层、会话层、表示层、应用层

2. 各协议
   应用层：DNS HTTP
   传输层：TCP UDP
   网络层：ICMP IP IGMP
   数据链路层：RARP

3. tcp 的拥塞控制：

- 滑动窗口机制、
  发送窗口（SWND）、接受窗口（RWND）和拥塞窗口（CWND）。其中 MAX（发送窗口）=MIN（CWND，RWND）。主要包括两个过程：

（1）收到序列 i-1 及一下的序列，期望收到 i 及以后的序列。

（2）确认同意对方发送一个窗口 w 共 j 个字节，其序列号为 i 至 i+j-1。

- 慢启动机制、
- 拥塞避免机制、
- 快速重传与恢复。

# HTML&CSS

1. 清除浮动：父元素因为子级元素浮动引起的内部高度为 0 的问题

- 额外标签：最后加个 div，设置为 clear:both;
- 父级添加 overflow:hidden(触发 BFC)
- after 伪元素清除浮动：`clear:both;content:"",height:0;`
  - IE 不支持伪元素：加 css：`*zoom:1;`
- before 和 after 添加双伪元素清除浮动：

```css
.clearfix:after,
.clearfix:before {
  content: "";
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

- BFC 是一种属性：是一种不受外界影响的独立容器；
- 就比如说对于我们的盒模型来说，两个都设置了 margin 的父子元素，子元素想相对于父元素进行定位时，没有对父元素进行相对定位：而是造成了 margin 塌陷：
- 这个时候我们就可以对于子元素设置 BFC 属性，让他不受我们的父元素的干扰：

- 触发 BFC 属性的 4 种方法：
  - position:absolute;
  - display:inline-block;
  - float:left/right;
  - overflow:hidden;

3. CSS 布局:

- 圣杯布局（三栏布局）：
- 双飞翼布局（三栏布局）：
- flex 布局：
- 两栏布局：
- 响应式布局：rem、@media 媒体查询

4. `animation、transition、transform、translate`

- transform（变形）:可以旋转、缩放、移动、扭曲
- translate（移动）:是 transform 的一个属性值
- transition（过渡动画）：transform 是 transition 的一个属性值
- animation、transition 是 css3 中的两种动画属性:
  - animation 强调流程与控制，对元素的一个或多个属性的变化进行控制（animation 与@keyframes 结合使用）
  - transition 强调过渡，是元素的一个或多个属性发生变化时产生的过渡效果。

5. animation 参数及算法

- animation-timing-function:使用名伟三次贝塞尔函数的数学函数来生成速度曲线
  - linear：匀速
  - ease：默认，低->加快->慢
  - ease-in：低速开始
  - ease-out:低速结束
  - ease-in-out：低速开始和结束
  - cubic-beaier(n,n,n,n)贝塞尔函数

6. 选择器

- class 选择器、id 选择器、标签选择器、通配符
- 多元素选择器 E,F（加逗号）
- 后代选择器 E F（空格）
- 子元素选择器 E>F
- 毗邻元素选择器 E+F
- 内联 > id > class > 标签 > \*
- !important

7. 获取 DOM 的方法：

- ID getElementById
- name 属性 getElementsByName
- 标签名 getElementsByTagName
- 类名 getElementsByClassName
- 选择器获取一个 querySelector
- 获取一组 querySelectorAll
- 获取 html：document.documentElement
- 获取 body：document.body

8. 监听事件的顺序：
   onmousedown onfocus onmouseup onclick

9. 伪类与伪元素：

- 区别：有没有创建一个文档树之外的元素。伪类的操作对象是文档树中已有的元素，而伪元素则创建了一个文档数外的元素。
- 伪类：（单冒号）hover、active、focus、
- 伪元素：（双冒号）before、after、selection、placeholder

10. table 布局的优缺点

- 缺点
  - table 比其他 html 标签占更多的字节。造成下载时间延迟，占用服务器更多的流量资源（代码冗余）。
  - table 会阻挡浏览其渲染引擎的渲染顺序，会延迟页面的生成速度，让用户等待时间更久。
  - 灵活性差，一旦设计确定，后期很难通过 CSS 让它展现新的面貌。
  - 不利于搜索引擎抓取信息，直接影响到网站的排名。
- 优点：1.兼容性好 2.容易上手

11. flex: 1 0 auto：flex-grow、flex-shrink、flex-basis 的缩写：

- flex-grow:放大比例
  - 默认为 0：即使存在剩余空间，也不会放大；
  - 1：等分剩余空间（自动放大占位）；
  - n：n 倍
- flex-shrink:缩小比例
  - 默认为 1，即 如果空间不足，该项目将缩小；
  - 为 0：空间不足时，该项目不会缩小；
  - n:n 倍
- flex-basis: 分配多余空间的时候，计算主轴空间

  - 默认 auto: 项目原本大小

- 例子：flex:1,即放大比例为 1，占据整个内容。常用作自适应布局。

12. justify-content 和 align-item 的区别

- justify-content:项目在主轴上的对齐方式（假设我 flex-direction：row(横)的，那么我就是在水平上的对齐方式，（宽度））
- align-item:项目在交叉轴的对齐方式（高度）
- aligin-content:定义多跟轴线的对齐方式，就是多行对齐方式，如果只有单行，则不生效。

13. 动画的快慢算法：

- 贝塞尔曲线:cubic-bezier
- strps(步数，[start|end])
- ease-in 慢到快
- ease-out 快到慢
- ease-in-out 慢到快到慢
- linear 线性
- ease 平滑

14. clientWidth、offsetWidth、scrollWidth

- clientWidth = width+左右 padding
- clientTop = boder.top(上边框的宽度)
- clientLeft = boder.left(左边框的宽度)

- offsetWidth = width + 左右 padding + 左右 border
- offsetTop：当前元素 上边框 外边缘 到 最近的已定位父级（offsetParent） 上边框 内边缘的 距离。如果父级都没有定位，则分别是到 body 顶部 和左边的距离
- offsetLeft：当前元素 左边框 外边缘 到 最近的已定位父级（offsetParent） 左边框 内边缘的 距离。如果父级都没有定位，则分别是到 body 顶部 和左边的距离

- scrollWidth：获取指定标签内容层的真实宽度（可视区域宽度+被隐藏区域宽度）

14. window 子对象：

- document：html 的信息
- history：浏览器访问过的 url
- location:url 上的一系列信息
- nagivator：浏览器的信息
- screen:客户端屏幕信息

15. h5 新出的 api

- 拖拽

(1)ondragstart：源对象开始被拖动

(2)ondrag：源对象被拖动过程中(鼠标可能在移动也可能未移动)

(3)ondragend：源对象被拖动结束

拖动源对象可以进入到上方的目标对象可以触发的事件：

(1)ondragenter：目标对象被源对象拖动着进入

(2)ondragover：目标对象被源对象拖动着悬停在上方

(3)ondragleave：源对象拖动着离开了目标对象

(4)ondrop：源对象拖动着在目标对象上方释放/松手

- 存储
- 获取当前地理信息 nagivatorr.geolocation.watchPosition(successCallback, errorCallback)

# JavaScript

1. 数组 API

- Splice 返回什么？
  - 改变原数组，以数组的形式返回被修改的内容。
- push、unshift 返回新长度
- pop、shift 返回弹出的值
- sort、reverse 返回新数组
- 7 个会改变原数组的 API：splice、push、pop、shift、unshift、sort、reverse。

2. 事件循环机制

- 宏仁务：` ` `script、setTimeout、setInterval、I/O、setImmediate(node环境)` ` `
- 微任务：` ` ``promise`、mutationObserver、process.nextTick()` ` `

1、主线程：一开始从上往下；遇到其他宏仁务，放置到宏仁务列队中，遇到微任务，放置到微任务列队中

2、然后等主线程宏仁务做完，就检查是否有微任务，然后就做完微任务，

3、微任务做完后，再看看有没有宏仁务，有的话就继续做宏仁务。

- DOM 事件是一个过程
  - 行为触发：（异步）什么时候用户点击、返回响应，这都是未知的也就是异步的。（宏仁务）（addListener 是宏仁务）
  - 事件处理：（同步）系统接收到事件触发，找到对应 dom 的回调函数、并执行的过程是同步的。(用户点击执行 click 是同步)

3. nodejs 事件循环机制

- Node.js 采用事件驱动和异步 I/O，实现单线程、高并发的运行环境

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

- 每个阶段结束后都会判断是否存在微任务，有则执行。
  - 微任务分为：process.nextTick()和 ` promise``.then `(),nextTick 比 then 早。
- 初次进入事件循环，从 timer 开始，会判断是否存在 setTimeout 和 setInterval，存在则执行，完毕->微任务->I/O callbacks ->Idle/prepare ->poll 轮询
- poll 轮询回调列队：
  - 列队不为空：执行回调
    - 触发了相应的微任务，等这个回调执行完毕就执行对于的微任务
  - 列队为空：
    - 有 setTimeout 和 setInterval 倒计时结束，会结束 poll，去 timer 执行 callback
    - 有 setImmidate,结束 poll，去 check
    - 否则阻塞，等待新的回调进来
- check: 处理 setImmediate 的回调。
- close callback:执行一些回调，线程 socket 等。

4. 类型判断方法

- typeof:

  - 返回字符串形式："number"、'string'、'function'
  - 只能判断普通类型和函数，数组等 object 类型均返回'object'

- instanceof: 用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。

  - 对于 number 和 string 等普通类型的定义来说，除了用 new 去创建的，其他类似`var a=123`用`a instance of Number`去判断结果都是 false
  - `{}`除外,对于 Object 类型来说，`var a={b:123}`可以用 instanceof 去判断。
  - String、Date、Number 等的都是基于 Object 衍生的，原型链可以解释。所以对于 Number 等类型来说，instanceof Object 均为 true -`!mycar instanceof Car`和`!(mycar instanceof Car)`不一样，`!mycar`对隐式转换成 boolean 值。
  - 详情参考 MDN：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof

```js
// instanceof是通过原型链判断的， 在A的原型链中层层查找，是否有原型等于B.prototype
//如果不是，A就继续往原型链里面找，找到顶端null。任然不等于B.prototype,返false。
function instance(left, right) {
  left = left.__proto__;
  right = right.prototype;
  while (true) {
    console.log(left);
    if (left == null) return false;
    if (left === right) return true;
    left = left.__proto__;
  }
}
```

- isNaN():判断是不是 NaN 类型

  - 会对传入的值进行隐式转换成 Number 类型，如果能够转换成功，则不是 NaN 类型，如果转换失败，则返回 true

- Object.is()
  - 传入两个值，判断两个值类型是否相等

5. 深拷贝&&浅拷贝

- 深拷贝：

  - JSON.stringify()\JSON.parse()
  - 遍历对象的 key，把对应的 value 赋给新的对象的 key 上。由于有的 value 还是个对象，所以需要递归克隆；
  - 循环引用的问题：es6 的 WeakMap 可以解决，或自己开一个数组保存遍历过的值，判断是否存在。
  - WeakMap 是以对象为键的键值对，所以我们把对象存进去判断是否有该对象，如果有的话我们就不用再进行循环了。

  ```js
  //判断是什么类型
  function isObject(obj) {
    return (
      Object.prototype.toString.call(obj) === "[object Object]" ||
      Object.prototype.toString.call(obj) === "[object Array]"
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

- 浅拷贝：只拷贝对象的第一层
  - `Object.assign({},obj)`返回新的对象
  - 展开运算符`a={...b}`

6. 遍历对象的方法

- foreach
- for...in、for...of
- Array.prototype.map()
- Array.prototype.reduce((v1,v2,index,arr)=>{})v1 是累加值、v2 是当前值、index 为当前索引、arr 为原数组
- Array.prototype.filter(()=>{})返回新数组
- Array.prototype.every(()=>{})参数为函数，每一项都返回 true，则 true。false 则退出遍历。
- Array.prototype.some(()=>{})参数为函数，只要有一项返回 true，则退出遍历，返回 true。否则一直循环，最后返回 false。
- Array.prototype.keys() values() entries()遍历键、值、键值对

7. 迭代器 Iterator

- 提供统一的接口，为不同的数据结构提供统一的访问机制。(Map,Set,Array)
- 迭代器对象包含一个 next()方法，调用 next()返回(done:boolean , value:any)(与生成器一致，后面可以用生成器模拟)
- 标志：Symbol.iterator

8. 生成器 Generator

- function 有个\*号
- yield 表达式:函数内使用，走到哪停到哪
- 生成器函数执行后，会返回一个迭代器对象{done,value}
- 生成器可以看作是迭代器的语法糖

9. 普通对象迭代方法：

- 用生成器构造 Symbol.iterator 即可

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

- 是什么： 异步编程的一种解决方案
- 定义：

  - `promise` 构造函数是同步执行的，`promise.then` 是异步执行的。
  - `promise` 有 3 种状态，pending、fulfilled、rejected。只能从 pengding->fulfilled 或者 pending->rejected
  - 构造函数种 resolve 和 reject 只有第一次执行有效，多次调用没有任何作用。
  - `promise` 可以链式调用，每次 `promise` 调用`.then` 或者.catch 都会返回一个新的 `promise` 对象
  - `.then` || .catch 返回的值不能是 `promise` 本身，否则会造成死循环
  - `.then` 可以接收两个回调函数：成功函数、失败函数。`.catch` 是`.then` 的第二个参数的简便写法，
    - 不同: `.then` 的错误函数捕获不了第一个成功函数抛出的错误，而`.catch` 可以。

- `Promise.all`: 接受 promise 对象数组，全成功->`.then` 或者 只要出现一个失败，则失败`.catch`。注意：如果在单个请求中定义了 catch 方法，则不会进入 promise.all 的 catch 中。

  - 原理：

  ```js
  Promise.all = (arr) => {
    return new Promise((resolve, reject) => {
      let result = [];
      let i = 0;
      let processData = (value, index) => {
        results[index] = value;
        if (++i == arr.length) {
          resolve(results);
        }
      };
      function isPromise(obj) {
        return (
          !!obj && //有实际含义的变量才执行方法，变量null，undefined和''空串都为false
          (typeof obj === "object" || typeof obj === "function") && // 初始promise 或 promise.then返回的
          typeof obj.then === "function"
        );
      }
      for (let i = o; i < arr.length; i++) {
        let current = arr[i];
        //判断是不是promise
        if (isPromise(current)) {
          current.then((y) => {
            processData(y, i);
          }, reject);
        } else {
          processData(current, i);
        }
      }
    });
  };
  ```

````

- `Promise.race`: 接受 promise 对象数组，谁跑的快，则执行谁的回调函数。
- 例题：

 - `promise.race`使用情况：发送一个请求，限制时间为 2 秒

 ```js
 function request() {
   return new Promise((resolve) => {
     setTimeout(() => {
       resolve("来自服务器的message");
     }, Math.random() * 5000);
   });
 }
 function resolve() {
   //code here
   let second = new Promise((resolve, reject) => {
     setTimeout(() => {
       reject("超时");
     }, 2000);
   });
   let arr = [request(), second];
   return Promise.race();
 }
 resolve()
   .then((res) => console.log(res))
   .catch((err) => console.log(err));
````

- 实现一个批量请求函数 multiRequest(urls,maxNum):
  - 最大并发数 maxNum
  - 每当有一个请求返回，就留下一个空位，可以增加新的请求
  - 所有请求完成后，结果按照 urls 里面的顺序依次打出

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
        .then((res) => {
          result[current] = res;
          console.log("完成");
          if (current < len) {
            next();
          }
        })
        .catch((err) => {
          console.log("结束");
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

- obj instanceof Array;
- toString(obj)返回`[object Array]`
- Array.isArray(obj);
- Array.prototype.isPrototypeOf([1,2,3]):判断 Array 是不是在 obj 的原型链上。如果是则返回 true。

12. 解决 setTimeout、setInterval 时间不准的问题:加个时间相减

```js
const func = (fn, delay) => {
  let begin = Date.now();
  return setTimeout(() => {
    let end = Date.now();
    if (end - begin >= delay) {
      fn();
    }
  }, 1);
};
```

13. 数组去重

```js
//set,无法去掉{}，{}
let arr=[];
Array.from(new Set(arr))
[...new Set(arr)]

//扁平化去重
arr.flat(n)//几重就扁平几重
Array.from(new Set(arr.flat(n)))

//ES5,双层for
for(var i=0;i<arr.length;i++){
  for(var j=i+1;j<arr.length;j++){
    if(arr[i]==arr[j]){
      arr.splice(j,1);
      j--;
    }
  }
}

//indexOf，ie不存在
let newArr=[];
for(var i=0;i<arr.length;i++){
  if(newArr.indexOf(arr[i])===-1){
    newArr.push(arr[i]);
  }
}

//map，时间复杂度为o(n),typeof能够解决1和‘1’的问题
var hash={}
var res=[]
for(var i=0 ;i<arr.length;i++){
  var item=arr[i];
  var key=typeof(item)+item
  if(hashpkey!==1){
    ret.push(item)
    hash[key]=1;
  }
}

//isNaN判断是否是NaN
//includes,hasOwnProperty
```

14. for...in 和 for ...of

- for of 是 ES6 的遍历方式，遍历的对象需要含有 iterator 的标志`Symbol(Symbol.iterator)`
- for of 拿到键值、而 for in 拿到键名
- for in 会遍历原型链的键值 for of 不会

15. indexOf 实现原理:判断 this，参数是否合法，然后 for 循环进行比对，返回索引 or-1

```js
Array.prototype.indexOf = function (element, index) {
  if (this == null) {
    throw new TypeError("this对象指向的数组不存在");
  }
  if (index == null) {
    index = 0;
  }
  if (index < 0) {
    index = len - 1;
  }
  for (let i = index; i < len; i++) {
    if (element == this[i]) {
      return i;
    }
  }
};
return -1;
```

16. 函数柯里化：多个参数化简为单个参数
    柯里化函数应用：bind

```js
function curry(){
  //类数组转为数组
  var _args=Array.prototype.slice.call(arguments);
  var adder=function(){
    _args.push(...arguments);
    return adder;
  };
  adder.toString=function(){
    return _args.reduce(function(a,b)=>{
      return a+b;
    });
  }
  return adder;
}
```

17. 创建日期没有兼容性问题的是：
    `new Date(2017,6,25,12,12,12)`

18. 扩展 js 的 String 等对象：prototype 扩展

19. 闭包：函数外部调用到函数内部的变量，产生了闭包

20. defer 和 async:

- async: 加载与解析都是异步的
- defer: 加载是异步的，然后加载完之后解析是同步的。

21. 异步编程方式：

- 回调函数
- 事件监听
- 发布订阅
- promise
- generator
- async/await

# ES6

1. 箭头函数

- 函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。(或者说箭头函数没有 this，它只是引用了外部的 this)
- 不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 Rest 参数代替。
- 不可以当作构造函数，也就是说，不可以使用 new 命令，否则会抛出一个错误。
- 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。
- ES7 提案：绑定 this：
  - ES6 中可以用 bind、apply、call 来绑定 this 对象
  - ES7 提出“函数绑定”

```js
//this
var bb = 2;
function aa() {
  this.bb = 1;
  setTimeout(() => {
    console.log(this.bb);
  }, 0);
}
let aaa = new aa();

foo::bar; // 等同于  bar.bind(foo);
foo::bar(...arguments); // 等同于  bar.apply(foo, arguments);
```

2. let & const:

- 不存在变量提升
- 不允许重复声明
- 块级作用域
- 暂时性死区
- 块级作用域中函数声明：
  - ES5 规定：函数只能在顶层作用域中与函数作用域之中声明，不能在块级作用域间声明
  - ES6 规定，函数可以在块级作用域中声明，函数类似于 let，出了块级作用域就无法调用了，与 let 不同的是，它还是会存在函数提升。
- const
  - 需要立即初始化
  - 如果是复合类型的变量，指向数据的地址
  - 想让对象不能改，用 object.freeze()
    <!--Object.preventExtendsion(obj) 用来禁止对象可扩展其它属性-->
    <!--Object.seal(obj)用来禁止对象删除其它属性和扩展其它属性-->
    <!--Object.freeze(obj)用来冻结对象，就是所有的属性不能够更改和新增 -->

3. 对象数组的解构赋值
4. 模板字符串
5. map and set
6. 扩展运算符
7. proxy and reflect

- proxy：在目标对象之前加一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，重写 get、set 方法，同时，this 会指向 proxy 对象
- reflect：将 object 内部的一些方法（object.defineProperty），通常是 proxy 拦截 target 的时候，内部调用对应的 reflect 方法，保证原生行为能够正常执行。

8. 遍历方式 and 迭代器

- 常规遍历方式：

  - for 循环
  - for in 循环
  - while 循环
  - for of 循环

- 函数式编程

  - forEach
  - map
  - reduce
  - Objects.keys

- for of 循环只能遍历具备 iterator 规范的。（即如果有 Symbol.iterator 标志）
  - 数组
  - 部分类数组：arguments/NodeList/HTMLCollection
  - Set/Map
  - String

**注意：**普通对象不具备 iterator 规范的标志 Symbol.iterator

- 迭代器：

  - 标志：Symbol.iterator
  - 遍历器对象本质上，就是一个指针对象
  - 每一次调用 next 方法，返回一个包含 value 和 done 两个属性的对象

- 生成器函数模拟迭代器

```js
// 这里用生成器函数得出结果返回一个Symbol.iterator
function* fn() {
  yield 1;
  yield 2;
}
let itor = fn(); //生成器函数返回的结果是一个迭代器；拥有next方法，执行next方法可以一次遍历数据结构中的每一项的值 ->数据结构具备Symbol.iterator属性，说明其是可以被迭代的。

console.log(itor.next()); //->{value:1,done:false}
console.log(itor.next()); //->{value:2,done:false}
console.log(itor.next()); //->{value:undefined,done:true}
```

<img src="./imgs/iterator.png"></img>

```js
function* fn() {
  let x = yield 1;
  console.log(x); //->10 不是yield的返回值，是执行next方法传递进来的值。
  yield 2;
}
let itor = fn();
console.log(itor.next()); //->{value:1,done:false},这一步从头开始，到第一个yield结束。
console.log(itor.next(10)); //->{value:2,done:false}，这一步解决第一个yield，即yield 1那里，其实是把1换成了10，然后赋值给x遇到yield 2停止。
console.log(itor.next()); //->{value:undefined,done:true}执行yield 2.然后结束。
```

- 普通对象迭代方法：

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

9. 异步编程解决方案: 生成器 and Promise

- 生成器：

  - 执行 Generator 函数会返回一个迭代器对象，拥有 next 方法，执行 next 方法可以一次遍历数据结构中的每一项的值
  - 函数体内部使用 yield 语句，暂停执行的标记

- Promise

  - promise 有 3 种状态：pending、fulfilled 或 rejected。状态改变只能是 pending->fulfilled 或者 pending->rejected，状态一旦改变则不能再变。
  - 构造函数中的 resolve 或 reject 只有第一次执行有效，多次调用没有任何作用

    - 呼应代码二结论：promise 状态一旦改变则不能再变。

  - promise 可以链式调用。

    - 提起链式调用我们通常会想到通过 return this 实现，不过 Promise 并不是这样实现的。
    - promise 每次调用 .then 或者 .catch 都会返回一个新的 promise，从而实现了链式调用。

  - .then 或 .catch 返回的值不能是 promise 本身，否则会造成死循环。

  - .then 可以接收两个参数，第一个是处理成功的函数，第二个是处理错误的函数。.catch 是 .then 第二个参数的简便写法，
    - 但是它们用法上有一点需要注意：.then 的第二个处理错误的函数捕获不了第一个处理成功的函数抛出的错误，而后续的 .catch 可以捕获之前（then 里面的）的错误。

- Promise.all：promise 对象数组所有状态都变成了 resolve or reject，才会去调用 then。

```js
Promise.all = (arr) => {
  return new Promise((resolve, reject) => {
    let result = [];
    let i = 0;
    let processData = (value, index) => {
      results[index] = value;
      if (++i == arr.length) {
        resolve(results);
      }
    };
    function isPromise(obj) {
      return (
        !!obj && //有实际含义的变量才执行方法，变量null，undefined和''空串都为false
        (typeof obj === "object" || typeof obj === "function") && // 初始promise 或 promise.then返回的
        typeof obj.then === "function"
      );
    }
    for (let i = o; i < arr.length; i++) {
      let current = arr[i];
      //判断是不是promise
      if (isPromise(current)) {
        current.then((y) => {
          processData(y, i);
        }, reject);
      } else {
        processData(current, i);
      }
    }
  });
};
```

- Promise.race：竞赛，有一个 promise 对象状态改变，就调用 then。

- async and await:generator 的语法糖
  - 返回一个 promise 对象
  - await 后面不是 promise 对象，也会被转成 resolve 的 promise 对象
  - async 原理：将生成器函数和自动执行器放在一个函数里
  - 简化代码

10. 继承：

- 原型链继承：将子类的 prototype 指向父类的实例，从而子类的原型也指向了父类；
- 优点：继承子类构造函数，父类构造函数，父类原型
- 缺点：
  - 继承单一
  - 新实例无法向父类构造函数传参。
  - 所有新实例都会共享父类实例的属性。（原型上的属性是共享的，一个实例修改了原型属性，另一个实例的原型属性也会被修改！）

```js
Son.prototype = new Father();
let son = new Son();
son.__proto__ == Father;
```

- 构造函数继承：用 call apply 将父类构造函数引入子类函数，父类构造函数自执行
- 优点
  - 只继承了父类构造函数的属性，没有继承父类原型的属性。
  - 实例可以向父类构造函数传参。
  - 不共享父类实例
- 缺点：
  - 只能继承父类构造函数的属性

```js
function Father() {
  this.a = 11;
}
function Son() {
  Father.call(this, "");
  this.b = 12;
}
var son = new Son();
son.a == 11; //true;
```

- 组合继承：
- 优点：
  - 两种继承的优点
  - 调用了两次父类构造函数（耗内存），子类的构造函数会代替原型上的父类构造函数。

```js
function Son() {
  Father.call(this, "");
  this.b = 12;
}
Son.prototype = new Father();
let son = new Son();
```

- 原型式继承：

```js
function content(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}
var f = new Father();
var f2 = content(f);
console.log(f2.a);
```

# React

1. 什么是虚拟 DOM：

- 真实 DOM 的内存表示，一种编程概念，一种模式。

2. 类组件和函数组件之间有什么区别？

- 共同点：都是纯函数，无法修改 props

- 区别：
  - 函数组件性能比类组件高；
  - 类组件使用时需要实例化，而函数组件可以直接执行，返回结果即可。
  - this、生命周期、state 等等的区别。

3. refs 作用是什么？

- refs 提供访问 DOM 元素或者某个组件实例的入口

4. react 的事件处理机制（SyntheticEvent）

```markdown
- 事件处理机制

三阶段:捕获、目标、冒泡

可以通过事件目标对象的 eventPhase 属性来得知当前事件在什么阶段。（1 捕获，2 目标，3 处理）

addEventListener 注册事件，其中参数有 useCapture：true 时该事件在捕获阶段触发，false 在冒泡阶段触发。默认是冒泡。

e.stopPropation:阻止事件向下捕获或者向上冒泡。

为什么要阻止事件传递：因为防止点透现象（父与子都有 click，都被触发，但我们只想触发子的）
e.preventDefault：阻止默认事件，不会阻止事件传递。

事件代理：事件委托：
多个子元素的同一事件可以绑定在父元素上。提高效率，减少代码量。

- 父元素通过`e.target`或者`e.srcElement`（IE）识别子元素。然后再判断子元素是不是相应的标签`nodeName`
```

- React 中，默认事件传播方式为冒泡：
- onClickCapture 来绑定捕获事件，
- React 事件委托，由于有冒泡机制，用 e.stopPropation 阻止冒泡
- SyntheticEvent 中事件的 event 对象，不是原生的 event 对象

5. state 和 props 有什么区别？

6. setState 是异步还是同步？

- 合成事件中是异步（多个 setState 合在一起，提高性能）
- 钩子函数中是异步（setState 中提供一个回调函数）
- 原生事件中是同步（addEventListener 事件）
- setTimeout 中是同步

7. react@16.4+生命周期

- 三阶段：挂载阶段、组件更新阶段、卸载阶段
- 16 前：
  - 挂载阶段：constructor、conponentWillMount、componentDidMount、conponentWillUnMount；
  - 更新阶段：
    - `componentWillReceiverProps(nextProps)`：父组件传过来的 props 更新，进行 props 对比，更新 props 中的 state。
    - `shouldComonentUpdate(props,state)`:性能优化，对比 props、state 是否改变，改变了则可以重新渲染。
    - `componentWillUpdate(nextprops,nextstate)`;
    - `componentDidUpdate(preprops,prestate)`;
  - render:渲染：
- 16 后：
  - `getDerivedStateFromProps(nextProps,nextState)`:代替`componentWillReceiveProps`
  - `getSnapshotBeforeUpdate(preProps,preState)`:代替`componentWillUpdate`可以读取到 DOM 元素，在 render 之前被调用，保证 dom 与 componentDidUpdate 一致。

| class 组件                | Hooks 组件                |
| ------------------------- | ------------------------- |
| getDerivedStateFromProps  | useState 中的 update 函数 |
| shouldComponentUpdate     | useMemo                   |
| componentDidMount、Update | useEffect                 |

8. useEffect(fn,[])和 componentDidMount 有什么差异？

- useEffect 会捕获初始的 props 和 state、想获取最新的值，可以使用 refs

9. hooks 为什么不能放在条件判断里？

- 以 setState 为例，在 react 内部，每个组件中的 hooks 都是以链表的形式存在 memoizeState 属性中的，如果用条件判断，导致 setState 不生效，则没有执行 setState 中的方法，导致链表后面的 next 没有执行，setState 的取值出现偏移，导致异常。

10. fiber 是什么？

- React Fiber 是一种基于浏览器的单线程调度算法
- React Fiber 用类似 requestIdleCallback 的机制来做异步 diff。但是之前数据结构不支持这样的实现异步 diff，于是 React 实现了一个类似链表的数据结构，将原来的 递归 diff 变成了现在的 遍历 diff，这样就能做到异步可更新了。

11. diff 算法

- 传统 diff 时间复杂度 O（n^3）,最后 O(n)
- 1、tree diff:同层对比 dom 节点，忽略 dom 节点的跨层级移动
- 2、组件 diff：如果不是同一类型的组件，会删除旧的组件、创建新的组件
- 3、同一层级的一组子节点，通过唯一 id 进行区分、也就是唯一 key

12. setState 之后发生了什么？

- setState 时，创建一个 updateQueue 的更新列队。
- 触发 reconciliation：触发 fiber 的调度算法，生成新的 fiber 树，异步可中断的执行
- react scheduler 会根据优先级高低，限制性优先级高的节点，具体是 doWork 方法。
- 在 doWork 方法中，React 会执行一遍 updateQueue 中的方法，以获得新的节点。然后对比新旧节点，为老节点打上 更新、插入、替换 等 Tag。
- 当前节点 doWork 完成后，会执行 performUnitOfWork 方法获得新节点，然后再重复上面的过程。
- 当所有节点都 doWork 完成后，会触发 commitRoot 方法，React 进入 commit 阶段。
- 在 commit 阶段中，React 会根据前面为各个节点打的 Tag，一次性更新整个 dom 元素。

13. 为什么虚拟 dom 会提高性能?

- 虚拟 dom 相当于在 JS 和真实 dom 中间加了一个缓存，利用 diff 算法避免了没有必要的 dom 操作，从而提高性能。

14. 错误边界

- 在 React 中，如果任何一个组件发生错误，它将破坏整个组件树，导致整页白屏。这时候我们可以用错误边界优雅地降级处理这些错误。

15. React 组件间有那些通信方式?

- 父组件向子组件通信
  - 1、 通过 props 传递
- 子组件向父组件通信
  - 1、 主动调用通过 props 传过来的方法，并将想要传递的信息，作为参数，传递到父组件的作用域中
- 跨层级通信
  - 1、 使用 react 自带的 Context 进行通信，createContext 创建上下文， useContext 使用上下文。
  - 使用 Redux 或者 Mobx 等状态管理库
  - 使用订阅发布模式

16. React 父组件如何调用子组件中的方法？

- 如果是在方法组件中调用子组件（>= react@16.8），可以使用 useRef 和 useImperativeHandle:
- 如果是在类组件中调用子组件（>= react@16.4），可以使用 createRef；

17. React 有哪些优化性能的手段?

- 类组件中的优化手段
  - 1、使用纯组件 PureComponent 作为基类。
  - 2、使用 React.memo 高阶函数包装组件。
  - 3、使用 shouldComponentUpdate 生命周期函数来自定义渲染逻辑。
- 方法组件中的优化手段
  - 1、使用 useMemo。
  - 2、使用 useCallBack。
- 其他方式
  - 1、在列表需要频繁变动时，使用唯一 id 作为 key，而不是数组下标。
  - 2、必要时通过改变 CSS 样式隐藏显示组件，而不是通过条件判断显示隐藏组件。
  - 3、使用 Suspense 和 lazy 进行懒加载

18. react hook 优缺点：

- 优点：更容易复用代码：通过自定义 hooks 来复用状态，解决类组件有时候难以复用的逻辑。
  - 具体：useHook 生成一份独立的状态，开辟内存空间。
  - 与高阶组件对比：高阶组件也能做到，但是对于 hooks 实现起来代码量少，而且高阶组件太多层，代码会难以阅读。
  - 写的舒服，清爽的代码风格
- 缺点：
  - 响应式的 useEffect：useEffect 和 useCallback 等 api 的第二个参数的触发时机难掌控；
  - 状态不同步：函数的运行是独立的，有独立的作用域，异步操作的时候，经常会朋友异步回调的变量引用时之前的。（可以通过用 UseRef 来解决）

19. 高阶组件：

20. 通信方式：
21. useMemo 和 useCallback 的好处

- usememo 和 useCallback 都可以通过监听特定的参数来判断是否在渲染阶段重新计算对应的数值或者是对应的函数，好处便是做到性能的优化。
- 区别：useMemo 通常用于计算一个数值，可以是状态的改变等；而 useCallback 缓存的是函数，就比如子组件啥的，只要 props 没有改变，那么子组件就不需要刷新，使用 useCallback 可以不用让子组件刷新。

22. useEffect 和 useLayoutEffect 的区别：

- useEffect 在渲染时是异步执行，并且要等到浏览器将所有变化渲染到屏幕后才会被执行。
- useLayoutEffect 在渲染时是同步执行，其执行时机与 componentDidMount，componentDidUpdate 一致

23. useEffect 和 useLayoutEffect 哪一个与 componentWillUnmount 的是等价的？

- useLayoutEffect 的 detroy 函数的调用位置、时机与 componentWillUnmount 一致，且都是同步调用。

24. 为什么建议将修改 DOM 的操作里放到 useLayoutEffect 里，而不是 useEffect？

- 减少回流、重绘
- DOM 已经被修改，但但浏览器渲染线程依旧处于被阻塞阶段，所以还没有发生回流、重绘过程。由于内存中的 DOM 已经被修改，通过 useLayoutEffect 可以拿到最新的 DOM 节点，并且在此时对 DOM 进行样式上的修改，假设修改了元素的 height，这些修改会在步骤 11 和 react 做出的更改一起被一次性渲染到屏幕上，依旧只有一次回流、重绘的代价。

# Vue

1. MVVM:

- 后端 mvc 模式：view、model、controller（控制层，做某件事的控制）
- 为什么要有这模式：目的、职责划分、分层，借鉴后端思想。对于前端而言就是如何将数据同步到页面上；
- 自动映射数据到视图上；(简化隐藏 controller)

- model：数据层 js 对象
- view：视图层
- viewmodel：逻辑层

2. Vue2 以及 Vue3 响应式数据的理解

- 响应式数据：

  - vue2:

    1. `object.defineProperty`：对于一个对象，通过遍历、递归，将对象中的属性重写 get、set 方法。
    2. 发布订阅模式：一对多，多订阅者监听一个对象，对象更新之后，通过通知调度中心，进行通知订阅者。
       2-1. 触发依赖收集。
       2-1. 通过重写我们的 get、set 之后，对于第一次调用 get 方法的时候，将 watcher 放入我们的 dep 数组中(触发依赖收集)，
       2-2. 调用 set 方法的时候，依次将我们的 dep 中的 watcher 执行
       2-3. 每个属性都会有一个 dep
    3. 数组是通过重写数组方法来实现

    - 重写数组方法（push、shift、pop、splice、unshift、sort、reverse）函数劫持
    - 数组中如果是对象数据类型，也会进行递归挟持
    - 数组的索引和长度变化是无法监控到的

    4. 多层对象是通过递归来实现劫持

  - vue3:
    1. 判断取值是不是对象，是则进行代理 proxy,取到某个值的时候，再进行代理(懒代理)；
    2. 兼容性不好
    3. proxy 天生支持数组劫持。

```js
// 构造函数调用init方法->initdata->observe->数组、对象分开,深度递归->defineRative->object.defineProperty
function vue2() {
  let state = {
    count: 0,
  };
  let active;
  function defineReactive(obj) {
    for (let key in obj) {
      let value = obj[key];
      let dep = [];
      Object.defineProperty(obj, key, {
        get() {
          if (active) {
            dep.push(active);
          }
          return value;
        },
        set(newValue) {
          value = newValue;
          dep.forEach((watcher) => watcher());
        },
      });
    }
  }
  defineReactive(state);
  //模拟,watcher将一个个fn，即监听者放入dep数组中。
  const watcher = (fn) => {
    active = fn;
    fn();
    active = null;
  };
  watcher(() => {
    app.innerHTML = state.count;
  });
  watcher(() => {
    console.log(state.count);
  });
}
```

```js
let state = [1, 2, 3];
let originalArray = Array.prototype;
let arrayMethods = Object.create(originalArray);
function defineReactive(obj) {
  //函数劫持
  arrayMethods.push = function (...args) {
    originalArray.push.call(this, ...args);
    watcher();
  };
  obj.__proto__ == arrayMethods;
}
defineReactive();
function watcher() {
  arr.innerHTML = state;
}
watcher();
setTimeout(() => {
  state.push(4);
}, 2000);
```

4. Vue 依赖收集

- 每个属性都拥有自己的 dep 属性、存档他所依赖的 watcher、当属性变化后，会通知对应的 watcher 去更新
- 默认在初始化时会调用 render 函数、此时会触发依赖收集
- 当属性发生修改时，会触发 watcher 更新 `dep.notify()`
- 当一个组件在渲染时，会触发 get 方法、那么就会把这个组件放到这个属性的 dep 中。也就是 dep 中存放的所有依赖这个属性的组件。当改变这个属性，会触发 set，这个时候循环调用 dep 中的所有项，来重新渲染这些依赖的组件。

5. vue 的生命周期

- 定义：创建 Vue 实例到实例销毁的过程。开始创建、初始化数据、编译模板、挂载 Dom→ 渲染、更新 → 渲染、卸载等一系列过程，我们称这是 Vue 的生命周期
- 某一阶段想执行的代码，放入对应的钩子函数中。
- 8 个常用的钩子函数
  - beforeCreate：高级组件封装的时候可能会用到，一般业务用不上；this 相关属性拿不到（props、data、methods）
  - created：第一个能获取到 data、props、methods 等的方法；一般在这里发起 ajax 请求；
  - beforeMount
  - mounted：真实 DOM 操作需要的操作，百度地图等具体 API 需要 DOM 的时候。ref
  - beforeUpdate：做更新操作；
  - updated：一定不能做更新操作。会出现死循环
  - destoryed：定时器清除
- 3 个不常用的
  - activated & deactivated：keep-alive 组件缓存的时候会执行的生命周期；
    - keep-alive:LRU 缓存；（最近最少使用）缓存的是 DOM
  - errorCaptured：捕获错误

6. Vue 生命周期钩子是如何实现的

- vue.options 里面会放置了全局的所有属性，生命周期钩子函数也在里面（例如 vue.mixin 中的东西，data 的东西）
- 例如 beforeCreate,每个生命周期钩子属性都是一个数组，所有的对应生命周期的回调函数都维护成一个数组，然后依次执行。

```js
vue.mixin({
  beforeCreate("sss");
})
const vm=new Vue({
  el:"#app",
  beforeCreate("ss222");
})
```

7. Vue.mixin 的使用场景和原理

- 共享数据的方案：mixin：抽离公共的业务逻辑，组件初始化时调用 mergeOptions 方法进行合并（放到 Vue.options），采用策略模式针对不同的属性进行合并。数据冲突，采用就近原则。
- 命名冲突问题，依赖问题，数据来源问题。

8. Vue 组件 data 为什么必须是个函数

- 对象为引用类型，当重用组件时，由于数据对象都指向同一个 data 对象，当在一个组件中修改 data 时，其他重用的组件中的 data 会同时被修改；
- 使用返回对象的函数，由于每次返回的都是一个新对象（Object 的实例），引用地址不同，则不会出现这个问题

9. 组件的渲染流程：

- Vue.component--内部调用-->Vue.extend（继承，传入 options，生成组件构造函数，即子类）->子类->new 子类

10. vue 为什么需要虚拟 dom

- 真实 DOM 的抽象
- 直接操作 DOM 性能低但 js 层的操作效率高，可以将 DOM 操作转化为对象操作，最终通过 diff 算法比对差异进行更新 DOM，减少了对真实 DOM 的操作。
- 虚拟 DOM 不依赖真实平台环境，从而可以实现跨平台。

11. nextTick 在哪里使用

- 是在下次 DOM 更新循环结束之后（渲染完之后）执行的延迟回调

- 是异步的，但是将内容维护到一个数组里面，最终按顺序执行
  （属性更新为 a—>nextTick(获取值为 a，而不是 b)->属性更新为 b）
  （数据是异步更新，所以 nextTick 为了拿到新数据，它也是异步更新）

- 用于更新后的 DOM

- 第一次是异步，第二次往数组里面放，最后执行 flushCallBack 方法循环数组执行。

12. computed 和 watcher 的区别（功能不同，实现原理相同都是 watcher（dep 发布订阅模式））

- 功能：
  - computed 是具备缓存的，依赖的值不发生变化，则不会重新计算
  - watch 是监控值的变化，一变就会执行回调
- 原理：
  - computed 和 watch 都是基于 Watcher 来实现的
    - computed 是取值时才执行（写成一个函数，然后 defineProperty 对应的属性的时候，进行调用该函数（类似 get 函数）），
    - watch 是（数据一改，则直接执行对应的方法），类似 set 函数。
  - 访问代理函数，代理函数里面通过 watcher.dirty 判断是取缓存还是重新计算。
  - dirty 在哪里设置的：在 watcher 设置的

13. 发布订阅模式中的 watcher 有哪几种：

- 用户(就是我们写的 watch)、组件（template 中的）、计算属性三种 watcher

14. Vue.set 是怎么实现的（vm.$set(vm.user,age,11) || vm.$set(vm.user,1,11)）（可以用 set 去更新数组索引）

- 数组和对象都增加了 dep 属性，dep 会进行收集，收集的是 watcher
- 如果是数组，调用 splice
- 如果是对象，defineReative 将这个属性设置成响应式

15. vue 的 diff

- 平级比较，不考虑跨级比较的情况。内部采用深度递归的方式+双指针进行比较。
- 先比较是否相同节点，key tag；
- 相同节点比较属性，并复用老节点。
- 比较儿子节点，考虑老节点和新节点的情况。
- 优化比较，头头，尾尾，头尾，尾头；
- vue3 中采用最长递增子序列来实现 diff 优化

16. 组件传值

- props & $emit
- $children & $parent 获取子组件和父组件的对象
- $ref 获取特定的子组件的 dom
- eventbus: 创建一个单独的 js 文件，需要就引入 eventbus.$emit()，需要接受消息就eventbus.$on
- $attr & $listener:解决多级子组件的传递问题：a->b->c b通过使用$attr 传递 a 的值到 c，$listener 监听子组件中数据变化，传递给父父组件。
- project & inject :兄弟传值，类似于 react 的 context

17. Vue 的 DOM 更新是同步还是异步？

- 初次渲染是同步，更新是异步
- 为什么是异步：每次读取数据的时候都要更新，会造成很多不必要的性能浪费
- 原理：每次的更新操作都调用 nextTick 讲异步任务加入列队；
  - 整体利用的是一个发布订阅；每一次的 nextTick 执行都是把对应的回调函数放到一个数组里面，然后同步代码执行完成之后，异步函数（能用微任务就用微任务、不能就用宏仁务）进行执行数组里面的回调函数

18. 自定义指令：

- 对普通 DOM 元素进行底层操作（如 focus）
- 用法：`Vue.directive("focus",{ inserted:(el)=>{ el.focus() } } )`
- 钩子函数：

  - bind: 只调用一次，初始化
  - inserted: 被绑定的元素插入父节点的时候触发
  - update: 所在的组件更新的时候调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。

    - 可以通过参数来判断
    - 参数：el,binding,vnode,oldnode
    - 除了 el 之外，其它参数都应该是只读的

  - componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用
  - unbind：解绑时调用

19. `v-if`和`v-show`的区别：

- v-if 在编译的过程中会被转化成三元表达式，然后不满足就不会渲染节点。因此它不是一个指令。
- v-show 会被编译成指令，条件不足时控制样式将对应节点隐藏。内部其他指令依旧会继续执行。
- v-if 和 v-show 都会导致重绘，而 v-if 会导致重排。v-show 不会。
- v-if 和 v-for 不要连用。

20. vue-router 有哪几种钩子函数，具体是什么及执行流程
    答：钩子函数种类有全局守卫，路由守卫，组件守卫。
    1、导航被触发  
    2、在失火的组件里调用 beforeRouteLeave 守卫  
    3、调用全局的 beforeEach 守卫  
    4、在重用的组件里调用 beforeRouteUpdate 守卫  
    5、在路由配置里调用 beforeEnter 守卫  
    6、解析异步路由组件  
    7、在被激活的组件里调用 beforeRouteEnter  
    8、调用全局的 beforeResolve 守卫  
    9、导航被确认  
    10、调用全局的 afterEach 钩子  
    11、触发 DOM 更新  
    12、调用 beforeRouteEnter 守卫传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。

21. v-if 与 v-for 的优先级  
    v-for 和 v-if 进行不要再同一个标签中，因为解析时先解析 v-for 再解析 v-if 如果遇到需要同时使用时可以考虑写成计算属性的方式。

- 生成代码 `v-for`-> `v-if`
- 先计算出来，再进行 v-if 的判断
- for 循环内尽量不要绑定事件，可以用事件委托的方式。
- vue3 相反

22. 组件中的 name 选项有哪些好处及作用？  
    可以通过名字找到对应的组件；通过名字去渲染。（递归组件）  
    可以通过 name 属性实现缓存功能（keep-alive）  
    可以通过 name 来识别组件（跨级组件$emit||eventbus 通信时非常重要）

23. Vue 事件修饰符有哪些？其实现原理是什么？  
    答：capture，prevent，once，stop，self。

24. Vue 中模板编译原理

- template 转成 ast 树（template 循环，正则匹配，换成一个对象，children 等等属性）
- ast 树生成 render 函数（标记，diff 优化，render 函数是 with 语法，取值方便）
- vue-loader 中用到 vue-template-compiler

<!-- - template->ast 树（parseHTML（对 template 进行循环，把摸板换成 ast 树，ast 树是一个对象，有 children 等等，有点像虚拟 DOM，但属性不一样）->对 ast 树进行标记、标记静态节点（diff 优化）（递归标记，对象里面的 static 属性：trueorfalse）->生成代码（render 函数（with 语法，取值方便），对象） -->

25. vue3 和 vue2 的区别

- 对 typeScript 支持不友好，（所有属性都放在了 this 对象上，难以推倒组件的数据类型）
- 大量的 API 挂载在 Vue 对象的原型上，难以实现 TreeShaking。
- 在 vue 源码中写入跨平台代码不友好。
- componsitionAPI，受 reactHook 启发
- 虚拟 DOM 进行重写，对摸板的编译进行了优化操作(proxy)。

26. vue 优点

- 双向绑定
- 组件化开发
- 虚拟 DOM

# Vuex

1. 是什么：状态管理模式
2. 有什么：

- state：存储状态（变量）
- getters：对数据获取之前的再次编译，可以理解为 state 的计算属性。我们在组件中使用 $store.getters.fun()
- mutations：修改状态，并且是同步的。在组件中使用$store.commit('',params)。这个和我们组件中的自定义事件类似。
- actions：异步操作。在组件中使用是$store.dispath('')
- modules：store 的子模块，为了开发大型项目，方便状态管理而使用的。这里我们就不解释了，用起来和上面的一样。

3. 怎么用：

- 取值：$store.state.xxx
- 赋值：$store.commit("")

4. store 是怎么注册的：

- vuex 在 vue 的生命周期中的初始化钩子前插入一段 Vuex 初始化代码。给 Vue 的实例注入一个 $store 的属性，从而this.$store.xxx

# Node

1. nodejs 事件循环机制

- Node.js 采用事件驱动和异步 I/O，实现单线程、高并发的运行环境

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

- 每个阶段结束后都会判断是否存在微任务，有则执行。
  - 微任务分为：`process.nextTick()`和 `promise.then()`,nextTick 比 then 早。
- 初次进入事件循环，从 timer 开始，会判断是否存在 setTimeout 和 setInterval，存在则执行，完毕->微任务->I/O callbacks ->Idle/prepare ->poll 轮询
- poll 轮询回调列队：
  - 列队不为空：执行回调
    - 触发了相应的微任务，等这个回调执行完毕就执行对于的微任务
  - 列队为空：
    - 有 setTimeout 和 setInterval 倒计时结束，会结束 poll，去 timer 执行 callback
    - 有 setImmidate,结束 poll，去 check
    - 否则阻塞，等待新的回调进来
- check: 处理 setImmediate 的回调。
- close callback:执行一些回调，线程 socket 等。

2. node 的全局对象：需不需要 require 引入，不需要就是全局的。

- process:进程对象
- console
- Buffer：可以用来操作二进制数据流

# TS

1. js 的超集，编译为纯 js
2. 支持面向对象的编程概念，如类、接口、继承、泛型等
3. 它支持强类型或静态类型特性。

# Webpack

1. webpack 是干什么的，它都做了哪些工作

- 定义：webpack 是模块打包工具
- 功能：分析你的项目结构，找到 JavaScript 模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript 等），并将其打包为合适的格式以供浏览器使用。

2. 为什么要有 webpack，没有就不行吗

- 编译时的语言如 TS 等，能够实现目前 JS 不能直接使用的特性，webpack 等帮我们进行转换成 JS 以便于浏览器识别
- CSS 预处理器：less sass 等都可以提高我们的开发效率，webpack 可以帮我们在编译时进行处理成 CSS

3. 与其他工具的对比，grunt, gulp

- Gulp/Grunt 是一种能够优化前端的开发流程的工具

  - 在一个配置文件中，指明对某些文件进行类似编译，组合，压缩等任务的具体步骤，这个工具之后可以自动替你完成这些任务。

- webpack：把你的项目当做一个整体，通过一个给定的主文件（如：index.js），Webpack 将从这个文件开始找到你的项目的所有依赖文件，使用 loaders 处理它们，最后打包为一个浏览器可识别的 JS 文件。用 plugin 来扩展功能

4. loader,plugin 写过吗，怎么写

- loader: webpack 原生只能识别 js 文件，loader 让 webpack 拥有了加载和解析非 js 文件的能力

  - babel-loader：把 ES6 转换成 ES5
  - css-loader：加载 CSS，支持模块化、压缩、文件导入等特性
  - style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS。
  - sass-loader、less-loader：将 sass 语法、less 语法编译时转为 CSS 语法。

- plugin：扩展 webpack 功能，比如定义环境变量、提取公共代码等 plugin，在 webpack 打包的过程中，用 plugin 进行监听事件，在合适的时机通过 Webpack 的 API 改变输出结果

  - HtmlWebpackPugin：生成 HTML5 文件，自动引入 JS 文件。
  - define-plugin：定义环境变量
  - commons-chunk-plugin：提取公共代码

- 差别：
  - 作用不同
    - loader:webpack 原生只能识别 js 文件，loader 让 webpack 拥有了加载和解析非 js 文件的能力
    - plugin:扩展 webpack 功能，比如定义环境变量、提取公共代码等 plugin，在 webpack 打包的过程中，用 plugin 进行监听事件，在合适的时机通过 Webpack 的 API 改变输出结果
  - 用法不同
    - loader：作为模块的解析规则而存在，在 module.rule 里面配置
    - plugin：在 plugin 单独配置。

5. webpack 的构建流程：串行的过程

- 初始化参数：从配置文件和 shell 语句中读取与合并参数，得出最终的参数
- 开始编译：得到参数后初始化 Complier 对象，加载所有配置的插件，执行对象的 run 方法
- 编译：找到 entry 入口，从入口文件出发，调用 loader 进行模块编译，递归进行编译，直至完成
- 输出资源：入口和模块的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表。
- 输出完成：配置输出路径和文件名，将文件写入文件系统
- 在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

6. 代码分割 Code Splitting

- 按需加载
- 将文件分割成块，进行按需加载

7. 模块热更新：

- `devServer: {hot:true}`
- 代码修改过后不用刷新浏览器就可以更新

8. tree-shaking:

- 在打包中去除那些引入了，但是在代码中没有被用到的那些死代码。
- uglifySPlugin

9. 什么是长缓存？在 webpack 中如何做到长缓存优化？

- 浏览器在用户访问页面的时候，为了加快加载速度，会对用户访问的静态资源进行存储，但是每一次代码升级或是更新，都需要浏览器去下载新的代码，最方便和简单的更新方式就是引入新的文件名称。
- 在 webpack 中可以在 output 纵输出的文件指定 chunk hash,并且分离经常更新的代码和框架代码。通过 NameModulesPlugin 或是 HashedModuleIdsPlugin 使再次打包文件名不变。

10. webpack 打包慢

- 开发时期打包慢：
  - webpack --watch
- 放入生产的时候打包慢：
  - Webpack.config.js 中配置了 externals,配置不用打包的模块
  - 配置 babel：让它排除一些文件：ignore
  - webpack.DllPlugin：动态链接库
    - 本质上和我们 externals 是一样的，自动化提高效率

# 算法

1. 快排：(分治法)

```js
function quickSort(arr) {
  if (arr.length < 2) return arr;
  let left = [],
    right = [];
  let temp = arr[0];
  arr.forEach((e) => {
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

2. 插排：

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

3. 防抖:一段时间内，多次执行某个方法，只执行最新的那个请求

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
//立即执行与非立即执行
function debounce(func, wait, immediate) {
  var timeout = null;
  return function () {
    let context = this;
    let args = arguments;
    if (timer) clearTimeout(timer);
    if (immediate) {
      var callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timer = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
  };
}
```

4. 节流：一段时间内，多此执行某个方法，在一段时间内只执行一次。多次发起请求，不会理会。

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

5. （二叉树）前序中序求后序：

```js
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
demo([1, 2, 3, 4, 5, 6, 7], [3, 2, 4, 1, 6, 5, 7]);
console.log(temp);
```

6. 不稳定的排序：快速排序、希尔排序、堆排序
7. 稳定的排序：冒泡排序、插入排序、归并排序

# 其他

1. 事件处理机制：

- 三阶段：捕获、目标、冒泡
- 可以通过事件目标对象的 eventPhase 属性来得知当前事件在什么阶段。（1 捕获，2 目标，3 处理）
- addEventListener 注册事件，其中参数有 useCapture：true 时该事件在捕获阶段触发，false 在冒泡阶段触发。默认是冒泡。
- e.stopPropation:阻止事件向下捕获或者向上冒泡。
- e.preventDefault:阻止默认事件，不会阻止事件传递。

2. 为什么要阻止事件传递：

- 因为防止点透现象（父与子都有 click，都被触发，但我们只想触发子的）

3. 事件委托：

- 多个子元素的同一事件可以绑定在父元素上，提高效率，减少代码量。
- 父元素通过`e.target`或者`e.srcElement`（IE）识别子元素。然后再判断子元素是不是相应的标签`nodeName`

4. git 操作：

- git revert：撤销已经 push 的 commit，返回到已经 commit 但未 push 的时候
- git reset --soft：撤销 commit，到已 add 未 commmit 的时候
- git reset --hard：撤销 commit 和 add，代码也回到上一次 commit 的时候
- git commit --amend: 重新修改 commit 信息
- git rebase：变基

5. window 子对象：

- document：html 的信息
- history：浏览器访问过的 url
- location:url 上的一系列信息
- nagivator：浏览器的信息
- screen:客户端屏幕信息

6. 原生路由原理：hash and history

- hash： 通过 hashchange 事件监听 URL 的变化

  - 通过浏览器前进后退改变 URL
  - 通过<a>标签改变 URL
  - 通过 window.location 改变 URL
    这几种情况改变 URL 都会触发 hashchange 事件

- history： popState 监听 + 通过拦截 pushState 和 replaceState 来进行监听 url 的变化

  - pushState 和 replaceState 两个方法，这两个方法改变 URL 的 path 部分不会引起页面刷新
    - 我们可以拦截 pushState/replaceState 的调用和<a>标签的点击事件来检测 URL 变化，所以监听 URL 变化可以实现，只是没有 hashchange 那么方便。
  - popstate 事件
    - 通过浏览器前进后退改变 URL 时会触发 popstate 事件
    - 通过 pushState/replaceState 或<a>标签改变 URL 不会触发 popstate 事件

7. 观察者模式与发布订阅模式的区别：

- 观察者模式：观察者（Observer）直接订阅（Subscribe）主题（Subject），而当主题被激活的时候，会触发（Fire Event）观察者里的事件。

- 发布订阅模式：订阅者（Subscriber）把自己想订阅的事件注册（Subscribe）到调度中心（Event Channel），当发布者（Publisher）发布该事件（Publish Event）到调度中心，也就是该事件触发时，由调度中心统一调度（Fire Event）订阅者注册到调度中心的处理代码。

# 项目

1. Grpc:

- RPC: 框架提供了一套机制（类似 http 协议）使得应用程序间可以进行通信，遵从 server/client 模型，底层是 Http2.0 协议，而 restful api 不一定是 http2.0
  - 1： 通过 proto 通信，定义接口等，有更加严格的接口约束条件；安全性（接口约束）
  - 2： 二进制编码，减少传输的数据量 高性能
  - 3： 支持流式通信（streaming 模式），而 restful api 似乎很少这么用，视频流等都会用专门的协议 HLS，RTMP 等。
    （http2.0 的知识点）

2. 前端架构：

基础结构：

- MPA(multi-page-application)多页面应用：
  - 跳转需要刷新所有的资源，css、js 等公共资源需要选择性加载
  - 数据传递可以用 url 路径携带、localstorage、cookie 等
- SPA(single-page-application):单页面
  - 单页面跳转仅仅只是刷新局部资源，css、js 等公共资源仅需加载一次
- MPA 结合 SPA:
  - 路由导航+资源加载框架

解决的问题：

- 人多、团队多、普通应用变成巨型应用，不可维护问题；
  方式：
- 乾坤

3. Sentry 应用监控原理以及应用

- 开源的实时错误追踪系统。实时监控并修复异常问题。
- Sentry 的目的是为了让我们专注于系统与程序的异常信息，目的是提高排查问题的效率，日志事件的量到达一个限制时甚至丢弃一些内容。
- 原理：
  - Sentry 是一个 C/S 架构
  - 我们的应用只是把错误信息上报给 sentry 的 web 端。web 处理后放入消息队列或 Redis 内存队列，worker 从队列中消费数据进行处理。
  - 数据的逻辑和列队的压力都在服务器端，对客户端压力不大。
  - web->redis 列队->worker->存储 and 告警
  - 日志处理时聚合策略：优先级从高到低：Stacktrace->Exception->Template->Messages

4. 封装定时任务 node-schedule

- 原理：
  - 利用 cron 表达式，通过 settimeout 和 events 事件进行管理、对所有加入的事件进行排序，并且计算当前时间和最近的一个事件发生的时间间隔。然后用 setTimeOut 设置回调。一种是一次性的、一种是周期性的，一次性任务调用完就结束，周期性的会不断调用。
- events 事件监听器：观察者模式

  - 事件相当于一个主题，所有注册到这个事件上的处理函数相当于观察者（Observer）
  - eventEmitters->events<-进入事件循环->event loop->event handlers
  - Node.js 有多个内置的事件，我们可以通过引入 events 模块，并通过实例化 EventEmitter 类来绑定和监听事件
  - 大多数时候我们不会直接使用 EventEmitter，而是在对象中继承它。包括 fs、net、 http 在内的，只要是支持事件响应的核心模块都是 EventEmitter 的子类。

- 为什么要继承 EventEmitter 的子类？

  - 首先，具有某个实体功能的对象实现事件符合语义， 事件的监听和发射应该是一个对象的方法。
  - 其次 JavaScript 的对象机制是基于原型的，支持 部分多重继承，继承 EventEmitter 不会打乱对象原有的继承关系。

- 每个任务需要单独 new 一个 schedule.RecurrenceRule 对象（用来处理 Cron 表达式的），不能公用。

5. 封装自定义 hooks

- 自定义 Hooks 函数偏向于功能，而组件偏向于界面和业务逻辑
- useEffect 进行触发更新或者是首次执行
- useCallback or useMemo 来缓存方法或者变量。

```js
function useWinSize() {
  const [size, setSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  });
  const onResize = useCallback(() => {
    setSize({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    });
  }, []);
  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return size;
}
```

6. 装饰器 routing-controller

- 装饰器就是一个方法，可以注入到类、方法、属性参数上来扩展类、属性、方法、参数的功能。
- ts 天然支持 decorator,在 tsconfig.js 里增加配置：`experimentalDecorators:true`
- AOP 面向切面编程: 使用装饰器对于工程最大的两个好处（面向切面编程：解耦：抽离出来公共逻辑）
  - 不需要抽象出一个基类，写一些基础函数
  - 函数内部结构完全没有被改变，逻辑依旧干净整洁
- metaData 与 Reflect：
  - metaData 存储一个对象的描述信息。（我们用来做用户的信息存储）

7. Git hooks

- eslint 校验标准：@vue/standard
- pre-commit 钩子在 git commit 执行时被触发，执行 npm run precommit 脚本（即 lint-staged 命令）；
- lint-staged 的配置，就是利用 linters 对暂存区的文件路径应用过滤规则，匹配的文件将执行后面配置的任务，

  - 这里的任务就是调用项目中的 eslint 指令检查文件，如果报错则先自动修复--fix，最后把没有问题的代码加入暂存区 git add。

- 如果最终还有报错，则流程终止，无法执行 commit 操作。

# 性能优化

1. 图片

- 缩短请求响应时间
  - 浏览器针对同一个域名有并发请求数量限制，可静态资源采用多个子域名，特别是图片域名（京东 PC 页面用到的商品图片域名就是多个子域名的方法）
  - CDN
- 减少请求数
  - 缓存（浏览器缓存）
  - 图片 base64 编码
  - 图片精灵图（sprite）
  - 图片懒加载（react-loadLazy）
- 减少请求大小
  - 图片使用 webp 格式：大小缩小 30%-50%，懒加载过程中，判断是否支持 webp，后期可以优化为：服务器依据请求头是否支持 webp，支持则自动返回 webp 格式的图片。

2. SSR 服务端渲染

- 定义： 在服务器上把数据和模板拼接好以后发送给客户端显示
- 优点：

  1. 更好的 SEO，

  - 由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面。
  - 单页应用是根据路由，通过 ajax 异步的更新页面一个部分来实现应用效果，这样抓取工具是无法获取页面。

  2. 对于缓慢的网络或运行缓慢的设备。可提供获取网页速度，有良好的用户体验。

  - 单页应用在第一次加载时，需要将一个打包好（requirejs 或 webpack 打包）的 js 发送到浏览器后，才能启动应用。
  - 在服务器端就预先完成渲染网页后，直接发送到，会更快速地看到完整的渲染的页面

  3. 用 nuxt.js，简单做就是用模板引擎在 node.js 生成，然后通过 node 的中间件匹配路由，然后直接返回。

- 做法：
  - 发请求的工具需要前后端通用，可以使用 fetch + node-fetch 或 axios；
  - 编译代码时，需要编译两份，一份 target 是 node，一份 target 是 browser，它们将在不同的环境下运行；node 这份可以编译成 es6 或再高的版本，这个取决于 node 的版本；
  - 需要实现一个 node 服务器，根据不同的路由返回不同的页面；

3. 工具：lightHouse，chrome 性能分析工具
4. 首屏性能：

- FCP: 白屏时间
  - 首次内容绘制，标记的是浏览器渲染第一针内容 DOM 的时间点，该内容可能是文本、图像、SVG 或者 <canvas> 等元素
  - 减少阻塞页面的静态资源
  - 减少服务器响应的时间
  - 骨架屏 loading
- FMP: 首次有效绘制，标记主角元素渲染完成的时间点，主角元素可以是视频网站的视频控件，内容网站的页面框架也可以是资源网站的头图等。

- LCP：最大快内容绘制时间
  - SSR
  - 让核心模块优先展示
- TTI: 首次输入延迟，记录在 FCP 和 TTI 之间用户与页面交互时响应的延迟

5.  节流防抖

6.  打包优化：

- code spliting
  - 路由懒加载（）=>import("./chunk")
  - commons-chunk-plugin：提取公共代码
  - entry 把路径分成多个。

7. 预加载：
   `<link rel="preconnect" href="//s3.pstatp.com">`

- preconnect
  - 作用：提前建立好 TCP 连接
  - 使用场景：静态资源的 CDN 域名，跨域请求的域名
- proload
  - 作用：高优先级预加载资源，适用于本页面要用到的资源
  - 使用场景：需要在首屏展示的关键图片，动态加载模块（code-splitting）对应的资源
- prefetch
  - 作用：低优先级预加载资源，适用于下一个页面将要用到的资源
  - 使用场景： 提前请求下一级页面及其资源，如果预加载的对象是一个页面，那这个页面应该返回相应的表示可缓存的响应头
- prerendering
  - 作用：与 prefetch 相似，prerendering 更适用于页面，用 prerendering 预加载页面的时候，同时也会预加载页面里的资源
  - 使用场景：因为流量开销比较大，更适用于明确知道用户会进入某个页面的场景

8. 为什么建议将修改 DOM 的操作里放到 useLayoutEffect 里，而不是 useEffect？

- 减少回流、重绘
- DOM 已经被修改，但但浏览器渲染线程依旧处于被阻塞阶段，所以还没有发生回流、重绘过程。由于内存中的 DOM 已经被修改，通过 useLayoutEffect 可以拿到最新的 DOM 节点，并且在此时对 DOM 进行样式上的修改，假设修改了元素的 height，这些修改会在步骤 11 和 react 做出的更改一起被一次性渲染到屏幕上，依旧只有一次回流、重绘的代价。

9. useMemo 和 useCallback 的好处

- usememo 和 useCallback 都可以通过监听特定的参数来判断是否在渲染阶段重新计算对应的数值或者是对应的函数，好处便是做到性能的优化。
- 区别：useMemo 通常用于计算一个数值，可以是状态的改变等；而 useCallback 缓存的是函数，就比如子组件啥的，只要 props 没有改变，那么子组件就不需要刷新，使用 useCallback 可以不用让子组件刷新。

# 智力题

1. 烧绳子
2. 老虎吃羊：
   > 有 500 只老虎，1 只羊，一片草原。老虎和羊，都可以吃草活着，对，这个题中的老虎可以吃草。老虎呢，也能吃羊，不允许很多只老虎一起吃羊，只允许一只老虎吃一只羊，并且，吃完羊之后，这个老虎就会变成羊。那么问，老虎会不会吃羊？ 提示:老虎很聪明，每只老虎都很聪明。

> 答：不吃

- 现在只有 1 老虎，1 羊，那么这只羊会被吃吗？
  肯定被吃了，老虎吃了羊后，变成羊，也不会有生命危险了。老虎很聪明，干嘛不吃。

- 现在只有 2 老虎，1 羊，那么这只羊会被吃吗？
  不会吃。这两只老虎都很聪明，吃了后自己变成了羊，就会被另一只老虎吃掉自己。

- 现在只有 3 老虎，1 羊，那么这只羊会被吃吗？
  吃啊，吃! 反正吃完后，变成上面的情况后没有老虎敢吃我了，我得体验体验羊肉。

- 现在只有 4 老虎，1 羊，那么这只羊会被吃吗？
  不吃，吃了后变成上面情况后，自己变成了羊，该被吃掉了。

- 现在只有 5 老虎，1 羊，那么这只羊会被吃吗？
  吃啊，吃! 反正吃完后，变成上面的情况后没有老虎敢吃我了，我得体验体验羊肉。

- 现在只有 6 老虎，1 羊，那么这只羊会被吃吗？
  不吃，吃了后变成上面情况后，自己变成了羊，该被吃掉了。

偶数不吃，奇数吃。

3. 实验室有 100 个瓶子，其中有一瓶装有慢性毒药（第 3 天发作)，另外 99 瓶装有蒸馏水。请问至少需要多少只小白鼠才能在 3 天内找出哪一瓶是慢性毒药？

- n 只小白鼠 t 周的时间可以从 (t+1)^n 个瓶子中检验出毒药来。
- 对 100 瓶子进行排序 0-99，然后 2^7=128;所以有 7 位数，然后的话，就第一只老鼠就喝 1xxxxxx，第二只喝 x1xxxxx,……然后看看哪几只老鼠死了，就可以确定了。

4. 用两鸡蛋在 100 层楼中找出会破掉的临界值

- 如果鸡蛋无限：用二分法，最小 7 次
- 鸡蛋只有 2 个，dp 动态规划
  - 假设第一个鸡蛋到 k 层
    - 不碎：继续往上+k 层；还有 2 次机会
      - 不碎：继续往上+k 层；还有 2 次机会
      - 碎：在 k 与 2k 之间，然后就进行 k 层的尝试
    - 碎：下面 k 层一层层试。
- dp[n]=min(max(i,1+dp[n−i]))(1≤i≤n)

5. 25 人赛跑 5 条跑道，找出最快的 3 人

- 第一步：25 个人分成 5 组，每组 5 人，分别比赛，得出每组的第一名，并对第一名进行排序，为 A1, B1, C1, D1, E1；
- 第二步：，A1, B1, C1, D1, E1 进行一次比赛，得出第一名，假设为 A1，此时经过 6 轮比赛，得出第一名；
- 第三步： 找第二名第三名；首先第一步中 D1, E1 排除，同时排除对应组所有成员；剩 A1, B1, C1 三组
- 第四步： 第二名可能人员是 A2，B1； 第三名可能人员是 A2，A3, B1，B2, C1
- 第五部： 综合第四步猜猜，A2，A3, B1，B2, C1 进行一轮比赛，得出第二名第三名，此时总共经过 7 轮比赛；

6. 足够多的水和两个水杯（7L 和 17L），如何得到 9L 水

- 先满 17 -7-7 剩余 3L，然后存起来，反复 3 次就可以得到 9 升了。

7. 16 个球，有一个异常球，有一个天平秤，称重多少次，可以找到那个球（称重次数尽量少）

- 3 次.
  - 先分成 2 组,每组 8 个,放天平上.重的那个在哪边很容易看出来.
  - 再在轻的那 8 个中取出 1 个,放到重的这边,凑成 9 个球；然后把这个 9 个球分成 3 组,任意选两组放到天平上：① 如果一样重,则重的那个球在另一组没过秤的那 3 个球里,② 如果不一样重,则重的那个球就在重的那一组里.
  - 挑出这一组,重复 ⒉ 的步骤可找到那个重一点的小球.

# 美团算法

1. 奇数位丢弃：
   对于一个由 0..n 的所有数按升序组成的序列，我们要进行一些筛选，每次我们取当前所有数字中从小到大的第奇数位个的数，并将其丢弃。重复这一过程直到最后剩下一个数。请求出最后剩下的数字。

```js
// 规律 第一次后第一个为1，第二次后第二个为3 第三次 7、15 31 63 127……
let n;
while ((n = readline())) {
  let p = 0;
  n = parseInt(n) + 1;
  while (n > 1) {
    n = (n / 2) | 0;
    p++;
  }
  print(Math.pow(2, p) - 1);
}
```

2. 吃鱼：

- 她抓到了 n 条鱼，她有一个煎锅，每次可以同时煎 m 条鱼。这个煎锅可以花一分钟的时间煎熟鱼的一面，当一条鱼的两面都煎熟了它就可以吃了。现在她想知道最少需要花多少时间能够把所有的鱼都煎熟。
- n 条鱼 m 个锅，一次一分钟挣一面，需要多少分钟；

```js
//所有面：2*n 除锅m,有余数就向上进一；
var arr = readline().split(" ");
var n = parseInt(arr[0]);
var m = parseInt(arr[1]);
if (n < m) console.log(2);
else console.log(Math.ceil((2 * n) / m));
```

3. 交错序列：
   我们定义一个由数字 0 和 1 组成的序列是交错序列，当且仅当在这个序列中 0 和 1 是轮流 出现的，比如，0，010，10101 都是交错序列。
   现在给出了一个由数字 0 和 1 组成的序列 𝐴，它可能不是一个交错序列，但是你可以从这个 序列中选择一些数字出来，按他们在序列 𝐴 中原有的相对顺序排列(即选取 𝐴 的一个子序列)， 使得你最后得到的是一个交错序列。问这样能得到的交错序列的最长长度是多少。

```js
let n = parseInt(readline());
let arr = readline().split(" ");
let flag = arr[0];
let ans = 1;
for (let j = 1; j < arr.length; j++) {
  if (arr[j] != flag) {
    ans++;
    flag = arr[j];
  }
}
print(ans);
```

4. 分糖果
   > 有 N 个小朋友站在一排，每个小朋友都有一个评分
   > 你现在要按以下的规则给孩子们分糖果：
   > 每个小朋友至少要分得一颗糖果
   > 分数高的小朋友要他比旁边得分低的小朋友分得的糖果多
   > 你最少要分发多少颗糖果？

```js
function candy(ratings) {
  // write code here
  //dp[i]表示第i个小朋友获得的糖果
  //dp[1]=1;
  //dp[i]=max(dp[i],dp[i-1]+1);
  //dp[i]=max(dp[i],dp[i+1]+1);
  let len = ratings.length;
  let arr = new Array(len).fill(1);
  for (let i = 1; i < len; i++) {
    if (ratings[i] > ratings[i - 1]) {
      arr[i] = arr[i - 1] + 1;
    }
  }
  //来回两次循环
  for (let j = len - 2; j >= 0; j--) {
    if (ratings[j] > ratings[j + 1] && arr[j] <= arr[j + 1]) {
      arr[j] = arr[j + 1] + 1;
    }
  }
  return arr.reduce((first, curr) => {
    return first + curr;
  });
}
```

5. 字符串匹配

   > 牛牛有两个字符串 A 和 B,其中 A 串是一个 01 串,B 串中除了可能有 0 和 1,还可能有'?',B 中的'?'可以确定为 0 或者 1。 寻找一个字符串 T 是否在字符串 S 中出现的过程,称为字符串匹配。牛牛现在考虑所有可能的字符串 B,有多少种可以在字符串 A 中完成匹配。
   >
   > 例如:A = "00010001", B = "??"
   > 字符串 B 可能的字符串是"00","01","10","11",只有"11"没有出现在字符串 A 中,所以输出 3

   > 正则表达式，将？改成. 然后递归循环匹配，match，有就放入 set。

```js
let a = readline(),
  b = readline();
var patt = "^";
for (let i = 0; i < b.length; i++) {
  if (b[i] == "?") {
    patt += ".";
  } else {
    patt += b[i];
  }
}
var re = new RegExp(patt);
var set = new Set();
while (a.length > 0) {
  var child = a.match(re);
  if (child) {
    set.add(child[0]);
  }
  a = a.substr(1);
}
print(set.size);
```

6. 字符反转

   > 现在有一个长度为 n 的字符串，进行循环右移 k 位的操作，少对这个字符串进行几次区间反转操作能实现循环右移 k 位呢。反转操作指字符串某一区间\left[ L,R \right][l,r]内的字符反转，例如“123456”，区间[3,5]进行反转字符串变为“125436”。假设字符串每一位都不同。给定一个字符串长度 n 和循环右移次数 k，求最少反转次数。

   > 输入：3,4
   > 输出：2
   > 例如字符串为 123 那么循环右移 4 次变为 312，用区间反转操作代替的话，就是先对[1,3]反转得到 321，再对[2,3]反转得到 312，最少进行两次反转操作

   > 思路：字符串 12345678，想要进行循环右移 3 位的操作，可以执行：
   > 先将字符串前 5 个字符进行翻转，得 54321678。
   > 再将字符串后 3 个字符进行翻转，得 54321876。
   > 最后将整个字符串进行翻转，得 67812345。循环右移了 3 位。
   > **三步翻转法可以实现数组循环右移操作**

   > 回到本题，根据上面所述，可以得知所有字符串的最少翻转次数小于等于 3。列出特殊情况：
   >
   > 如果 或者 ，不用翻转。
   > 如果 ，那么翻转第 2 步可以省略；如果 ，那么翻转第二步可以省略。
   > 如果 ，可以先翻转前 个字符，再翻转后 个字符。例，12345678 -> 76543218 -> 78123456。
   > 如果 ，先翻转后 个字符，再翻转前 个字符。

```js
function solve(n, k) {
  // write code here
  k %= n;
  if (n == 1 || k == 0) {
    return 0;
  }
  if (n == 2) {
    return 1;
  }
  if (k == 1 || n - k == 1 || k == 2 || n - k == 2) {
    return 2;
  }
  return 3;
}
```

7. 二维数组翻转
   > 根据二维数据的 Aii 进行翻转。

```js
function demo(n, m) {
  let arr = [
    [1, 2, 3],
    [4, 5, 6],
  ];
  if (m > n) {
    for (let i = n; i < m; i++) {
      arr.push([]);
    }
  }
  console.log(arr);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      [arr[i][j], arr[j][i]] = [arr[j][i], arr[i][j]];
    }
  }
  if (m > n) {
    for (let i = 0; i < n; i++) {
      for (let j = n; j < m; j++) {
        [arr[i][j], arr[j][i]] = [arr[j][i], arr[i][j]];
      }
    }
  }
  console.log(arr);
  for (let i = 0; i < m; i++) {
    let res = "";
    for (let j = 0; j < n; j++) {
      res += arr[i][j];
      if (j != n - 1) {
        res += " ";
      }
    }
    // print(res);
    console.log(res);
  }
}
demo(2, 3);
```

8. 寻找数字

# 字节算法

1. 寻找两个正序数组的中位数：

```js
var findMedianSortedArrays = function (nums1, nums2) {
  // //o(m+n);
  // let num=[...nums1,...nums2].sort((a,b)=>a-b);
  // if(num.length%2==0){
  //     //偶数位
  //     let index=num.length/2;
  //     return (num[index]+num[index-1])/2;
  // }else{
  //     //奇数位
  //     let index=num.length/2|0;
  //     return num[index];
  // }

  //二分法
  // 保证num1是比较短的数组
  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1];
  }
  const length1 = nums1.length;
  const length2 = nums2.length;
  let min = 0;
  let max = length1;
  let half = Math.floor((length1 + length2 + 1) / 2);
  while (max >= min) {
    const i = Math.floor((max + min) / 2);
    const j = half - i;
    console.log(nums1[i - 1], nums2[j]);
    console.log(nums1[i], nums2[j - 1]);
    if (i > min && nums1[i - 1] > nums2[j]) {
      max = i - 1;
    } else if (i < max && nums1[i] < nums2[j - 1]) {
      min = i + 1;
    } else {
      let left, right;
      if (i === 0) left = nums2[j - 1];
      else if (j === 0) left = nums1[i - 1];
      else left = Math.max(nums1[i - 1], nums2[j - 1]);

      if (i === length1) right = nums2[j];
      else if (j === length2) right = nums1[i];
      else right = Math.min(nums1[i], nums2[j]);
      console.log("===");
      console.log(left, right);
      return (length1 + length2) % 2 ? left : (left + right) / 2;
    }
  }
};
```

2. 接雨水：
   <!-- https://leetcode-cn.com/problems/trapping-rain-water/ -->
   给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

```js
var trap = function (height) {
  let left = 0,
    right = height.length - 1;
  let res = 0;
  let leftMax = 0,
    rightMax = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(height[left], leftMax);
      res += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(height[right], rightMax);
      res += rightMax - height[right];
      right--;
    }
  }
  return res;
};
```

3. 给出 n 代表生成括号的对数，请你写出一个函数，使其能够生成所有可能的并且有效的括号组合。
<!-- 深度dfs -->

```js
var generateParenthesis = function (n) {
  let res = [];
  let dfs = (s, left, right) => {
    if (left == n && right == n) return res.push(s);
    if (left < n) dfs(s + "(", left + 1, right);
    if (right < left) dfs(s + ")", left, right + 1);
  };
  dfs("", 0, 0);
  return res;
};
```

4. 最接近的三数之和

```js
var threeSumClosest = function (nums, target) {
  nums.sort((a, b) => a - b);
  let res = nums[0] + nums[1] + nums[2];
  let n = nums.length;
  for (let i = 0; i < n; i++) {
    let left = i + 1;
    let right = n - 1;
    while (left < right) {
      let sum = nums[i] + nums[left] + nums[right];
      if (Math.abs(res - target) > Math.abs(sum - target)) {
        res = sum;
      } else if (sum > target) {
        right--;
      } else if (sum < target) {
        left++;
      } else if (sum === target) {
        return res;
      }
    }
  }
  return res;
};
```

5. Promise 并发个数限制

```js
//promise.all限制并发个数
function limitedRequest(urls, maxNum) {
  const pool = [];
  const initSize = Math.min(urls.length, maxNum);
  for (let i = 0; i < initSize; i++) {
    pool.push(run(urls.splice(0, 1)));
  }
  function r() {
    console.log("当前并发度：", pool.length);
    if (urls.length === 0) {
      //全部发完
      console.log("并发请求已经全部发起");
      return Promise.resolve();
    }
    return run(urls.splice(0, 1));
  }
  function run(url) {
    // return mockFetch(url).then(r);
    //模拟请求
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(url);
      }, 2000);
    }).then(r);
  }
  Promise.all(pool).then(() => {
    console.log("结束");
  });
}
limitedRequest([1, 2, 3, 4, 5, 6, 7, 8], 3);
```

6. 合并两个升序数组

```js
function merge(A, m, B, n) {
  let len = m + n;
  while (n > 0 && m > 0) {
    if (A[m - 1] > B[n - 1]) {
      A[--len] = A[--m];
    } else {
      A[--len] = B[--n];
    }
  }
  while (n) {
    A[--len] = B[--n];
  }
  return A;
}
```

7. 层次遍历

```js
function levelOrder(root) {
  // write code here
  //后序遍历,左右中，递归
  let res = [];
  let digui = function (root, n, r) {
    if (!root) return;
    digui(root.left, n + 1, r);
    digui(root.right, n + 1, r);
    r[n] = r[n] || [];
    r[n].push(root.val);
  };
  digui(root, 0, res);
  return res;
}
```

8. 迭代先序遍历

```js
function demo(root) {
  let stack = [];
  let res = [];
  while (stack.length || root) {
    if (root != null) {
      stack.push(root);
      res.push(root.val);
      root = root.left;
    } else {
      root = stack.pop();
      root = root.right;
    }
  }
  return res;
}
```

9. 二叉树的最大路径和

```js
function maxPathSum(root) {
  // write code here
  var maxSum = -Infinity;
  function getMax(root) {
    if (!root) return 0;
    let leftSum = Math.max(0, getMax(root.left));
    let rightSum = Math.max(0, getMax(root.right));
    maxSum = Math.max(maxSum, leftSum + rightSum + root.val);
    return Math.max(0, Math.max(leftSum, rightSum) + root.val);
  }
  getMax(root);
  return maxSum;
}
```

10. 简化路径
    > linux 路径简化

```js
var simplifyPath = function (path) {
  const dir = path.split("/"),
    stack = [];
  for (const i of dir) {
    if (i === "," || i === "") continue;
    if (i === "..") {
      stack.length > 0 ? stack.pop() : null;
      continue;
    }
    stack.push(i);
  }
  return "/" + stack.join("/");
};
```

11. 手写 jsonp

```js
function jsonp(url){
  let script =document.createElement("script");
  let uniqueName=`jsonpCallback${new Date().getTime()}`
  script.src=`url${url.indexOf('?')>-1?'&':'?'}callback=${uniqueName}`
  docuement.body.appendChild(script)
  window[uniqueName]=(res)=>{
    cb && cb(res)

  }
}

 <script>
    function handleJsonp (data) {
      console.log('data', data)
    }
  </script>
  <script src="http://localhost:3002?callback=handleJsonp"></script>
```

12. 子数组的最大累加和问题

```js
function maxsumofSubarray(arr) {
  // write code here
  let max = 0;
  let temp = 0;
  for (let i = 0; i < arr.length; i++) {
    temp = temp + arr[i];
    temp = Math.max(temp, 0);
    if (temp > max) {
      max = temp;
    }
  }
  return Math.max(temp, max);
}
```

# 其他家算法

1.  > 小易总是感觉饥饿，所以作为章鱼的小易经常出去寻找贝壳吃。最开始小易在一个初始位置 x*0。对于小易所处的当前位置 x，他只能通过神秘的力量移动到 4 * x + 3 或者 8 \_ x + 7。因为使用神秘力量要耗费太多体力，所以它只能使用神秘力量最多 100,000 次。贝壳总生长在能被 1,000,000,007 整除的位置(比如：位置 0，位置 1,000,000,007，位置 2,000,000,014 等)。小易需要你帮忙计算最少需要使用多少次神秘力量就能吃到贝壳。

- 解析：f(x)=2x+1,4x+3=f(2x+1) 8x+7=f(f(2x+1));因此只需要统计做多少次 2*x+1 操作就会到 1000000007 倍数的位置，将此次数记为 count；而对 4*x+3 操作 3 次相当于对 8*x+7 操作 2 次：
  如：g(x) = 4*x+3 ; m(x)=8*x+7 ; 则 g(g(g(x))) = m(m(x)) = 64*x+63 ;
  因此对 4*x+3 的操作次数只能为 0,1,2 ; 3 次时就可以用对 8*x+7 操作 2 次来代替。
  对（count+2）/3 就实现了上述。

```java
  import java.util.Scanner;
  public class Main {
  public static void main(String[] args) {
  Scanner sc = new Scanner(System.in);
  int x = sc.nextInt();
  //分析得 4*x+3 相当于 2*x+1 操作 2 次
  //8*x+7 相当于 2*x+1 操作 3 次
  //统计做了多少次 2*x+1
  int count = 0;
  while(x!=0 && count<=300000){
  x = ((x<<1)+1)%1000000007;
  count++;
  }
  count = (count+2)/3;//4*x+3 的操作只能进行 0,1,2 次
  System.out.println(count >100000 ? -1 : count);
  }
}
```

2. 三数之和：
   > 数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？找出所有和为 0 且**不重复**的三元组。
   > 输入：nums = [-1,0,1,2,-1,-4]
   > 输出：[[-1,-1,2],[-1,0,1]]

```js
var threeSum = function (nums) {
  if (nums == null || nums.length < 3) return [];
  let res = [];
  nums.sort((a, b) => a - b);
  //双指针
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] == nums[i - 1]) continue; //去重
    let left = i + 1,
      right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum == 0) {
        res.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] == nums[left + 1]) left++;
        while (left < right && nums[right] == nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) left++;
      else if (sum > 0) right--;
    }
  }
  return res;
};
```

3. 交换 a、b 的值，不用临时变量

```js
a = a + b;
b = a - b;
a = a - b;
```

4. 手写 reduce 的源码

```js
//reduce的原理是累加
Array.prototype.reduce = function (callback, prev) {
  for (let i = 0; i < this.length; i++) {
    if (typeof prev === "undefined") {
      prev = callback(this[i], this[i + 1], i + 1, this);
    } else {
      prev = callback(prev, this[i], i, this);
    }
  }
  return prev;
};
```

5. Set 实现两数组的交集、并集、补集

```js
//交集
let arr1 = [1, 2, 3, 4, 5, 4, 3, 2, 1];
let arr2 = [4, 5, 6, 5, 6];
let result = [...new Set(arr1)].filter((item) => new Set(arr2).has(item));
//[4,5]

//并集
let result = [...new Set([...arr1, ...arr2])];
//[1,2,3,4,5,6]

// 差集，arr1有，arr2没有的
let result = [...new Set(arr1).filter((item) => !new Set(arr2).has(item))];
//[1,2,3]

//arr1有 arr2没有 且arr1没有 arr2有的
let result = [...new Set([...arr1, ...arr2])].filter(
  (item) => !new Set(arr1).has(item) || !new Set(arr2).has(item)
);
console.log(result);
//[1,2,3,6]
```

6. 手写 new

```js
// 1. 创建一个空对象
// 2. 设置空对象的__proto__属性继承构造函数的prototype属性，也就是继承构造函数的原型对象上的公有属性和方法
// 3. 调用构造函数，将构造函数中的this替换为空对象的this，继承构造函数中的属性
// 4. 在函数内部返回一个新对象
function myNew(fun) {
  let obj = {};
  obj.__proto__ = fun.prototype;
  let result = func.apply(obj, ...arguments);
  return result instanceof Object ? result : obj;
}
```

7. 找字符串重复次数最多的字符
   > "abcbdbdbaadb"

```js
function find(str) {
  let map = {};
  for (let i = 0; i < str.length; i++) {
    if (map[str[i]]) {
      map[str[i]]++;
    } else {
      map[str[i]] = 1;
    }
  }
  let max = 0,
    k = "";
  for (let i in map) {
    if (map[i] > max) {
      max = map[i];
      k = i;
    }
  }
  return k;
}
```

8. 找零钱
   > 输入：coins = [1, 2, 5], amount = 11
   > 输出：3
   > 解释：11 = 5 + 5 + 1

```js
function find(coins, amount) {
  //动态规划
  //dp代表什么，dp[i]表示凑到i元的最少硬币数
  let dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (let coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] == Infinity ? -1 : dp[amount];
}
```

9. 找零钱 2
   > 输入: amount = 5, coins = [1, 2, 5]
   > 输出: 4
   > 解释: 有四种方式可以凑成总金额:
   > 5=5
   > 5=2+2+1
   > 5=2+1+1+1
   > 5=1+1+1+1+1

```js
var change = function (amount, coins) {
  //完全背包问题

  //一维动态规划
  var dp = new Array(amount + 1);
  dp.fill(0);
  dp[0] = 1;
  for (let i = 0; i < coins.length; i++) {
    for (let j = coins[i]; j <= amount; j++) {
      dp[j] += dp[j - coins[i]];
    }
  }
  return dp[amount];
};
```

10. 手写 reverse

```js
Array.prototype.reverse = function () {
  let arr = this;
  var left = 0,
    right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
};
var arr = [1, 2, 3, 4, 5];
arr.reverse();
console.log(arr);
```

11. 一个偶数分解成两个素数，求这两个素数相差最大时，这两个素数的值

```js
function isPrinme(n) {
  if (n == 0 || n == 1) {
    return false;
  }
  if (n == 2) {
    return true;
  }
  for (var i = 2; i < Math.sqrt(n); i++) {
    if (n % i == 0) {
      return false;
    }
  }
  return true;
}
function find(num) {
  for (let i = 2; i <= ((num / 2) | 0); i++) {
    if (isPrinme(i) && isPrinme(num - i)) {
      console.log(i, num - i);
      return;
    }
  }
}
find(210);
```

12. （二叉树）前序中序求后序：

```js
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
demo([1, 2, 3, 4, 5, 6, 7], [3, 2, 4, 1, 6, 5, 7]);
console.log(temp);
```

13. 剪绳子
    > 长度为 n，剪成 m 段，使得各段相乘，乘积最大
    > 数学题，凑到 3

```js
function demo(n) {
  if (n < 3) return n - 1;
  var times = (n / 3) | 0;
  var e = n % 3;
  if (e == 0) return Math.pow(3, times);
  else if (e == 1) return Math.pow(3, times - 1) * 4;
  return Math.pow(3, times) * 2;
}
```

14. 最长不包含重复字符的字符串的长度
    > 设 temp 进行保存，遍历用 indexOf 进行判断 temp 中是否有该字符，有就 slice 之前的部分，同时与 res 比较大小

```js
function demo(s) {
  let res = 0,
    temp = "";
  const len = s.length;
  for (let i = 0; i < len; i++) {
    if (temp.indexOf(s[i]) == -1) {
      temp += s[i];
      res = Math.max(res, temp.length);
    } else {
      temp = temp.slice(temp.indexOf(s[i]) + 1);
      temp += s[i];
    }
  }
  return res;
}
```

15. 简易的模板引擎：

```js
function tpl(templateStr, arr) {
  // write code here
  //var reg=/\{\{\$.\}\}/g;
  //let resArr=templateStr.match(reg);
  if (arr.length == 0) return templateStr;
  let temp = 0;
  let res = templateStr.replace(/\{\{\$[0-9][0-9]*\}\}/g, function (m, m1) {
    let num = parseInt(m.split("{{$")[1].split("}}")[0]);
    return arr[num];
  });
  return res;
}
tpl("<div>{{$0}}{{$1}}</div>", ["好未来", "tql"]);
//输出<di>好未来tql</div>
```

16. 二维数组回型遍历

```js
snail = function (arr) {
  var res;
  while (arr.length) {
    //左到右 一整行shift
    res = res ? res.concat(arr.shift()) : arr.shift();
    //上到下
    for (let i = 0; i < arr.length; i++) {
      res.push(arr[i].pop());
    }
    //右到左
    res = res.concat((arr.pop() || []).reverse());
    //下到上
    for (let i = arr.length - 1; i >= 0; i--) {
      res.push(arr[i].shift());
    }
  }
  return res;
};
```

17. 合并乱序区间

```js
var merge = function (arr) {
  if (arr.length <= 1) return arr;
  arr.sort((a, b) => {
    if (a[0] !== b[0]) {
      return a[0] - b[0];
    } else {
      return a[1] - b[1];
    }
  });
  let res = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    if (
      res[res.length - 1][1] >= arr[i][0] &&
      res[res.length - 1][1] <= arr[i][1]
    ) {
      //[1,3]和[2,4]
      //or
      //[1,2]和[2,4]
      //or
      //[1,4]和[2,4]
      let temp = res.pop();
      res.push([temp[0], arr[i][1]]);
    } else {
      //[1,3]和[4,5]
      res.push(arr[i]);
    }
  }
  return res;
};
merge([
  [3, 5],
  [1, 2],
  [1, 3],
  [6, 9],
  [8, 10],
  [11, 12],
]);
```

18. 二维数组翻转

```js
//aii翻转
//不一定是n*n,可能是m*n
function tran(arr) {
  let len1 = arr.length,
    len2 = arr[0].length;
  //凑够n*n
  if (len1 < len2) {
    for (let i = len1; i < len2; i++) {
      arr.push([]);
    }
    for (let i = 0; i < len1; i++) {
      for (let j = i; j < len2; j++) {
        [arr[i][j], arr[j][i]] = [arr[j][i], arr[i][j]];
      }
    }
  } else {
    for (let i = 0; i < len1; i++) {
      for (let j = 0; j < i; j++) {
        [arr[i][j], arr[j][i]] = [arr[j][i], arr[i][j]];
      }
    }
  }
  return arr;
}
//顺时针旋转90
// n*n m*n 先通过主对角线翻转，然后再每一项reverse
function tran(arr) {
  let len1 = arr.length,
    len2 = arr[0].length;
  //凑够n*n
  if (len1 < len2) {
    for (let i = len1; i < len2; i++) {
      arr.push([]);
    }
    for (let i = 0; i < len1; i++) {
      for (let j = i; j < len2; j++) {
        [arr[i][j], arr[j][i]] = [arr[j][i], arr[i][j]];
      }
    }
  } else {
    for (let i = 0; i < len1; i++) {
      for (let j = 0; j < i; j++) {
        [arr[i][j], arr[j][i]] = [arr[j][i], arr[i][j]];
      }
    }
  }
  for (let i = 0; i < arr.length; i++) {
    arr[i].reverse();
  }
  return arr;
}
//逆时针选择90
// n*n m*n 先通过主对角线翻转，然后再整个arr.reverse
function tran(arr) {
  let len1 = arr.length,
    len2 = arr[0].length;
  //凑够n*n
  if (len1 < len2) {
    for (let i = len1; i < len2; i++) {
      arr.push([]);
    }
    for (let i = 0; i < len1; i++) {
      for (let j = i; j < len2; j++) {
        [arr[i][j], arr[j][i]] = [arr[j][i], arr[i][j]];
      }
    }
  } else {
    for (let i = 0; i < len1; i++) {
      for (let j = 0; j < i; j++) {
        [arr[i][j], arr[j][i]] = [arr[j][i], arr[i][j]];
      }
    }
  }
  arr.reverse();
  return arr;
}

//水平翻转
function tran(arr) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    arr[i].reverse();
  }
  return arr;
}
//垂直翻转
function tran(arr) {
  return arr.reverse();
}
```

19. 手写 bind 函数

```js
//function a(){ console.log(this.xxx) };
//a.bind(obj,1,2)
Function.prototype.bind = function (obj) {
  var args = Array.prototype.slice.call(arguments, 1);
  var fn = this;
  return function () {
    var params = Arrat.prototype.slice.call(arguments);
    fn.apply(obj, args.concat(params));
    //也可以用扩展运算符，ES6
  };
};
```

20. 手写 emit 手写 on

```js
let obj = {};
const $on = (name, fn) => {
  if (!obj[name]) {
    obj[name] = [];
  }
  obj[name].push(fn);
};
const $emit = (name, val) => {
  if (obj[name]) {
    obj[name].map((fn) => {
      fn(val);
    });
  }
};
```

21. 深度遍历 DOM 节点

```js
var arr = [];
function DFS(root) {
  if (root) return;
  if (root.children.length == 0) {
    //没有孩子
    arr.push(root);
    return;
  }
  arr.push(root);
  for (var i = 0; i < root.children.length; i++) {
    DFS(root.children[i]);
  }
}

//深度优先非递归
function traversalDFSDOM(rootDom) {
  if (!rootDom) return;
  var stack = [];
  var node = rootDom;
  while (node != null) {
    arr.push(node);
    if (node.children.length >= 0) {
      for (let i = node.children.length - 1; i >= 0; i--)
        stack.unshift(node.children[i]);
    }
    node = stack.shift();
  }
}
```

22. 复杂数组去重

```js
//[{id:2,name:'asd'},{id:3,name:'222'},{id:2,name:'asd'}]
// 整个对象不能相同；
function demo(arr) {
  let obj = {};
  return arr.filter((item, index) => {
    return obj.hasOwnProperty(JSON.stringify(item))
      ? false
      : (obj[JSON.stringify(item)] = true);
  });
}
// 通过id去过滤
function demo2(arr) {
  let obj = {};
  return arr.reduce((pre, cur) => {
    obj[cur.id] ? "" : (obj[cur.id] = true && pre.push(cur));
    return pre;
  }, []);
}
console.log(
  demo([
    { id: 2, name: "asd" },
    { id: 3, name: "222" },
    { id: 2, name: "asd" },
  ])
);
```

23. 发布订阅模式

```js
let eventEmitter = {};
eventEmitter.list = {};
eventEmitter.on = function (event, fn) {
  let _this = this;
  (_this.list[event] || (_this.list[event] = [])).push(fn);
  return _this;
};
eventEmitter.emit = function () {
  let _this = this;
  let event = [].shift.call(arguments),
    fns = [...this.list[event]];
  if (!fns || fns.length === 0) {
    return false;
  }
  fns.forEach((fn) => {
    fn.apply(_this, arguments);
  });
  return _this;
};

eventEmitter.on("test", (content) => {
  console.log("订阅1" + content);
});
eventEmitter.on("test", (content) => {
  console.log("订阅2" + content);
});
eventEmitter.emit("test", "这是发布");
```

24. 深拷贝
    三要素

- 递归解决多重对象

- 对象分类型讨论：Date、正则等

  - typeof 对于 Date 和正则也会返回 object

- 解决循环引用

```js
function isObject(obj) {
  return (
    Object.prototype.toString.call(obj) === "[object Object]" ||
    Object.prototype.toString.call(obj) === "[object Array]"
  );
}
function deep(source, hash = new WeakMap()) {
  if (!isObject(source)) return source;
  //拷贝过就返回
  if (hash.has(source)) return hash.get(source);
  //初始化
  let res = Array.isArray(source) ? [] : {};
  hash.set(source, res);
  for (let key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (isObject(source[key])) {
        res[key] = deep(source[key], hash);
      } else {
        res[key] = source[key];
      }
    }
  }
  return res;
}
```

25. 链表翻转

- 双指针，中间加个第三个来让两个指针过度。

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
  let curNode = head;
  if (!head) {
    return head;
  }
  let nextNode = head.next;
  //翻转开始
  curNode.next = null;
  let thirdNode;
  while (nextNode) {
    thirdNode = nextNode.next;
    nextNode.next = curNode;
    curNode = nextNode;
    nextNode = thirdNode;
  }
  return curNode;
};
```

26. js 实现链表

```js
class Node {
  constructor(data) {
    this.data = data; // 节点的数据域
    this.prev = null; // 节点的指针域
    this.next = null; // 节点的指针域
  }
}
class SingleList {
  constructor() {
    this.size = 0;
    this.head = new Node("head");
    this.currNode = "";
  }
  // 在单链表中寻找item元素
  find(item) {
    let currNode = this.head;

    while (currNode && currNode.data !== item) {
      currNode = currNode.next;
    }

    return currNode;
  }
  findLast() {
    let currNode = this.head;

    while (currNode.next) {
      currNode = currNode.next;
    }

    return currNode;
  }
  // 在尾部添加元素
  append(element) {
    let newNode = new Node(element);
    let currNode = this.findLast();

    currNode.next = newNode;
    this.size++;
  }
  // 向单链表中插入元素
  insert(item, element) {
    let itemNode = this.find(item);

    if (!itemNode) {
      // 如果item元素不存在
      return;
    }

    let newNode = new Node(element);

    newNode.next = itemNode.next; // 若currNode为最后一个节点，则currNode.next为空
    itemNode.next = newNode;

    this.size++;
  }
  // 在单链表中删除一个节点
  remove(item) {
    if (!this.find(item)) {
      // item元素在单链表中不存在时
      return;
    }

    // 企图删除头结点
    if (item === "head") {
      if (!this.isEmpty()) {
        return;
      } else {
        this.head.next = null;
        return;
      }
    }

    let currNode = this.head;

    while (currNode.next.data !== item) {
      // 企图删除不存在的节点
      if (!currNode.next) {
        return;
      }
      currNode = currNode.next;
    }

    currNode.next = currNode.next.next;
    this.size--;
  }
}
```



# 富途算法

1. 链接：https://www.nowcoder.com/questionTerminal/8397609ba7054da382c4599d42e494f3
   来源：牛客网

现定义数组单调和为所有元素 i 的 f(i)值之和。这里的 f(i)函数定义为元素 i 左边(不包括其自身)小于等于它的数字之和。请设计一个高效算法，计算数组的单调和。

给定一个数组 A 同时给定数组的大小 n，请返回数组的单调和。保证数组大小小于等于 500，同时保证单调和不会超过 int 范围。

测试样例：
[1,3,5,2,4,6],6
返回：27

```js
function demo(arr, len) {
  let count = 0;
  for (let i = 1; i < len; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (arr[j] <= arr[i]) {
        count += arr[j];
      }
    }
  }
  return count;
}
```

2. 输入一个非负整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最大的一个。
   例：[30,1]
   输出：301

```js
var minNumber = function (nums) {
  return nums.sort((a, b) => "" + b + a - ("" + a + b)).join("");
};
```

3. 斐波那契

```js
function f(n) {
  if (n == 1 || n == 2) {
    return 1;
  }
  return f(n - 1) + f(n - 2);
}
//缓存功能
function f(n, map = {}) {
  if (n == 1 || n == 2) {
    map[n] = 1;
    return 1;
  }
  if (!map[n]) {
    map[n] = f(n - 1, map) + f(n - 2, map);
  }
  return map[n];
}
```

4. 给定一个字符串 str，只会出现{}()[]这六种字符，请实现一个函数 isMatch(str)判断这个字符串中的括号是否是匹配的。

```js
//栈
function isMatch(str) {
  let stack = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] == "(" || str[i] == "{" || str[i] == "[") {
      stack.push(str[i]);
    } else if (str[i] == ")" || str[i] == "}" || str[i] == "]") {
      let target = stack[stack.length - 1];
      if (
        (target == "(" && str[i] == ")") ||
        (target == "{" && str[i] == "}") ||
        (target == "[" && str[i] == "]")
      ) {
        stack.pop();
      } else {
        return false;
      }
    }
  }
  return !stack.length;
}
```

5. 实现一个函数，返回一个 n,m 的随机数。
   Math.random，要注意的是 Math.random 返回的是 0 到 1 之间的随机数，包括 0 但是不包括 1。
