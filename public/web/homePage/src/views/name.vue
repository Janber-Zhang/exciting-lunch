<template>
  <div class="role-set">
    <div class="role-set-content">
      <p class="title">Hello, what's your name?</p>
      <input type="text" v-model="value" @keyup.enter="submit">
    </div>
  </div>
</template>
<style lang='less' scoped>
  
</style>
<script>
export default {
  created(){

  },
  mounted(){

  },
  data(){
    return {
      value: ''
    }
  },
  methods:{
    submit() {
      if (this.value) {
        localStorage.user = JSON.stringify({
          nickname: this.value,
          _id: +new Date()
        });
        this.$emit('on-ok');
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