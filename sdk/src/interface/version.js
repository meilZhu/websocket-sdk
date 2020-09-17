/*
 * @file: 版本控制
 * @Date: 2020-09-16 13:46:49
 * @author: manyao.zhu
 */
import { getInitConfig } from '../config';
import { CONFIG_KEY_APP_VERSION, CONFIG_KEY_APP_VERSION_URL, CONFIG_KEY_APP_VERSION_CMD } from '../constant/configStatus';
import { STATUS_CHANGE, EVENT_TYPE_CHECK, EVENT_TYPE_LOG, COMPARE_VERSION } from '../constant/event';
import { sendCommand } from '../core/command';
import emitter from '../core/dispatch';

// 获取版本
function getVersion() {
    const cmd = getInitConfig(CONFIG_KEY_APP_VERSION_CMD) || 'appService.version';
    const param = {};
    sendCommand(cmd, param);
}

// 获取加载version地址
function getDownVersionUrl() {
    emitter.emit(STATUS_CHANGE, {
        type: EVENT_TYPE_LOG,
        status: 'FETCH_NEW_VERSION_ADDRESS',
        message: '正在获取AGENT_ADMIN新版本地址...'
    });
    let newVersionUrl = getInitConfig(CONFIG_KEY_APP_VERSION_URL);
    if (newVersionUrl == null) {
        emitter.emit(STATUS_CHANGE, {
            type: EVENT_TYPE_LOG,
            status: 'NEW_VERSION_ADDRESS_LOAD_ERROR',
            message: '启动参数中没有找到[agentAdminUrl]，请参考用户手册。'
        });
    } else {
        emitter.emit(STATUS_CHANGE, {
            type: EVENT_TYPE_LOG,
            status: 'NEW_VERSION_ADDRESS_LOAD_SUECCESS',
            message: 'AGENT_ADMIN 新版本接口地址已获取，地址（' + newVersionUrl + ');如果地址不正确，参考用户手册。'
        });
    }
    return newVersionUrl;
}

export function checkVersion() {
    const version = getInitConfig(CONFIG_KEY_APP_VERSION);
    getVersion();

    emitter.once(COMPARE_VERSION, (v) => {
        if (version !== v) {
            emitter.emit(STATUS_CHANGE, {
                type: EVENT_TYPE_CHECK,
                status: 'VERSION_INCONSISTENCY',
                message: '检测到 AGENT_ADMIN 版本不一致，是否选择下载新的版本'
            });
        }
    });
}

export function downloadNewVersion() {
    const address = getDownVersionUrl();
    if (address) {
        location.href = address;
        // 正在下载新版本
        emitter.emit(STATUS_CHANGE, {
            type: EVENT_TYPE_LOG,
            status: 'DOWNLOAD_NEW_VERSION',
            message: '正在下载AGENT_ADMIN 的新版本， 如果没有下载成功， 请参考用户手册配置。'
        });
    }
}