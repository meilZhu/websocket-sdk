/*
 * @file: 健康检查接口的服务
 * @Date: 2020-09-07 16:57:57
 * @author: manyao.zhu
 */

import emitter from './dispatch';
import {
  EVENT_TYPE_LOG,
  HEALTH_CHECK_SUCCESS,
  NONE_CLIENT_STARTED,
  STATUS_CHANGE,
  HEALTH_NO_CHECK,
  CHECK_VERSION,
  COMPARE_VERSION,
  EVENT_TYPE_RESULT
} from '../constant/event';

import { CLIENT_STATUS_ON, CLIENT_STATUS_OFF } from '../constant/clientStatus';
import { setClientStatus } from '../status/status';
import { sendCommand } from './command';
import { CONFIG_KEY_PORT } from '../constant/configStatus';
import { getInitConfig, basicURL } from '../config/index';
import { getWebSocket, setWebSocket } from './socket';
import { CONFIG_PORT } from '../constant/apiConstant';
import { CONFIG_KEY_HEART_BEAT_CHECK_TIMEOUT, CONFIG_KEY_DEFAULT_CMD, CONFIG_KEY_DEFAULT_PARAM, CONFIG_KEY_HEART_BEAT_MAX_TIMES, CONFIG_KEY_HEART_BEAT_PARAM } from '../constant/configStatus';
import { popCommand } from '../status/status';

let hearBeatTimeout;

/**
 * websocket的心跳检测
 */
function heartBeatCheckStart() {
    const websocket = getWebSocket();
    hearBeatTimeout = setTimeout(() => {
        emitter.emit(STATUS_CHANGE, {
            type: EVENT_TYPE_LOG,
            status: 'HEART_BEAT_CHECK',
            message: '心跳检测'
        });
        const params = getInitConfig(CONFIG_KEY_HEART_BEAT_PARAM);
        websocket.socket.send(JSON.stringify(params));
    }, getInitConfig(CONFIG_KEY_HEART_BEAT_CHECK_TIMEOUT) || 1000);
}

/**
 * 心跳检测重置
 */
function resetHeartBeatCheck() {
    clearTimeout(hearBeatTimeout);
    heartBeatCheckStart();
}


/**
 * 端口的心跳检测
 */
function healthCheck(ports) {
    emitter.once(HEALTH_NO_CHECK, () => {
        let index = 0;
        let pollingTimes = 0;
        const len = ports.length;
        let ws = null;
        let isHeartflag = false;
        let isReconnect = false;
        function initWs(i) {
            const url = basicURL(ports[i]);
            ws = new WebSocket(url);

            ws.onopen = () => {
                isHeartflag = true;
                setWebSocket({ socket: ws, isHeartflag });
                emitter.emit(HEALTH_CHECK_SUCCESS);
                heartBeatCheckStart();
            };

            ws.onclose = () => {
                if (isReconnect) {
                    return;
                }
                setClientStatus(CLIENT_STATUS_OFF);
                emitter.emit(STATUS_CHANGE, {
                    type: EVENT_TYPE_LOG,
                    status: 'STOP_CLIENT_STATUS',
                    message: '启动' + ports[i] + '端口下的客户端没有成功，可能是客户端没有启动 或 端口被占用'
                });
                isReconnect = true;

                index++;
                pollingTimes++;
                // 档首次三个端口都没有注册成功，调用启动浏览器事件
                if (pollingTimes / len === 1) {
                    emitter.emit(NONE_CLIENT_STARTED);
                }
                // 心跳检测的最大次数
                if (Math.floor(pollingTimes / len) < (getInitConfig(CONFIG_KEY_HEART_BEAT_MAX_TIMES) || 100)) {
                    if (index >= len) {
                        index = 0;
                    }
                    initWs(index);
                    isReconnect = false;
                }
            };

            ws.onmessage = (res) => {
                emitter.emit(STATUS_CHANGE, {
                    type: EVENT_TYPE_RESULT,
                    status: 'SUCCESS',
                    message: '发送成功',
                    data: JSON.parse(res.data)
                });

                if (JSON.parse(res.data).status && JSON.parse(res.data).code === 'APP_VERSION') {
                    emitter.emit(COMPARE_VERSION, JSON.parse(res.data).data);
                }
                popCommand();
                resetHeartBeatCheck();
            };
        }
        initWs(index);
    });
    emitter.emit(HEALTH_NO_CHECK);
}

/**
 * websocket 的启动
 */
function startWebSocket() {
    emitter.emit(STATUS_CHANGE, {
        type: EVENT_TYPE_LOG,
        status: 'START_CHECK_CLIENT_STATUS',
        message: '准备检测客户端状态...'
    });

    emitter.on(HEALTH_CHECK_SUCCESS, () => {
        setClientStatus(CLIENT_STATUS_ON);
        const params = {
            cmd: getInitConfig(CONFIG_KEY_DEFAULT_CMD),
            biaData: JSON.stringify(getInitConfig(CONFIG_KEY_DEFAULT_PARAM))
        };
        if (params.cmd && params.cmd.replace(/(^\s*)|(\s*$)/g, '')) {
            sendCommand(params);
        }
        emitter.emit(CHECK_VERSION);
        emitter.removeAllListeners(HEALTH_NO_CHECK);
    });

    let ports = getInitConfig(CONFIG_KEY_PORT) || CONFIG_PORT;
    // 检测心跳的频率
    healthCheck(ports);
}

export { startWebSocket };