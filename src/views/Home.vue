<template>
    <el-container class="sys-containers">
      <el-header class="sys-header">
        <!-- 标题logo -->
        <div class="sys-title" style="transition: width .5s;" :style="{width:isCollapse ? '65px' : '220px'}">
          <span v-show="!isCollapse">{{systemName}}</span>
          <!-- <img v-show="isCollapse" class="sys-index-logo" src="../assets/imgs/logo.png" alt="logo"> -->
        </div>
        <div class="sys-right-set">
          <el-dropdown @command="handles">
            <i class="el-icon-setting"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="setting">个人设置</el-dropdown-item>
              <!-- <el-dropdown-item command="setColor">切换主题</el-dropdown-item> -->
              <el-dropdown-item command="setLogout">退出登陆</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span v-if="userInfo">{{userInfo.name}}</span>
        </div>
      </el-header>
      <el-container>
        <el-aside class="sys-aside" style="transition: width .5s;" :width="isCollapse ? '65px' : '220px'">
          <!-- 菜单 -->
          <el-menu style="border:none" :collapse="isCollapse" @select="handleSelect" :router="ifRouter" :unique-opened="true" :default-active="activeIndex">
            <template  v-for="item in menu">
              <!-- 一级菜单 -->
              <el-menu-item :index="item.router_url" v-if="!ifShowMenu(item)" :key="item.id">
                <i class="el-icon-setting"></i>
                <span slot="title" >{{item.name}}</span>
              </el-menu-item>
              <el-submenu :index="item.router_url" v-if="ifShowMenu(item)" :key="item.id">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span slot="title">{{item.name}}</span>
                </template>
                <template v-for="item_child in item.children">
                  <!-- 二级菜单 -->
                  <el-menu-item :index="item_child.router_url" v-if="!ifShowMenu(item_child)" :key="item_child.id">
                      <span>{{item_child.name}}</span>
                  </el-menu-item>
                  <el-submenu :index="item_child.router_url" v-if="ifShowMenu(item_child)" :key="item_child.id">
                    <span slot="title">{{item_child.name}}</span>
                    <!-- 三级菜单 -->
                    <template v-for="item_child_child in item_child.children">
                      <el-menu-item :index="item_child_child.router_url" v-if="item_child_child.router_type === 1" :key="item_child_child.id">
                        {{item_child_child.name}}
                      </el-menu-item>
                    </template>
                  </el-submenu>
                </template>
              </el-submenu>
            </template>
          </el-menu>
          <!-- 控制收缩菜单 -->
          <div style="transition: width .5s;" :style="{width:isCollapse ? '65px' : '220px'}" class="sys-menu-control" @click="handleCollapse">
            <span v-show="!isCollapse">&lt</span>
            <span v-show="isCollapse">&gt</span>
          </div>
        </el-aside>
        <el-container style="transition: padding-left .5s;" :style="{paddingLeft:isCollapse ? '65px' : '220px'}">
          <router-view></router-view>
          <!-- <el-footer class="sys-footer">Copyright &copy; 2019 Pear Project</el-footer> -->
        </el-container>
      </el-container>
    </el-container> 
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
import HelloWorld from "@/components/HelloWorld.vue";
import { home, getUser } from '@/api/public';
import Websocket from '@/components/WebSocket';

export default {
  name: "Home",
  components: {
    HelloWorld,
    Websocket
  },
  data() {
    return {
      isCollapse: false,       //控制菜单展开和收缩
      systemName: '管理系统',   //系统标题
      ifRouter: true,         //开启router 模式
      activeIndex: '/'

    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      menu: state => state.menu,
    }),
  },
  watch: {
    $route: function(to, from){
      this.activeIndex = to.path;  //监听url更新，控制菜单选中状态
    }
  },
  created() {
    this.activeIndex = this.$route.path;  //刷新界面菜单更新选中状态
    // home().then(res => {
    //   console.log(res);
    // });
  },

  methods: {
    ...mapActions(['SET_LOGOUT', 'SET_BREAD']),
    
    //判断当前菜单是否有子菜单，控制多级菜单展示
    ifShowMenu(item){
      let hasChild = false; 
      if(item.children.length === 0 && item.router_type === '1'){
        hasChild = false;
      }
      if(item.children.length > 0 ){
        //有子菜单,且子菜单至少有一个是菜单，即router_type===1
        let atLeastOne = item.children.some( val => {
          return val.router_type === '1';
        })
        if(atLeastOne){
          hasChild = true;
        }else{
          hasChild = false;
        }
      }
      return item.router_type === '1' && hasChild
    },

    //控制菜单缩放
    handleCollapse(){
      this.isCollapse = !this.isCollapse;
    },

    
    handles(command){
      //退出登陆
      if(command === 'setLogout'){
        this.SET_LOGOUT();
        this.$router.push('/logins/login');
      }
      //个人设置
      if(command === 'setting'){
        this.$router.push('/system/self');
      }
    },

    handleSelect(key, keyPath){
      console.log(this.$router.options.routes)
      console.log(key)
      console.log(keyPath)
    },
  },
};
</script>
<style lang="scss" scoped>
  @mixin titlestyle{
    height: 60px;
    line-height: 60px;
    color: $white-color;
    background-color: $main-color;
    font-size: 20px;
    text-align: center;
    cursor: pointer;
  }
  .el-container{
    overflow:scroll;
  }
  .sys-containers {
    height: 100%;
    .sys-header{
      z-index: 1;
      padding:0;
      box-shadow:0 0 8px 0 rgba(0,0,0,.1);
      .sys-title{
        @include titlestyle;
        float:left;
        &::before{
          content: '';
          position: absolute;
          left: 20px;
          top: 15px;
          background: url('../assets/imgs/logo.png');
          background-size: cover;
          width: 30px;
          height: 30px;
        }
      }
      .sys-right-set{
        float: right;
        margin-right: 20px;
        height: 60px;
        line-height: 60px;
        .el-icon-setting{
          cursor: pointer;
          margin-right: 15px
        }
      }
    }
    .sys-aside{
      border-right:1px solid #DCDFE6;
      position: absolute;
      top:60px;
      bottom:60px;
      .sys-menu-control{
        @include titlestyle;
        position: fixed;
        bottom: 0;
      }
    }
  }
</style>