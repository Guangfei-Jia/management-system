<template>
  <div style="width:100%">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="sys-bread">
      <el-breadcrumb-item v-for="item in breadcrumb" :key="item">{{item}}</el-breadcrumb-item>
      <!-- 面包屑菜单待开发 -->
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <!-- <el-breadcrumb-item>活动管理</el-breadcrumb-item> -->
    </el-breadcrumb>
    <el-main style="background-color:#f0f2f5;">
      <el-main style="background-color:#ffffff;">
        <slot></slot>
      </el-main>
    </el-main>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: "ContentWrap",
  data() {
    return {
      systermName: '管理系统',
    };
  },
  computed: {
    ...mapState([
      'breadcrumb'
    ])
  }
};
</script>

<style scoped lang="scss">
  .sys-bread{
    border-bottom: 1px solid #DCDFE6;
    padding: 20px;
    background-color: $white-color;

  }
</style>