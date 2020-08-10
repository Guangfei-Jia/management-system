<template>
  <el-form :model="ruleForm" :rules="rules" ref="form" class="forms">
    <el-form-item prop="username">
        <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item prop="email">
        <el-input v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
    </el-form-item>
    <div class="login-buttons">
        <span class="right_span" @click="handleBackLogin">返回登陆页</span>
    </div>
    <el-form-item>
        <el-button class="sunbit-size" type="primary" @click="onSubmit">发送邮件</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { sendMail } from '@/api/public';
import { checkResponse } from '@/utils/utils';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      ruleForm: {
        username: '',
        email: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, message: '用户名最少 5 个字符', trigger: 'blur' }
        ],
        email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
        ]
      }
    };
  },
  methods: {
    
    //发送邮件
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // sendMail(this.ruleForm).then(res => {
          //   if (!checkResponse(res, true)) {
          //     return false;
          //   }
          //   //将登录后需要显示的菜单在此处做处理
          //   /**
          //    * 菜单处理
          //    * 调接口获取菜单，store中缓存菜单，router中判断缓存菜单存在直接动态添加到路由
          //    * 第一次登录的时候需要在此处动态添加菜单路由
          //    */
          // });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    //返回登陆页
    handleBackLogin(){
      this.$router.push('/logins/login');
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