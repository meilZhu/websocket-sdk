/*
 * @file: 任务
 * @Date: 2020-09-08 10:11:02
 * @author: manyao.zhu
 */

import { getInitConfig } from '../config/index';// taskListUrl
import { setClientStatus } from '../status/status';
import { CLIENT_STATUS_INITIAL } from '../constant/clientStatus';
import { STATUS_CHANGE, EVENT_TYPE_LOG } from '../constant/event';
import { CONFIG_KEY_JNLP_URL } from '../constant/configStatus';
import emitter from '../core/dispatch';

function fetchJNLPAction() {
    emitter.emit(STATUS_CHANGE, {
        type: EVENT_TYPE_LOG,
        status: 'FETCH_JNLP_ADDRESS',
        message: '正在获取JNLP地址...'
    });
    let jnlpUrl = getInitConfig(CONFIG_KEY_JNLP_URL);
    if (jnlpUrl == null) {
        emitter.emit(STATUS_CHANGE, {
            type: EVENT_TYPE_LOG,
            status: 'JNLP_ADDRESS_LOAD_ERROR',
            message: '启动参数中没有找到[jnlpUrl]，请参考用户手册。'
        });
    } else {
        emitter.emit(STATUS_CHANGE, {
            type: EVENT_TYPE_LOG,
            status: 'JNLP_ADDRESS_LOAD_SUECCESS',
            message: 'JNLP接口地址已获取，地址（' + jnlpUrl + ');如果地址不正确，参考用户手册。'
        });
    }
    return jnlpUrl;
}

function createTaskMessage(task) {
    const { status, progress } = task;
    switch (status) {
    case 'WAITING':
        return {
            status: 'TRANSFER_TASK_WAITING_IN_QUEUE',
            message: '正在等待与服务器建立连接。',
            data: task
        };
    case 'CONNECTED':
        return {
            status: 'TRANSFER_TASK_CONNECTED_WITH_SERVE',
            message: '与服务器建立连接成功。',
            data: task
        };
    case 'CONNECT_FAILED':
        return {
            status: 'TRANSFER_TASK_CONNECT_FAILED',
            message: '与服务器连接创建失败。',
            data: task
        };
    case 'UPLOADING':
        return {
            status: 'TRANSFER_TASK_IN_PROGRESS',
            message: '文件正在上传...，当前进度' + progress + '%。',
            data: task
        };
    case 'DOWNLOADING':
        return {
            status: 'TRANSFER_TASK_IN_PROGRESS',
            message: '文件正在下载...，当前进度' + progress + '%。',
            data: task
        };
    case 'PAUSED':
        return {
            status: 'TRANSFER_TASK_PAUSED',
            message: '传输任务暂停中...',
            data: task
        };
    case 'COMPLETE':
        return {
            status: 'TRANSFER_TASK_COMPLETE',
            message: '传输任务已完成。',
            data: task
        };
    case 'DELETED':
        return {
            status: 'TRANSFER_TASK_DELETED',
            message: '传输任务已删除。',
            data: task
        };
    case 'NOTIFIED_FAILED':
        return {
            status: 'TRANSFER_TASK_NOTIFIED_FAILED',
            message: '传输任务完成，通知第三方应用失败',
            data: task
        };
    case 'NOT_FOUND':
        return {
            status: 'TRANSFER_TASK_FILE_NOT_FOUNT',
            message: '请求传输的文件没有找到',
            data: task
        };
    case 'SYSTEM_ERROR':
        return {
            status: 'TRANSFER_TASK_ERROR',
            message: '传输任务出现系统错误',
            data: task
        };
    default:
        return {
            status: 'TRANSFER_TASK_UNKNOW',
            message: '未知的状态.',
            data: task
        };
    }
}

// 启动客户端
function start() {
    const jnlpUrl = fetchJNLPAction();
    if (jnlpUrl) {
        location.href = jnlpUrl;

        setClientStatus(CLIENT_STATUS_INITIAL);
        // 启动JNLP 消息
        emitter.emit(STATUS_CHANGE, {
            type: EVENT_TYPE_LOG,
            status: 'DOWNLOAD_JNLP_FILE',
            message: '正在下载JNLP文件， 如果没有自动启动， 请参考用户手册配置自动启动或手动启动。'
        });
    }
}

/**
 * 请求任务
 */

// function queryTask() {
    // axios.get(taskListUrl()).then(response => {
    //     response.data.forEach(task => {
    //         emitter.emit(STATUS_CHANGE, createTaskMessage(task));
    //     });
    // }).catch(() => {
    //     emitter.emit(STATUS_CHANGE, {
    //         status: 'FETCH_STATUS_FAIL',
    //         message: '获取状态信息失败'
    //     });
    //     return true;
    // }).then(() => {
    //     queryTimer = setTimeout(() => {
    //         queryTask();
    //     }, FETCH_STATUS_RATE);
    // });
// }

// function stopFetchStatus() {
//     queryTask();
// }

export { start, createTaskMessage };