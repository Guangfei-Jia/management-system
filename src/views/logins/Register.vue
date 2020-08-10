<template>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      class="forms"
      >
      <el-form-item prop="username">
        <el-input v-model="ruleForm.username" placeholder="请输入账号" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" show-password v-model="ruleForm.password" placeholder="请输入密码" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="password2">
        <el-input type="password" show-password v-model="ruleForm.password2"  placeholder="再次确认密码" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input type="text" v-model="ruleForm.email"  placeholder="请输入邮箱/用于找回密码" autocomplete="off"></el-input>
      </el-form-item>
      <div class="login-buttons">
        <span class="right_span" @click="handleBackLogin">返回登陆页</span>
      </div>
      <el-form-item>
        <el-button class="sunbit-size" type="primary" @click="submitForm('ruleForm')">提交注册</el-button>
      </el-form-item>
    </el-form>
</template>
<script>
import { register } from "@/api/public";
import { checkResponse } from "@/utils/utils";
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.password2 !== "") {
          this.$refs.ruleForm.validateField("password2");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    let validateEmail =  (rule, value, callback) => {
      var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;  
      if(!reg.test(value)){
        callback(new Error("请输入正确格式的邮箱！"));
      }else{
        callback();
      }
    };
    return {
      ruleForm: {
        username: "",
        password: "",
        password2: "",
        email: "",
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 5, message: '用户名最少 5 个字符', trigger: 'blur' }
        ],
        password: [{ validator: validatePass, trigger: "blur" }],
        password2: [{ validator: validatePass2, trigger: "blur" }],
        email: [{ validator: validateEmail, trigger: "blur" }]
      }
    };
  },
  methods: {
    
    //提交注册账号
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          register(this.ruleForm).then(res => {
            if (!checkResponse(res, true)) {
              return false;
            }
            this.$router.push("/logins/login");
          });
        } else {
          console.log("error submit!!");
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

<style lang="scss" scoped>
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
