/*
 * @file: 健康检查
 * @Date: 2020-09-08 10:01:15
 * @author: manyao.zhu
 */
import emitter from '../core/dispatch';
import { CLIENT_STATUS_OFF, CLIENT_STATUS_ON } from '../constant/clientStatus';
import { getInitConfig } from '../config/index';
import {
    EVENT_TYPE_LOG,
    NONE_CLIENT_STARTED,
    STATUS_CHANGE,
    CHECK_VERSION
} from '../constant/event';
import { getClientStatus } from '../status/status';
import { CONFIG_KEY_AUTO_START, CONFIG_KEY_AUTO_CHECK_APP_VERSION } from '../constant/configStatus';
import { start } from './task';
import { startWebSocket } from '../core/health';
import { sendCommand } from '../core/command';
import { checkVersion } from './version';


function startCheck() {
    // 注册一次行事件， 如果没有检测到client 启动， 则启动client 根据配置来确定
    emitter.once(NONE_CLIENT_STARTED, () => {
        // 启动client
        if (getInitConfig(CONFIG_KEY_AUTO_START)) {
            emitter.emit(STATUS_CHANGE, {
                type: EVENT_TYPE_LOG,
                status: 'NONE_CLIENT_STARTED',
                message: '连接客户端未成功，准备启动（或安装）客户端...'
            });
            start();
        }
    });

    emitter.once(CHECK_VERSION, () => {
        // 是否自动检测客户端版本
        if (getInitConfig(CONFIG_KEY_AUTO_CHECK_APP_VERSION)) {
            emitter.emit(STATUS_CHANGE, {
                type: EVENT_TYPE_LOG,
                status: 'CHECK_VERSION',
                message: '正在检测客户端版本'
            });
            checkVersion();
        }
    });
    // 启动websocket
    startWebSocket();
}

/**
 * 检测客户端
 */
export function checkClient() {
    let stat = getClientStatus();
    if (stat === CLIENT_STATUS_ON) {
        return true;
    } else if (stat === CLIENT_STATUS_OFF) {
        startCheck();
    }
    return false;
}

/**
 * 发送指令
 * @param params 参数
 */
export function execCommand(params) {
    return sendCommand(params);
}