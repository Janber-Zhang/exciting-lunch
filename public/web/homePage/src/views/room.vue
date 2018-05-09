<template>
  <div class="app_body">
    <div class="order-warp">
      <div class="all_items">
        <p class="title">
          全部菜单<span style="font-size:16px; margin-left: 10px; color: #5cb85c">{{`( ${count} / 5 )`}}</span>
          <input type="text" v-model="filter_str" placeholder="输入关键字搜索">
        </p>
        <ul>
          <li class="item" v-for="item in show_list" :key="item.id" v-bind:class="{selected: item.num}">
            {{item.name}}
            <span style="color: #999">{{`（ ¥ ${item.price} ） `}}</span>

            <i @click="chooseOne(item)" v-bind:class="{show_icon: item.num}" class="handle add far fa-plus-circle"></i>
            <span class="handle num" >{{item.num}}</span>
            <i @click="deleteOne(item)" v-if="item.num" v-bind:class="{show_icon: item.num}" class="handle sub far fa-minus-circle"></i>
          </li>
        </ul>
      </div>
      <div class="has_selected">
        <p class="title" style="color: #5cadff; position: relative"><span style="color: #999;font-size: 16px;">{{now_date}}</span>{{` ${user_list.length}人`}}
          <i title="加入觅食" v-if="user_list.indexOf(user._id)===-1" @click="enjoy" class="enjoy fas fa-user-plus"></i>
          <i title="放弃觅食" v-else @click="leave" class="enjoy fas fa-user-times"></i>
        </p>
        <ul>
          <li v-for="item in selected_items" :key="item.id">
            {{item.name}}
            <i @click="chooseOne(item)" class="far fa-plus-circle"></i>
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
  .enjoy {
    display: inline-block;
    position: absolute; 
    right: 10px;
    top: 12px; 
    color: #666;
    cursor: pointer;
    &:hover {
      color: #999;
    }
  }
</style>
<script>
import AllMenu from './../js/menu.js'
export default {
  created(){
    this.user = JSON.parse(localStorage.user_obj);
    this.all_items = AllMenu;
    this.initHisData();
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
      selected_items: [],
      filter_str: '',
      now_date: DateFormat.format(new Date()).substr(0,10),
      user_list: [],
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
      // 监听就餐人数消息
      this.SOCKET.on('users', function (users) {
        vm.dealUsersInfo(users);
      });
      // 监听就餐人数消息
      this.SOCKET.on('messages', function (messages) {
        vm.dealHistoryMsg(messages);
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
        if(pre.count.total < next.count.total){
          return 1
        } else if(pre.count.total > next.count.total){
          return -1
        } else {
          return 0
        }
      })
      this.selected_items = orders;
    },
    dealUsersInfo: function(users) {
      this.user_list = users;
    },
    dealHistoryMsg: function(msgArr) {
      this.msgArr = msgArr;
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
    enjoy: function() {
      this.SOCKET.emit('enlist', JSON.stringify(this.user), 'in')
    },
    leave: function() {
      this.SOCKET.emit('enlist', JSON.stringify(this.user), 'out')
    },
    logout: function(){
      localStorage.clear();
      location.reload();
    },
    initHisData() {
      util.ajaxQuery({
        apiModule: 'newAPI',
        serviceUrl: 'order/index/getall?type=order'
      }, function(res) {
        var user_map = {};
        var menu_map = {};
        var all_data = res.data.data;
        all_data.forEach(function(day){
          var orders = JSON.parse(day.data);
          orders.forEach(function(order){
            if (menu_map[order.id]) {
              menu_map[order.id].count += order.count.total;
            } else {
              menu_map[order.id] = {
                id: order.id,
                name: order.name,
                count: order.count.total
              };
            }
            for (var key in order.count) {
              if (key !== 'total') {
                if (user_map[key]) {
                  user_map[key] += order.count[key]
                } else {
                  user_map[key] = order.count[key]
                }
              }
            }
          });
        })
        console.log(user_map);
        console.log(menu_map);
      })
    }
  },
  components:{

  },
  computed:{
    show_list() {
      if (this.filter_str) {
        const new_list = this.all_items.filter((item)=>{
          if (item.name.indexOf(this.filter_str)>-1) {
            return true
          } else {
            return false
          }
        })
        return new_list
      } else {
        return this.all_items
      }
    },
    count() {
      var count = 0;
      this.selected_items.forEach((item)=>{
        if (item.count && item.count[this.user._id]) {
          count += item.count[this.user._id] || 0;
        }
      });
      return count
    }
  },
  beforeDestroy() {
    this.SOCKET.emit('leave');
  }
}
</script>