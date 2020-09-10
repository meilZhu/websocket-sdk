
/**
 *  检测到了客户端启动成功
 * */
export const HEALTH_CHECK_SUCCESS = 'HEALTH_CHECK_SUCCESS';

/**
 * 每个端口检测都检查了制定次数后仍然没有检查到一次心跳
 */
export const NONE_CLIENT_STARTED = 'NONE_CLIENT_STARTED';

/**
 * 开始检测客户端的启动状况
 */
export const HEALTH_NO_CHECK = 'HEALTH_NO_CHECK';

/**
 * session检查成功事件
 */
export const SESSION_STATUS_LOADED = 'SESSION_STATUS_LOADED';

/**
 * 状态发生变化
 */
export const STATUS_CHANGE = 'STATUS_CHANGE';

/**
 *  客户端已经关闭
 */
export const CLIENT_ALREADY_STOP = 'CLIENT_ALREADY_STOP';

/**
 * 停止health check
 */
export const STOP_HEALTH_CHECK = 'STOP_HEALTH_CHECK';

/**
 * 事件类型：日志
 */
export const EVENT_TYPE_LOG = 'log';

/**
 * 事件类型：状态变化
 */
export const EVENT_TYPE_CLIENT_STATUS_CHANGE = 'clientStatus';

/**
 * 事件类型：执行结果
 */
export const EVENT_TYPE_RESULT = 'result';

/**
 * 事件类型：客户端推送数据
 */
export const EVENT_TYPE_PUSH = 'push';