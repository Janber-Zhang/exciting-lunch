<template>
  <div class="app_body">
    <div class="order-warp">
      
    </div>
    <div class="chat-warp">
      <ul class="user_list">
        <li v-bind:class="{'is_mine': _user._id == user._id && _user.nickname == user.nickname}" v-for="_user in users" :key="_user._id"><i class="fas fa-user"></i>{{_user.nickname}}</li>
      </ul>
      <ul class="chat-msg-list" id="msgBox">
        <li class="msg_info" v-bind:class="{'is_mine': msg.user._id == user._id && msg.user.nickname == user.nickname}" v-for="(msg, index) in msgArr" :key="index">
          <span class="u_name">{{msg.user.nickname}}:</span>
          <span class="u_msg">{{msg.msg}}</span>
        </li>
      </ul>
      <textarea name="msg" v-model="inputMsg" id="inputMsg" @keyup.enter="send()"></textarea>
    </div>
  </div>
</template>
<style lang='less' scoped>
  
</style>
<script>
export default {
  created(){
    this.user = JSON.parse(localStorage.user);
  },
  mounted(){
    this.socketInit();
    /*
     * 输入框禁用回车事件
     */
    $('#inputMsg').keydown(function(event) {
      switch(event.keyCode){
        case 13:
          return false; 
          break
      }
    });
  },
  data(){
    return {
      user: null,
      SOCKET: null,    //保存socket对象
      users: [],       //当前聊天室用户
      msgArr: [],      //消息列表
      inputMsg: ''     //待发送消息
    }
  },
  methods:{
    socketInit: function(){
      let vm = this;
      // ---------创建连接-----------
      this.SOCKET = io();
      // 加入房间
      this.SOCKET.on('connect', function () {
        vm.SOCKET.emit('join', JSON.stringify(vm.user));
      });
      //监听消息
      this.SOCKET.on('msg', function (user, msg) {
        vm.dealMsgInfo(user, msg);
      });
      // 监听系统消息
      this.SOCKET.on('sys', function (sysMsg, users, user, type) {
        vm.dealSysInfo(sysMsg, users, user, type);
      });
    },
    dealSysInfo: function(sysMsg, users, user, type) {
      this.users = users;
    },
    dealMsgInfo: function(user, msg) {
      this.msgArr.push({user, msg});
      setTimeout(function() {
        $('#msgBox').scrollTop($('#msgBox')[0].scrollHeight);
      }, 10);
    },
    send: function(){
      if (this.inputMsg.length !== 0) {
        this.SOCKET.send(this.inputMsg);
        this.inputMsg = '';
      }
    }
  },
  components:{

  },
  computed:{
    
  },
  beforeDestroy() {
    this.SOCKET.emit('leave');
  }
}
</script>