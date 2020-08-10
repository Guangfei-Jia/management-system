<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>聊天信息</span>
            <el-button style="float: right; padding: 3px 0" type="text"
              >加入聊天</el-button
            >
          </div>
          <div style="height:500px;overflow:scroll;">
            <div v-for="o in messageList" :key="o.id">
              <div
                v-if="o.data.name"
                class="text item"
                :style="{
                  'text-align':
                    o.data.name === userInfo.username ? 'right' : 'left'
                }"
              >
                {{ o.data.name }}:
                {{ o.data.message }}
              </div>
              <div v-else class="text item">
                {{ o.data }}
              </div>
            </div>
          </div>

          <el-form :model="message" style="margin-top:20px">
            <el-col :span="20">
              <el-form-item>
                <el-input v-model="message.msg" placeholder="信息"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-button type="primary" @click="onSubmit">发送</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>当前用户</span>
          </div>
          <div v-for="o in userlist" :key="o.id" class="text item">
            {{ o.name }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      path: 'ws://localhost:8090',
      webSocket: null,
      message: {
        msg: ''
      },
      userlist: [],
      messageList: []
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  created() {
    this.initWebSocket();
  },
  methods: {
    initWebSocket() {
      if (typeof WebSocket === 'undefined') {
        alert('您的浏览器不支持socket');
      } else {
        this.webSocket = new WebSocket(this.path);
        this.webSocket.onopen = this.openWS;
        this.webSocket.onerror = this.errorWS;
        this.webSocket.onmessage = this.messageWS;
        this.webSocket.onclose = this.closeWS;
      }
    },
    openWS() {
      console.log("连接成功");
      let data = {
        type: 'join',
        name: this.userInfo.username
      };
      this.sendWS(data);
    },
    errorWS() {
      console.log('连接错误');
      this.initWebSocket(); //短线重新连接
    },
    sendWS(data) {
      console.log('发送数据');
      this.webSocket.send(JSON.stringify(data));
    },
    messageWS(e) {
      console.log('接收数据');
      let data = e.data;
      let JSONdata = JSON.parse(data);
      switch (JSONdata.type) {
        case 'join':
          this.messageList.push(JSONdata);
          break;
        case 'userList':
          this.userlist = JSON.parse(JSONdata.userList);
          break;
        case 'message':
          this.messageList.push(JSONdata);
          break;
        default:
          break;
      }
      console.log(JSON.parse(e.data));
    },
    closeWS() {
      console.log('关闭连接');
    },
    onSubmit() {
      //用户信息需要后端token去解析，不能前端携带
      //提交信息
      let data = {
        type: 'message',
        name: this.userInfo.username,
        message: this.message.msg
      };
      this.sendWS(data);
    }
  }
};
</script>
