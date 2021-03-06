/*
 * @file: 项目运行的入口
 * @Date: 2020-09-07 15:12:16
 * @author: manyao.zhu
 */
import emitter from './src/core/dispatch';
import { STATUS_CHANGE } from './src/constant/event';

import { disconnect as disconnectTask, exit as quitTask } from './src/interface/exit';
import { setInitConfig } from './src/config/index';
import { checkClient, execCommand } from './src/interface/client';
import { downloadNewVersion } from './src/interface/version';

/**
 * 初始化
 * @param status StatusCallback
 */
export function init(status, config) {
    // 移除所有的监听 事件, 避免重复添加事件监听器
    emitter.removeAllListeners();
    // 注册事件 监听器，监听整个过程的状态变化
    emitter.on(STATUS_CHANGE, message => {
        status(message);
    });
    setInitConfig(config);
    checkClient();
}

/**
 * 发送指令
 * @param params 参数
 */
export function exec(params) {
    return execCommand(params);
}

/**
 * 退出通信模式
 */
export function disconnect() {
    disconnectTask();
}

/**
 * manual exit client
 * @param force 强制退出
 */
export function exit() {
    quitTask();
}

/**
 * 下载新版本
 */
export function download() {
    downloadNewVersion();
}