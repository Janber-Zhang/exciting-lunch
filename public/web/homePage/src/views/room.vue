<template>
  <div class="app_body">
    <div class="order-warp">
      <div class="all_items">
        <p class="title">全部菜单</p>
        <ul>
          <li class="item" v-for="item in all_items" :key="item.id" v-bind:class="{selected: item.num}">
            {{item.name}}
            <i @click="chooseOne(item)" v-bind:class="{show_icon: item.num}" class="handle add far fa-plus-circle"></i>
            <span class="handle num" >{{item.num}}</span>
            <i @click="deleteOne(item)" v-if="item.num" v-bind:class="{show_icon: item.num}" class="handle sub far fa-minus-circle"></i>
          </li>
        </ul>
      </div>
      <div class="has_selected">
        <p class="title">已点菜单</p>
        <ul>
          <li v-for="item in selected_items" :key="item.id">
            {{item.name}}
            <!-- <i @click="deleteOne(item)" v-if="item.count[user._id]" class="far fa-minus-circle"></i> -->
            <!-- <span class="mine">{{item.count[user._id]}}</span> -->
            <span class="total">{{item.count.total}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="chat-warp">
      <ul class="user_list">
        <li v-bind:class="{'is_mine': _user._id == user._id && _user.nickname == user.nickname}" v-for="_user in users" :key="_user._id">
          <i class="fas fa-user"></i>
          {{_user.nickname}}
          <i style="margin-left: 10px;" @click="logout()" v-if="_user._id == user._id && _user.nickname == user.nickname" class="fas fa-sign-out out"></i>
        </li>
      </ul>
      <ul class="chat-msg-list" id="msgBox">
        <li class="msg_info" v-bind:class="{'is_mine': msg.user._id == user._id && msg.user.nickname == user.nickname}" v-for="(msg, index) in msgArr" :key="index">
          <span class="u_name">{{msg.user.nickname}}:</span>
          <span class="u_msg">{{msg.msg}}</span>
        </li>
      </ul>
      <textarea name="msg" v-model="inputMsg" placeholder="在这里输入点什么..." id="inputMsg" @keyup.enter="send()"></textarea>
    </div>
  </div>
</template>
<style lang='less' scoped>
  
</style>
<script>
import AllMenu from './../js/menu.js'
export default {
  created(){
    this.user = JSON.parse(localStorage.user);
    this.all_items = AllMenu;
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
    $('#inputMsg').focus();
  },
  data(){
    return {
      user: null,
      SOCKET: null,    //保存socket对象
      users: [],       //当前聊天室用户
      msgArr: [],      //消息列表
      inputMsg: '',    //待发送消息
      all_items: [],
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
      this.all_items.forEach((_item)=>{
        let not_found = true;
        orders.forEach((order)=>{
          if (order.id == _item.id) {
            not_found = false;
            _item.num = order.count[this.user._id] || '';
          }
        })
        if (not_found) {
          _item.num = '';
        }
      });
      orders = orders.sort(function(pre, next){
        return pre.count.total < next.count.total
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
      this.SOCKET.emit('order', JSON.stringify(item), JSON.stringify(this.user));
    },
    deleteOne: function(item) {
      this.SOCKET.emit('deleteorder', JSON.stringify(item), JSON.stringify(this.user));
    },
    logout: function(){
      localStorage.clear();
      location.reload();
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