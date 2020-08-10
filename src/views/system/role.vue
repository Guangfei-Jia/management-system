<template>
  <!-- 角色管理 -->
  <div class="sys-content-wrap">
    <ContentWrap>
      <el-form :inline="true" :model="formSearch" ref="formSearch" class="demo-form-inline">
        <el-form-item label="角色" prop="name">
          <el-input v-model="formSearch.name" size="medium" placeholder="角色"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="onSubmit" :loading="loadingFormSearch">查询</el-button>
          <el-button size="medium" @click="resetForm('formSearch')">重置</el-button>
        </el-form-item>
      </el-form>

      <el-button class="sys-add-button" type="primary" size="medium" @click="handleAddOpen">新增</el-button>

      <el-table :data="roleList" stripe border style="width: 100%" v-loading="loadingTable">
        <el-table-column prop="updatedAt" label="日期" width="152"></el-table-column>
        <el-table-column prop="name" label="角色名称"></el-table-column>
        <el-table-column label="操作" width="239" align='center'>
          <template v-slot="scope">
            <el-button
              size="mini"
              @click="handleEdit('setRole', scope.row)"
              type="primary"
              plain
              :disabled="scope.row.router_type === '3'"
            >授权</el-button>
            <el-button
              size="mini"
              @click="handleEdit('edit', scope.row)"
            >编辑</el-button>
            <el-popconfirm style="margin-left:10px;" title="确定删除吗？" @onConfirm="handleDelete(scope.row)">
              <el-button slot="reference" size="mini" type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="sys-page-style">
          <el-pagination background @size-change="changeSize" @current-change="changeNumber" :page-sizes="requestData.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="roleTotal"></el-pagination>
      </div>
    </ContentWrap>

    <el-dialog
      :title="formAddText.title"
      :visible.sync="formAddVisible"
      @close="resetForm('formAdd')"
      >
      <el-form :model="formAdd" ref="formAdd" :rules="formAddRules">
        <el-form-item label="角色名称" :label-width="formAddLabelWidth" prop="name">
          <el-input v-model="formAdd.name" placeholder="请输入角色名称" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddCancel">{{formAddText.cancelText}}</el-button>
        <el-button
          type="primary"
          :loading="formAddText.loadingFormAdd"
          @click="handleAddSubmit"
        >{{formAddText.confirmText}}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="roleTreeText.title"
      :visible.sync="roleTreeVisible"
      @close="handleSetRoleCancel"
      >
      <el-tree
        ref="tree"
        :data="treeData"
        :default-expand-all="true"
        :check-on-click-node="true"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkData"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleSetRoleCancel">{{roleTreeText.cancelText}}</el-button>
        <el-button
          type="primary"
          :loading="roleTreeText.loading"
          @click="handleSetRoleSubmit"
        >{{roleTreeText.confirmText}}</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>
<script>
import { getRoleList, addRole, updateRole, deleteRole, setRole } from "@/api/role";
import { getMenuList, getRoleMenu } from "@/api/menu";
import { checkResponse } from "@/utils/utils";

