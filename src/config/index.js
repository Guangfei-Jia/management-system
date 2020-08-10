// 一些全局的config配置
const modeUrlObj = {
  // 生产环境
  production: {
    baseURL: 'http://192.168.1.136:9091/pro/',
    authBaseURL: ''
  },
  // 开发环境
  development: {
    baseURL: 'http://192.168.1.174:8080/dev',
    // baseURL: 'http://192.168.1.101:8080/dev',
    authBaseURL: ''
  },
  // 测试环境
  test: {
    baseURL: 'http://192.168.1.136:8080/test/',
    authBaseURL: ''
  }
};
export default modeUrlObj[process.env.NODE_ENV];
