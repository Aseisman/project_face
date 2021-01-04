1. Grpc: 

- RPC: 框架提供了一套机制（类似http协议）使得应用程序间可以进行通信，遵从server/client模型，底层是Http2.0协议，而restful api不一定是http2.0
  - 1： 通过proto通信，定义接口等，有更加严格的接口约束条件；安全性（接口约束）
  - 2： 二进制编码，减少传输的数据量 高性能
  - 3： 支持流式通信（streaming模式），而restful api似乎很少这么用，视频流等都会用专门的协议HLS，RTMP等。
  （http2.0的知识点）

2. http协议：

- http协议分为1.0 1.1 和2.0

- http2和http1的区别：
  - 多路复用：允许单一的HTTP2连接同时发起多重请求-响应消息。（可以设置优先级）
  - 二进制编码：HTTP2.0讲所有的传输信息分割为更小的信息或帧，然后对他们进行二进制编码的首部压缩。
  - 首部压缩：HTTP1.1的请求和响应都是由状态行、请求/响应头部、消息主体三部分组成，状态行和头部却没有经过任何压缩。而2.0支持对header进行压缩；
  - 服务器推送（server push）,同SPDY一样，http2.0也具有server push 功能。

- http1.0和1.1的区别：
  - 长连接：http1.1默认开启长连接
  - 节约带宽：http1.1支持只发送header信息，不带任何body信息，服务器觉得有权限：返回100；无权限返回401；有权限后再发body信息。
  - host域：http1.0认为每台服务器只有一个唯一的ip，因此请求信息中没有传递hostname，即不存在我们的host域；但是我们现在一台服务器可以有多个虚拟主机，共享一个ip地址，所以1.1在请求消息中添加了host域，没给会报400
  - 缓存处理：1.0有if-modify-since（last-modify）、expire；1.1添加了E-tag中的if-match和if-not-match，cache-control等。
  - 1.1新增了24个错误状态响应码。

- http缓存
  - 强缓存：判断是否有Cache-controller、Expire（no-cache\no-store）、过没过期；
  - 协商缓存：与服务器端对比资源是否进行更新，没更新返回304，有更新200，（E-tag，Last-Modified）
  -  Cache-controll(http1.1):no-cache、no-store、max-age（xx秒）、public/private、must-revalidate
  - Expires(http1.0):时间点
  - E-Tag(http1.1):If-Not-Match（hash算法）
  - Last-Modified(http1.0):If-Modified-Since:时间点

3. 