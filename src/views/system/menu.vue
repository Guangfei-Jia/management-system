<template>
  <!-- 菜单管理 -->
  <div class="sys-content-wrap">
    <ContentWrap>
        <el-button class="sys-add-button" type="primary" size="medium" @click="handleAddOpen">新增菜单</el-button>
       <el-table
        :data="menuData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        v-loading="loadingTable"
        >
        <el-table-column prop="name" label="菜单名称" width=""></el-table-column>
        <el-table-column prop="router_url" label="菜单路由" width=""></el-table-column>
        <el-table-column prop="outer_url" label="外链路由" width=""></el-table-column>
        <el-table-column prop="order" label="排序" width="50"></el-table-column>
        <el-table-column prop="router_type" label="类型" width="50">
          <template v-slot="scope">
            {{scope.row.router_type === '1' ? '菜单': scope.row.router_type === '2' ? '内页' : scope.row.router_type === '3' ? '按钮' : ''}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="233" align='center'>
          <template v-slot="scope">
            <el-button
              size="mini"
              @click="handleEdit('addChildren', scope.row)"
              :loading="loadingFormEdit"
              type="primary"
              plain
              :disabled="scope.row.router_type === '3'"
            >添加下级</el-button>
            <el-button
              size="mini"
              plain
              @click="handleEdit('edit', scope.row)"
              :loading="loadingFormEdit"
            >编辑</el-button>
            <el-popconfirm style="margin-left:10px;" title="确定删除吗？" @onConfirm="handleDelete(scope.row)">
              <el-button slot="reference" size="mini" plain type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </ContentWrap>

    <el-dialog
      :title="formAddText.title"
      :visible.sync="formAddVisible"
      @close="resetForm('formAdd')"
    >
      <el-form :model="formAdd" ref="formAdd" :rules="formAddRules">
        <el-form-item label="菜单名称" :label-width="formAddLabelWidth" prop="name">
          <el-input v-model="formAdd.name" placeholder="请输入菜单名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路由地址" :label-width="formAddLabelWidth" prop="router_url">
          <el-input v-model="formAdd.router_url" placeholder="请输入路由地址" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="外链地址" :label-width="formAddLabelWidth" prop="outer_url">
          <el-input v-model="formAdd.outer_url" placeholder="请输入外链地址" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路由参数" :label-width="formAddLabelWidth" prop="router_param">
          <el-input v-model="formAdd.router_param" placeholder="请输入路由参数" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路由参数值" :label-width="formAddLabelWidth" prop="router_param_val">
          <el-input v-model="formAdd.router_param_val" placeholder="请输入路由参数值" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" :label-width="formAddLabelWidth" prop="router_type">
          <el-input v-model="formAdd.router_type" placeholder="请输入菜单类型" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" :label-width="formAddLabelWidth" prop="order">
          <el-input v-model="formAdd.order" placeholder="请输入序号" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单icon" :label-width="formAddLabelWidth" prop="icon_url">
          <el-input v-model="formAdd.icon_url" placeholder="请输入菜单icon" autocomplete="off"></el-input>
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
  </div>
</template>
<script>
import { getMenuList, addMenu, updateMenu, deleteMenu } from "@/api/menu";
import { checkResponse } from "@/utils/utils";
import { mapActions } from "vuex";

export default {
  data() {
    let validateUrl = (rule, value, callback) => {
      if((!value && !this.formAdd.outer_url) || (value && this.formAdd.outer_url)){
        return callback(new Error("路由地址和外链地址只可填写一个!"));
      }
      callback();
    };
    let validateOuterUrl = (rule, value, callback) => {
      if((!value && !this.formAdd.router_url) || (value && this.formAdd.router_url)){
        return callback(new Error("路由地址和外链地址只可填写一个!"));
      }
      callback();
    };
    let validateParam = (rule, value, callback) => {
      if(value && !this.formAdd.router_url){
        return callback(new Error("路由不存在，参数将无效，请先填写路由!"));
      }
      callback();
    };
    let validateParamVal = (rule, value, callback) => {
      if(this.formAdd.router_param && !value){
        return callback(new Error("存在路由参数，必须填写参数值!"));
      }
      if(value && !this.formAdd.router_param){
        return callback(new Error("路由参数为空，参数值将无效，请填写路由参数!"));
      }
      if(value && !this.formAdd.router_url){
        return callback(new Error("路由不存在，参数值将无效，请先填写路由!"));
      }
      callback();
    };

    return {
      menuData: [], //菜单树
      loadingTable: false, //表格加载中
      loadingFormAdd: false, //新增按钮加载中
      loadingFormEdit: false, //编辑按钮加载中

      formAddText: {
        //新增表单文本集合
        title: "新增菜单",
        cancelText: "取 消",
        confirmText: "确 定"
      },
      formAddVisible: false, //显示新增弹窗
      formAddLabelWidth: "100px", //新增表单lab宽度

      formAdd: {
        name: "",
        router_url: "",
        outer_url: "",
        router_param: "",
        router_param_val: "",
        router_type: "",
        order: "",
        icon_url: "",
      },
      formAddRules: {
        name: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          { min: 2, max: 20, message: "菜单名称为 2-20 个字符", trigger: "blur" }
        ],
        router_url: [{ validator: validateUrl, trigger: "blur" }],
        outer_url: [{ validator: validateOuterUrl, trigger: "blur" }],
        router_param: [{ validator: validateParam, trigger: "blur" }],
        router_param_val: [{ validator: validateParamVal, trigger: "blur" }],
        router_type: [{required: true, message: "菜单类型必填", trigger: "blur"}],
        order: [{required: true, message: "排序必填", trigger: "blur"}]
      },

      parentId:null,  //父id
    };
  },
  created () {
    this.init();
  },
  methods: {
    //初始化菜单树
    init() {
      this.loadingTable = true;
      getMenuList().then(res => {
        this.menuData = res.data;
        this.loadingTable = false;
      })
    },
    //删除
    handleDelete(row) {
      deleteMenu(row.id).then(res => {
        if (!checkResponse(res, true)) {
          return false;
        }
        this.init();
      })
    },
    //编辑触发
    handleEdit(type, row) {
      this.handleAddOpen();
      if(type === 'addChildren'){
        this.parentId = row.id;
      }
      if(type === 'edit'){
        //初始化之后再赋值，否则重置表单无效
        this.$nextTick(() => {
          this.formAdd = {
            name: row.name,
            router_url: row.router_url,
            outer_url: row.outer_url,
            router_param: row.router_param,
            router_param_val: row.router_param_val,
            router_type: row.router_type,
            order: row.order,
            icon_url: row.icon_url,
          };
        })
        this.editId = row.id;
      }
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
    //新增/编辑菜单提交
    handleAddSubmit() {
      this.loadingFormAdd = true;
      this.$refs["formAdd"].validate(valid => {
        if (valid) {
          if (this.editId === -1) {
            this.addAction(); //新增菜单或子菜单
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
      let addData = this.formAdd;
      if(this.parentId) {
        Object.assign(addData, { parent_id: this.parentId });
      }
      addMenu(addData).then(res => {
        this.loadingFormAdd = false;
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
      updateMenu(updateData).then(res => {
        this.loadingFormAdd = false;
        if (!checkResponse(res, true)) {
          return false;
        }
        this.handleAddCancel();
        /**
         * 服务器查询接口比更新接口速度要快
         * 即刻调用会返回原始历史数据
         * 此处先使用延迟函数来处理，后面需优化
         */
        this.loadingTable = true;
        setTimeout(this.init, 1000);
      });
    }
  }
};
</script>

<style scoped lang="scss">
.forms {
  color: $main-color;
  .login-buttons {
    margin-bottom: 20px;
    overflow: hidden;
    span {
      cursor: pointer;
    }
    .left_span {
      float: left;
      margin-left: 5px;
    }
    .right_span {
      margin-right: 5px;
      float: right;
    }
  }
  .sunbit-size {
    width: 100%;
  }
}
</style>