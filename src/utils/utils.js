import { Message } from 'element-ui';
export { checkResponse, isTokenExpired, isTokenWillExpired, message };
/**
 * 判断客户端返回状态
 * @param res
 * @param show_msg
 * @returns {boolean}
 */
const checkResponse = (res, show_msg = false) => {
  const { code, message: msg } = res;
  if (code !== 0) {
    message('error', msg)
    return false;
  } else {
    if (show_msg) {
      message('success', msg)
    }
    return true;
  }
};

/**
 * 判断token是否已经过期
 * @param timeStamp
 * @returns {boolean}
 */
const isTokenExpired = timeStamp => {
  let expiredTime = timeStamp;
  /*获取本地时间*/
  let nowTime = new Date().getTime() / 1000;
  /*token过期时间小于当前时间，证明已经过期*/
  return expiredTime < nowTime;
};

/**
 * 判断token是否即将过期
 * @param timeStamp
 * @returns {boolean}
 */
const isTokenWillExpired = timeStamp => {
  let expiredTime = timeStamp;
  /*获取本地时间*/
  let nowTime = new Date().getTime() / 1000;
  /*如果 < 10分钟，则说明即将过期*/
  return expiredTime - nowTime < 60 * 10;
};

/**
 * 创建路由对象
 * @returns {boolean}
 * @param data
 */
export const createRoute = (data) => {
  let path = data.router_url;
  if (data.router_param) {
      path += '/' + data.param;
  }
  let filePath = data.router_url;
  return {
      name: data.name,
      path: path,
      component: resolve => require(['@/views' + filePath], resolve),
      meta: {model: data.parent_id, info: data, id: data.id},
  };
};

const message = ( type, msg ) => {
  return Message({
    type: type,
    message: msg
  })
}