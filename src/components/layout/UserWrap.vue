<template>
    <el-container class="contant">
        <el-main>
            <el-row type="flex" justify="center">
                <el-col :span="8">
                  <div class="outer-wrap">
                      <div class="login-wrap">
                          <p class='login-name'>{{systermName}}</p>
                      </div>
                      <router-view />
                  </div>
                </el-col>
            </el-row>
        </el-main>
        <el-footer>
            <div class="copyright">
                Copyright &copy; 2020 Fly Project
            </div>
        </el-footer>
    </el-container>
</template>
<script>
export default {
  name: "UserWrap",
  data() {
    return {
      systermName: '管理系统',
    };
  },
};
</script>

<style scoped lang="scss">
.contant{
  padding-top: 10%;
  height: 100%;
  background: url('../../assets/imgs/login_bg.jpg');
  z-index: 0;
  background-size: 100% 100%;
  .outer-wrap{
    min-width: 400px;
    z-index: 2;
    position: relative;
    &::before{
      content: "";
      background: #fff;
      z-index: -1;
      border-radius: 5px;
      background-size: cover;
      width:100%;
      height:100%;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }
    padding: 1px 20px 20px 20px;
    border-radius: 5px;
    .login-wrap{
      .login-name{
        &::before{
          content: '';
          display: inline-block;
          position: relative;
          left: 0px;
          top: 15px;
          width: 50px;
          height: 50px;
          background:url('../../assets/imgs/logo.png');
          background-size:cover;
        }
        @include title-style
      }
    }
    .forms{
      color: $main-color;
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
      .sunbit-size{
        width: 100%;
      }
    }  
  }
  .copyright{
    color: $white-color;
  }
}
</style>