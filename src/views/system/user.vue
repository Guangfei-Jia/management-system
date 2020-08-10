<template>
  <!-- 用户管理 -->
  <div class="sys-content-wrap">
    <ContentWrap>
      <el-form :inline="true" :model="formSearch" ref="formSearch" class="demo-form-inline">
        <el-form-item label="用户名称" prop="name">
          <el-input v-model="formSearch.name" size="medium" placeholder="角色"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="onSubmit" :loading="loadingFormSearch">查询</el-button>
          <el-button size="medium" @click="resetForm('formSearch')">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="userList" stripe style="width: 100%" v-loading="loadingTable">
        <el-table-column prop="head_thumb" label="头像" align='center' width="100">
          <template v-slot="scope">
              <img alt="头像" style="width:32px;height:32px" src="../../assets/imgs/logo.png" v-real-img="scope.row.head_thumb"/>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <!-- <el-table-column prop="mobile" label="使用状态"></el-table-column> -->
        <el-table-column label="操作" width="234">
          <template v-slot="scope">
            <el-button
              size="mini"
              @click="handleEdit('setRole', scope.row)"
              type="primary"
              plain
              :disabled="scope.row.router_type === '3'"
            >分配角色</el-button>
            <el-button
              size="mini"
              @click="handleEdit('edit', scope.row)"
              :loading="loadingFormEdit"
            >编辑</el-button>
            <el-popconfirm style="margin-left:10px;" title="确定删除吗？" @onConfirm="handleDelete(scope.row)">
              <el-button slot="reference" size="mini" type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="sys-page-style">
          <el-pagination background @size-change="changeSize" @current-change="changeNumber" :page-sizes="requestData.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="userTotal"></el-pagination>
      </div>
    </ContentWrap>

    <el-dialog
      :title="formAddText.title"
      :visible.sync="formAddVisible"
      @close="resetForm('formAdd')"
    >
      <el-form :model="formAdd" ref="formAdd" :rules="formAddRules">
        <el-form-item label="姓名" :label-width="formAddLabelWidth" prop="name">
          <el-input v-model="formAdd.name" placeholder="请输入姓名" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formAddLabelWidth" prop="mobile">
          <el-input v-model="formAdd.mobile" placeholder="请输入手机号" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formAddLabelWidth" prop="email">
          <el-input v-model="formAdd.email" placeholder="请输入邮箱" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号描述" :label-width="formAddLabelWidth" prop="bz">
          <el-input v-model="formAdd.bz" placeholder="请输入账号描述" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddCancel">{{formAddText.cancelText}}</el-button>
        <el-button
          type="primary"
          :loading="loadingFormAdd"
          @click="handleAddSubmit"
        >{{formAddText.confirmText}}</el-button>
      </div>
    </el-dialog>


    <el-dialog
      :title="setRole.title"
      :visible.sync="setRoleVisible"
      @close="resetForm('formSetRole')"
      >
      <el-form :model="formSetRole" ref="formSetRole">
        <el-form-item>
          <el-checkbox-group v-model="formSetRole.role_id" prop='role_id'>
            <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id" name="role_id" size="medium">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleRoleCancel">{{setRole.cancelText}}</el-button>
        <el-button
          type="primary"
          :loading="loadingFormSetRole"
          @click="handleRoleSubmit"
        >{{setRole.confirmText}}</el-button>
      </div>
    </el-dialog>

    <div>
  </div>
  </div>
</template>
<script>
import { getRoleList, getUserRole, setUserRole } from "@/api/role";
import { getUserList, addUser, updateUser, deleteUser } from "@/api/user";
import { checkResponse } from "@/utils/utils";

