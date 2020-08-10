<template>
  <el-form :model="ruleForm" :rules="rules" ref="form" class="forms">
      <el-form-item prop="username">
        <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input show-password v-model="ruleForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <div class="login-buttons">
        <span class="left_span" @click="handleRegister">注册账号</span>
        <span class="right_span" @click="handleChangePassword">忘记密码</span>
      </div>
      <el-form-item>
        <el-button class="sunbit-size" type="primary" @click="onSubmit">登陆</el-button>
      </el-form-item>
    </el-form>
</template>
<script>
import { getStore } from '@/utils/storage';
import { login } from '@/api/public';
import { checkResponse, createRoute } from '@/utils/utils';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, message: '用户名最少 5 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    };
  },
  methods: {
    ...mapActions(['SET_LOGIN', 'SET_MENU']),

    //注册
    handleRegister(){
      this.$router.push('/logins/register')
    },

    //修改密码
    handleChangePassword(){
      this.$router.push('/logins/reset')
    },

    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          login(this.ruleForm).then(res => {
            if (!checkResponse(res, true)) {
              return false;
            }
            this.SET_LOGIN(res.data);
            this.SET_MENU().then(() => {
              this.loginSuccess();
            });
            //将登录后需要显示的菜单在此处做处理
            /**
             * 菜单处理
             * 调接口获取菜单，store中缓存菜单，router中判断缓存菜单存在直接动态添加到路由
             * 第一次登录的时候需要在此处动态添加菜单路由
             */
            
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //登陆成功
    loginSuccess(){
      let menu = getStore('menu', true);
      if (menu) {
        let routes = this.$router.options.routes,
            routerChildren = routes[0].children,
            hasRouter = routerChildren.some(item => {
              return item.meta ? item.meta.id == menu[0].id : false;
            });
        if(hasRouter){
          this.$router.replace('/');
          return;
        }
        menu.forEach(function (v) {
          routerChildren.push(createRoute(v));
            if (v.children) {
                v.children.forEach(function (v2) {
                  routerChildren.push(createRoute(v2));
                    if (v2.children) {
                        v2.children.forEach(function (v3) {
                          routerChildren.push(createRoute(v3));
                        });
                    }
                });
            }
        });
        this.$router.selfaddRoutes(routes);
        this.$router.replace('/');
      }
    }
  }
};
</script>

<style scoped lang="scss">
  .forms{
    color: $main-color;
    .login-buttons{
      margin-bottom: 20px;
      overflow: hidden;
      span{
        cursor: pointer;
      }
      .left_span{
        float: left;
        margin-left: 5px;
      }
      .right_span{
        margin-right: 5px;
        float: right;
      }
    }
    .sunbit-size{
      width: 100%;
    }
  }  
</style>