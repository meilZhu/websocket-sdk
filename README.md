# @styleofpicasso/websocket-sdk

web js插件以及demo， 通过定义一套通信协议及机制，实现web端和本地程序之间的 websocket协议的通信

## how to install

#### For JQuery and original js

Download js lib from npmjs

```
npm i @styleofpicasso/websocket-sdk
```

add js to html


```
<script type="text/javascript" src="/webstart-sdk.min.js"></script>
```

#### For TypeScript such as Angular Vue React

install

```
npm i @styleofpicasso/websocket-sdk --save-dev
```

Import

```
import * as WebSocketSdk from '@styleofpicasso/websocket-sdk';
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

##### config 启动配置

```
{
  // 是否自动启动或下载本地客户端（此项为选择配置项，若不配置或为false,将不会自动下载客户端， 以致agentAdminUrl 配置项失效）
  autoStart: true, // Optional
  // 获取最新客户端版本的地址 （当autoStart为 true时， 此项必须要配置，否则会报错）
  agentAdminUrl: 'pcp://36666/',
  // websocket 心跳检测频率时间
  heartBeatCheckTimeout: 1000,
  // 心跳检测需要推送的配置参数
  heartBeatParam: {}, 
  // 自定义的websocketurl地址  (此项可选择配置项， 没有配置的情况下会走sdk中的本地地址，【本地地址会在port配置项的端口中轮询，知道成功】， 若配置了此项，则port项就会失效)
  websocketUrl: '',
  port: [36666, 36667, 36668], // Default port Optional since V0.3.0
  // 启动后默认调用的一次数据接口（此项为可选择配置项：不配置活配置为空这样初始化之后不会注册控制台 [此项和defaultParam匹配使用]）
  defalutCmd: 'statusService.register',
  // 启动后默认调用一次数据的参数（params 此项为可选择配置项）
  defaultParam: {"clientType":"C"},
  // 链接失败后，连续重连最大次数
  reconnectMaxTimes: 100,
  // 是否自动检测客户端版本 (此项为选择配置项； 不配置或为false, 将不会自动检测客户端版本 下面三项配置【appVersion/appVersionUrl/appVersionCmd】将会失效)
  autoCheckAppVersion: true;
  // 客户端版本
  appVersion: '1.2.2',
  // 下载客户端最新版本的地址
  appVersionUrl: '',
  // 检测客户端当前版本的cmd
  appVersionCmd: 'appService.version'
}
```

#### 发送命令

这里的参数需要一个对象
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

##### V0.0.2
添加 websocketUrl配置项 和 autoCheckAppVersion配置项， 支持一般项目中自定义webscoket的url， 和一般接口的数据处理， 以及对心跳检测是的优化

##### v0.0.1
创建@styleofpicasso/websocket-sdk











