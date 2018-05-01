<template>
  <div class="app_body">
    <div class="order-warp">
      <div class="all_items">
        <p class="title">全部菜单</p>
        <ul>
          <li class="item" v-for="item in all_items_show" @click="chooseOne(item)" :key="item.id">{{item.name}}</li>
        </ul>
      </div>
      <div class="has_selected">
        <p class="title">已点菜单</p>
        <ul>
          <li v-for="item in selected_items" @click="deleteOne(item)" :key="item.id">{{item.name}}</li>
        </ul>
      </div>
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
      inputMsg: '',    //待发送消息
      all_items: [
        {name: '回锅肉', id: '0'},
        {name: '盐煎肉', id: '1'},
        {name: '小炒肉', id: '2'},
        {name: '测试', id: '3'},
        {name: '宫保鸡丁', id: '4'},
        {name: '肥肠粉', id: '5'},
        {name: '牛排', id: '6'},
        {name: '测啊', id: '7'},
        {name: '简单', id: '8'},
      ],
      selected_items: []
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
      // 监听点餐系统消息
      this.SOCKET.on('orders', function (orders) {
        vm.dealOrderInfo(orders);
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
    dealOrderInfo: function(orders) {
      this.all_items_show = this.all_items.filter(function(item){
        var not_choose = true;
        orders.forEach(function(order){
          if (order.name == item.name) {
            not_choose = false;
          }
        })
        return not_choose
      })
      this.selected_items = orders;
    },
    send: function(){
      if (this.inputMsg.length !== 0) {
        this.SOCKET.send(this.inputMsg);
        this.inputMsg = '';
      }
    },
    chooseOne: function(item) {
      this.SOCKET.emit('order', JSON.stringify(item));
    },
    deleteOne: function(item) {
      this.SOCKET.emit('deleteorder', JSON.stringify(item));
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