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
  HEALTH_NO_CHECK
} from '../constant/event';

import { CLIENT_STATUS_ON } from '../constant/clientStatus';
import { setClientStatus } from '../status/status';
import { sendCommand } from './command';
import { CONFIG_KEY_PORT } from '../constant/configStatus';
import { getInitConfig, basicURL } from '../config/index';
import { setWebSocket } from './socket';
import { CONFIG_PORT } from '../constant/apiConstant';
import { CONFIG_KEY_HEART_BEAT_CHECK_TIMEOUT, CONFIG_KEY_DEFAULT_CMD, CONFIG_KEY_DEFAULT_PARAM } from '../constant/configStatus';

/**
 * 端口的心跳检测
 */
function healthCheck(port) {
    emitter.once(HEALTH_NO_CHECK, () => {
        const url = basicURL(port);
        let ws = null;
        let isHeartflag = false;
        let isReconnect = false;
        function initWs() {
            ws = new WebSocket(url);

            ws.onopen = () => {
                isHeartflag = true;
                setWebSocket({ socket: ws, isHeartflag });
                emitter.emit(HEALTH_CHECK_SUCCESS);
            };

            ws.onerror = () => {
                if (isReconnect) {
                    return;
                }
                isReconnect = true;
                setTimeout(() => {
                    initWs();
                    isReconnect = false;
                }, getInitConfig(CONFIG_KEY_HEART_BEAT_CHECK_TIMEOUT) || 1000);
            };
        }
        initWs();
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

    emitter.once(HEALTH_CHECK_SUCCESS, () => {
        setClientStatus(CLIENT_STATUS_ON);
        const cmd = getInitConfig(CONFIG_KEY_DEFAULT_CMD);
        const param = getInitConfig(CONFIG_KEY_DEFAULT_PARAM);
        sendCommand(cmd, param);
        emitter.emit(NONE_CLIENT_STARTED);
        emitter.removeAllListeners(HEALTH_NO_CHECK);
    });

    let ports = getInitConfig(CONFIG_KEY_PORT) || CONFIG_PORT;
    ports.forEach(port => {
        healthCheck(port);
    });
}

export { startWebSocket };