export default {
  data() {
    return {
      loadingTable: false, //表格加载中

      loadingFormSearch: false, //查询按钮加载中
      formSearch: {
        //查询角色表单
        name: ""
      },

      //新增编辑角色模块
      formAdd: {
        //表单
        name: ""
      },
      formAddRules: {
        //表单验证
        name: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 20, message: "角色名称最少 2 个字符,最多 20 个字符", trigger: "blur" }
        ]
      },
      formAddText: {
        //表单文本集合
        title: "新增角色",
        cancelText: "取 消",
        confirmText: "确 定",
        loadingFormAdd: false //提交按钮
      },
      formAddVisible: false, //显示弹窗
      formAddLabelWidth: "80px", //表单lab宽度
      editId: -1, //编辑角色id

      //授权模块
      roleList: [], //角色列表
      roleTreeText: {
        //权限树文本
        title: "角色授权",
        cancelText: "取 消",
        confirmText: "授 权",
        loading: false  //授权提交按钮加载
      },
      roleTreeVisible: false, //显示授权弹窗
      treeData: [],  //总权限树
      checkData: [], //默认勾选的节点
      defaultProps:{
        //树配置
        label: 'name',
        children: 'children',
      },
      roleId: -1, //显示弹窗时的角色id，授权提交使用

      //分页模块
      roleTotal: 0, //分页列表总数
      requestData:{
        pageSize: 10,
        pageNum: 1,
        pageSizes: [10,20,50,100],
      }
    };
  },
  created() {
    this.getRoleTree(); //获取总菜单树
    this.init();
  },
  methods: {

    //获取总菜单树
    getRoleTree(){
      getMenuList().then(res => {
        if (!checkResponse(res)) {
          return false;
        }
        this.treeData = res.data;
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

    //弹窗触发
    handleEdit(type, row) {
      if(type === 'edit'){
        //编辑
        this.handleAddOpen();
        //初始化之后再赋值，否则重置表单无效
        this.$nextTick(() => {
          this.formAdd = {
            name: row.name
          };
          this.editId = row.id;
        })
      }
      if(type === 'setRole'){
        //授权
        getRoleMenu(row.id).then(res => {
          if (!checkResponse(res)) {
            return false;
          }
          this.setRoleOpen();
          //弹窗组件初始化后，将菜单叶子节点节点全部设置为勾选
          this.$nextTick(() => {
            let tree = res.data || [],
                checkArray = [];
            tree.forEach((item) => {
              let nodes = this.$refs.tree.getNode(item.menu_id);
              if(nodes.isLeaf){
                checkArray.push(item.menu_id);
              }
            })
            this.checkData = checkArray;
          })
          this.roleId = row.id;
        })
      }
    },
    handleDelete(row) {
      deleteRole(row.id).then(res => {
        if (!checkResponse(res, true)) {
          return false;
        }
        this.init();
      })
    },
    //初始化页面
    async init(type = "") {
      this.loadingTable = true;
      if (type !== "") {
        //查询条件
        Object.assign(this.requestData, this.formSearch);
      }
      getRoleList(this.requestData).then(res => {
        this.loadingTable = false;
        this.loadingFormSearch = false;
        if (!checkResponse(res)) {
          return false;
        }
        const { count, rows } = res.data;
        // if (count == 0) {
        //   this.roleList = [];
        //   this.roleTotal = count;
        //   return;
        // }
        this.roleList = rows;
        this.roleTotal = count;
      });
    },

    //授权弹窗显示
    setRoleOpen(){
      this.roleId = -1;
      this.roleTreeVisible = true;
    },
    //关闭授权弹窗
    handleSetRoleCancel() {
      this.$refs.tree.setCheckedKeys([])//置空默认勾选的树节点
      this.roleTreeVisible = false;
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

    //授权提交
    handleSetRoleSubmit() {
      this.roleTreeText.loading = true;
      this.roleTreeVisible = true;
      let checkArrays = this.$refs.tree.getCheckedKeys(),
          harfCheckArray = this.$refs.tree.getHalfCheckedKeys();
      let requestData = {
        role_id: this.roleId,
        menu_ids: checkArrays.concat(harfCheckArray)
      }
      setRole(requestData).then(res => {
        this.roleTreeText.loading = false;
        if (!checkResponse(res, true)) {
          return false;
        }
        this.handleSetRoleCancel();
      })
    },

    //新增/编辑角色提交
    handleAddSubmit() {
      this.formAddText.loadingFormAdd = true;
      this.$refs["formAdd"].validate(valid => {
        if (valid) {
          if (this.editId === -1) {
            this.addAction(); //新增
          } else {
            this.editAction(); //编辑
          }
        } else {
          this.formAddText.loadingFormAdd = false;
          console.log("error submit!!");
          return false;
        }
      });
    },
    //新增实现
    addAction() {
      addRole(this.formAdd).then(res => {
        this.formAddText.loadingFormAdd = false;
        if (!checkResponse(res, true)) {
          return false;
        }
        this.handleAddCancel();
        this.init();
      });
    },
    //编辑实现
    editAction() {
      let updateData = Object.assign({}, this.formAdd, { id: this.editId });
      updateRole(updateData).then(res => {
        this.formAddText.loadingFormAdd = false;
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
//分页位置，需要提取出来
.sys-page-style{
  float:right;
  margin:20px 0 0 0;
}
</style>