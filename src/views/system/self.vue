<template>
  <!-- 个人设置页面，开发中 -->
  <div class="sys-content-wrap">
    <ContentWrap>
          <el-form
            :model="selfForm"
            status-icon
            :rules="selfRules"
            ref="selfForm"
            class="forms"
            label-width="80px"
            style="width:60%"
            >
            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                action="/dev/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="head_thumb" :src="head_thumb" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="selfForm.name" placeholder="请输入姓名" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="selfForm.mobile" placeholder="请输入手机号" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="sunbit-size" type="primary" @click="submitForm('selfForm')">提交修改</el-button>
            </el-form-item>
          </el-form>
    </ContentWrap>
  </div>
</template>
<script>
import { updateSelf,userDetail } from "@/api/public";
import { checkResponse } from "@/utils/utils";
import { mapState } from 'vuex';

export default {
  data() {
    let validateMobile =  (rule, value, callback) => {
      if(!value){
        callback();
      }
      var reg = /^[1][0-9]{10}$/;  
      if(!reg.test(value)){
        callback(new Error("请输正确手机号！"));
      }else{
        callback();
      }
    };
    return {
      head_thumb: "",
      selfForm:{
        name: "",
        mobile: "",
        email: "",
      },
      selfRules: {
        name: [
          {
            min: 2,
            max: 20,
            message: "角色名称最少 2 个字符,最多 20 个字符",
            trigger: "blur"
          }
        ],
        mobile:[
          {validator: validateMobile, trigger: "blur"},
        ],
      },
    };
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  created() {
    this.init();
  },
  methods: {

    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message('error','上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message('error','上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },

    //初始化页面
    async init(type = "") {
      userDetail(this.userInfo.userId).then(res => {
        this.selfForm = res.data;
        this.head_thumb = res.data.head_thumb;
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let updateData = Object.assign({}, this.selfForm, { id: this.userInfo.userId,head_thumb:this.fileUrl });
          updateSelf(updateData).then(res => {
            this.loadingFormAdd = false;
            if (!checkResponse(res, true)) {
              return false;
            }
            this.loadingTable = true;
            setTimeout(this.init, 1000);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //上传成功回调
    handleAvatarSuccess(res, file) {
      this.fileUrl = file.response.data
      this.head_thumb = URL.createObjectURL(file.raw);
    },
  }
};
</script>

<style scoped lang="scss">
.sys-page-style{
  float:right;
  margin:20px 0 0 0;
}
</style>
<style lang="scss">
.avatar-uploader{
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #409EFF;
    }
  } 
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>