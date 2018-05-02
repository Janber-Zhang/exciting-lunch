<template>
  <div class="role-set">
    <div class="role-set-content">
      <p class="title">Hello, what's your name?</p>
      <input type="text" id="name_input" v-model="value" @keyup.enter="submit">
      <p style="margin-top: 10px;font-size: 16px;" id="login_tips" v-show="show_tips" class="animated bounceIn">请输入您的中文全名！！！</p>
    </div>
  </div>
</template>
<style lang='less' scoped>
  
</style>
<script>
import AllUsers from './../js/user.js'
export default {
  created(){

  },
  mounted(){
    setTimeout(()=>{
      $('#name_input').focus();
    }, 100);
  },
  data(){
    return {
      value: '',
      show_tips: false
    }
  },
  methods:{
    submit() {
      if (this.value) {
        let current_user = false;
        AllUsers.forEach((user)=>{
          if (user.nickname == this.value) {
            current_user = user;
          }
        })
        if (current_user) {
          localStorage.user = JSON.stringify(current_user);
          this.$emit('on-ok');
        } else {
          if (this.show_tips) {
            $('#login_tips').removeClass('bounceIn');
            setTimeout(()=>{
              $('#login_tips').addClass('bounceIn');
            },1)
          } else {
            this.show_tips = true;
          }
          
        }
      }
    }
  },
  components:{

  },
  computed:{
    
  },
  beforeDestroy() {
    
  }
}
</script>