export default {
  data() {
    let validateEmail =  (rule, value, callback) => {
      var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;  
      if(!reg.test(value)){
        callback(new Error("请输入正确格式的邮箱！"));
      }else{
        callback();
      }
    };
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
      loadingTable: false, //表格加载中

      loadingFormSearch: false, //查询按钮加载中
      formSearch: {
        //查询角色表单
        name: ""
      },

      userList: [], //用户列表
      userTotal: 0, //用户总数
      editId: -1, //编辑id

      loadingFormAdd: false, //按钮加载中
      loadingFormEdit: false, //编辑按钮加载中
      formAdd: {
        //编辑表单
        name: "",
        mobile: "",
        email: "",
        bz: "",
      },
      formAddRules: {
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
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" }
        ]
      },
      formAddText: {
        //新增表单文本集合
        title: "新增角色",
        cancelText: "取 消",
        confirmText: "确 定"
      },
      formAddVisible: false, //显示新增弹窗
      formAddLabelWidth: "80px", //新增表单lab宽度

      requestData:{
        pageSize: 10,
        pageNum: 1,
        pageSizes: [10,20,50,100],
      },

      roleList: [],  //全部列表
      clickRole: [], //所点击角色
      formSetRole: {
        role_id:[],
      },
      setRole: {
        //分配角色弹窗
        title: "分配角色",
        cancelText: "取 消",
        confirmText: "确 定"
      },
      setRoleVisible: false, //显示分配角色
      loadingFormSetRole: false, //分配角色提交按钮

    };
  },
  created() {
    this.getAllRole();
    this.init();
  },
  mounted () {},
  methods: {

    //关闭分配角色
    handleRoleCancel(){
      this.formSetRole.role_id = []
      this.setRoleVisible = false;
      this.loadingFormSetRole = false;
    },
    //提交分配角色
    handleRoleSubmit(){
      this.$refs["formSetRole"].validate(valid => {
        if (valid) {
            this.setRoles(); //分配角色实现
        } else {
          this.loadingFormSetRole = false;
          console.log("error submit!!");
          return false;
        }
      });
    },
    //分配角色实现
    setRoles(){
      let updateData = Object.assign({}, this.formSetRole, { user_id: this.user_id });
      setUserRole(updateData).then(res => {
        if (!checkResponse(res, true)) {
          return false;
        }
        this.handleRoleCancel();
      })
    },
    //获取全部角色列表
    getAllRole(){
      getRoleList({pageNum: -1}).then(res => {
        const { count, rows } = res.data;
        this.roleList = rows;
      })
    },
    //切换分页每页数量
    changeSize(pageSize){
      this.requestData.pageSize = pageSize;
      this.init();
    },
    //切换分页页码
    changeNumber(number){
      this.requestData.pageNum = number;
      this.init();
    },

    //编辑触发
    handleEdit(type, row) {
      if(type === 'edit'){
        this.handleAddOpen();
        //初始化之后再赋值，否则重置表单无效
        this.$nextTick(() => {
          this.formAdd = {
            name: row.name,
            mobile: row.mobile,
            email: row.email,
            bz: row.bz
          };
          this.editId = row.id;
        })
      }
      if(type === 'setRole'){
        //分配角色
        getUserRole(row.id).then(res => {
          if (!checkResponse(res)) {
            return false;
          }
          this.setRoleVisibleOpen();
          //弹窗组件初始化后，已有角色勾选
          this.$nextTick(() => {
            let list = res.data || [],
                checkedArray = [];
            list.forEach( item => {
              checkedArray.push(item.role_id);
            })
            this.formSetRole.role_id = checkedArray;
          })
          this.user_id = row.id;
        })
      }
    },
    setRoleVisibleOpen(){
      this.setRoleVisible = true;
    },
    handleDelete(row) {
      deleteUser(row.id).then(res => {
        if (!checkResponse(res, true)) {
          return false;
        }
        this.init();
      })
    },
    //初始化页面
    init(type = "") {
      this.loadingTable = true;
      if (type !== "") {
        //查询条件
        Object.assign(this.requestData, this.formSearch);
      }
      getUserList(this.requestData).then(res => {
        this.loadingTable = false;
        this.loadingFormSearch = false;
        if (!checkResponse(res)) {
          return false;
        }
        const { count, rows } = res.data;
        // if (count > 0) {
          this.userList = rows;
          this.userTotal = count;
        // }
      });
    },

    //提交查询条件查询
    onSubmit() {
      this.loadingFormSearch = true;
      this.init("search");
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    //open角色弹窗
    handleAddOpen() {
      this.editId = -1;
      this.formAddVisible = true;
    },
    //关闭弹窗
    handleAddCancel() {
      this.resetForm("formAdd");
      this.formAddVisible = false;
    },

    //新增/编辑角色提交
    handleAddSubmit() {
      this.loadingFormAdd = true;
      this.$refs["formAdd"].validate(valid => {
        if (valid) {
          if (this.editId === -1) {
            this.addAction(); //新增
          } else {
            this.editAction(); //编辑
          }
        } else {
          this.loadingFormAdd = false;
          console.log("error submit!!");
          return false;
        }
      });
    },
    //新增实现
    addAction() {
      // addUser(this.formAdd).then(res => {
      //   this.loadingFormAdd = false;
      //   if (!checkResponse(res, true)) {
      //     return false;
      //   }
      //   this.handleAddCancel();
      //   this.init();
      // });
    },
    //编辑实现
    editAction() {
      let updateData = Object.assign({}, this.formAdd, { id: this.editId });
      updateUser(updateData).then(res => {
        this.loadingFormAdd = false;
        if (!checkResponse(res, true)) {
          return false;
        }
        this.handleAddCancel();
        this.loadingTable = true;
        setTimeout(this.init, 1000);
      });
    }
  }
};
</script>

<style scoped lang="scss">
.sys-page-style{
  float:right;
  margin:20px 0 0 0;
}
</style>