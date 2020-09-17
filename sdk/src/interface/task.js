/*
 * @file: 任务
 * @Date: 2020-09-08 10:11:02
 * @author: manyao.zhu
 */

import { getInitConfig } from '../config/index';// taskListUrl
import { setClientStatus } from '../status/status';
import { CLIENT_STATUS_INITIAL } from '../constant/clientStatus';
import { STATUS_CHANGE, EVENT_TYPE_LOG } from '../constant/event';
import { CONFIG_KEY_AGENT_ADMIN_URL } from '../constant/configStatus';
import emitter from '../core/dispatch';

function fetchAgentAdminAction() {
    emitter.emit(STATUS_CHANGE, {
        type: EVENT_TYPE_LOG,
        status: 'FETCH_AGENT_ADMIN_ADDRESS',
        message: '正在获取AGENT_ADMIN地址...'
    });
    let agentAdminUrl = getInitConfig(CONFIG_KEY_AGENT_ADMIN_URL);
    if (agentAdminUrl == null) {
        emitter.emit(STATUS_CHANGE, {
            type: EVENT_TYPE_LOG,
            status: 'AGENT_ADMIN_ADDRESS_LOAD_ERROR',
            message: '启动参数中没有找到[agentAdminUrl]，请参考用户手册。'
        });
    } else {
        emitter.emit(STATUS_CHANGE, {
            type: EVENT_TYPE_LOG,
            status: 'AGENT_ADMIN_ADDRESS_LOAD_SUECCESS',
            message: 'AGENT_ADMIN接口地址已获取，地址（' + agentAdminUrl + ');如果地址不正确，参考用户手册。'
        });
    }
    return agentAdminUrl;
}

// 启动客户端
function start() {
    const agentAdminUrl = fetchAgentAdminAction();
    if (agentAdminUrl) {
        window.open(agentAdminUrl);

        setClientStatus(CLIENT_STATUS_INITIAL);
        // 启动agentAdmin 消息
        emitter.emit(STATUS_CHANGE, {
            type: EVENT_TYPE_LOG,
            status: 'OPEN_AGENT_AGMIN',
            message: '正在启动AGENT_ADMIN， 如果没有启动成功， 请参考用户手册配置自动启动或手动启动。'
        });
    }
}

export { start };