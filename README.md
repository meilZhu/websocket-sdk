# @zmy/websocket-sdk

web js插件以及demo， 通过定义一套通信协议及机制，实现web端和本地程序之间的 websocket协议的通信

## how to install

#### For JQuery and original js

Download js lib from npmjs

```
npm i @zmy/websocket-sdk
```

add js to html


```
<script type="text/javascript" src="/webstart-sdk.min.js"></script>
```

#### For TypeScript such as Angular Vue React

install

```
npm i @zmy/websocket-sdk --save-dev
```

Import

```
import * as WebSocketSdk from '@zmy/websocket-sdk';
```

## 协议规范
- 通过websocket通信，通信端口：36666，36667，36668。为防止端口冲突，定义三个端口，只要有一个端口正常，即锁定为该端口。
- 通信发起方与接收方：实时通信，在建立连接之后，双方可以在任意时刻，相互推送信息

 
## SDK

#### 初始化

```
WebSocketSdk.init(eventHandler, config);
```

##### eventHandler(event)

全局的事件处理回调

- event.type：
    - [ ] log：全局日志
    - [ ] clientStatus：本地程序状态变化
    - [ ] result：执行全局结果
    - [ ] check：检测结果
- event.message 消息
- event.data 数据
- event.status 状态码

```
function eventHandler(event) {
    if (event.type === 'log') {
      // 日志
    } else if (event.type === 'clientStatus') {
      // 本地程序状态变化
      // event.status:(OFF,ON,INITIAL)
    } else if (event.type === 'result') {
      // 执行全局结果
    } else if (event.type === 'check') {
      // 检测结果执行
    }
}
```
<!--else if (event.type === 'push') {-->
<!--    // 客户端主动推送-->
<!--}   -->
##### config 启动配置

```
{
  // 是否自动启动（针对JNLP方式启动的客户端）,当需要通过Web启动JAVA程序时，需要将autoStart配置为true,并指定jnlpUrl的地址
  autoStart: true, // Optional
  agentAdminUrl: 'pcp://36666/', // Optional
  // health接口超时时间，默认1000毫秒
  heartBeatCheckTimeout: 1000, // Optional since V0.3.0
  port: [36666, 36667, 36668], // Default port Optional since V0.3.0
  // 启动后默认调用的一次数据接口（cmd指令）
  defalutCmd: 'statusService.register',
  // 启动后默认调用一次数据的参数（params）
  defaultParam: {"clientType":"C"},
  // 最大心跳检测次数
  heartBeatMaxTimes: 100,
  // 客户端版本
  appVersion: '1.2.2',
  // 下载客户端最新版本的地址
  appVersionUrl: '',
  // 检测客户端当前版本的cmd
  appVersionCmd: 'appService.version'
}
```

#### 发送命令

```
var cmdId = WebSocketSdk.exec({cmd: 'cmd001', bizData: {
  param1: '123',
  param2: '456'
}, clientTo: {}}, function (res) {
  log('同步返回值' + JSON.stringify(res));
});
if (cmdId !== null) {
  log('执行命令已发送:' + cmdId);
} else {
  log('执行命令发送失败');
}
```

#### 下载最新客户端版本
```
/**
 *下载最新版本的客户端
 */
 webSocketSdk.download();
 ```

#### 退出程序
```
/**
 * 退出程序,向后台发送退出命令
 */
WebSocketSdk.exit();
```

#### 退出通信模式

```
/**
 * 退出通信,不向后台发送退出命令,仅前端退出
 */
WebSocketSdk.disconnect();
```

## CHANGE LOG

##### v0.0.1
创建@zmy/websocket-sdk











