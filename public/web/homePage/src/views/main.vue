<template>
  <div class="main">
    <order-room v-if="have_name"></order-room>
    <enter-name v-else @on-ok="have_name = true"></enter-name>
  </div>
</template>
<style lang='less' scoped>
  
</style>
<script>
import enterName from './name.vue'
import orderRoom from './room.vue'
export default {
  created(){
    if (localStorage.user_obj) {
      this.have_name = true;
    }
  },
  mounted(){

  },
  components:{
    enterName,
    orderRoom
  },
  data(){
    return {
      have_name: false
    }
  },
  methods:{
    
  },
  computed:{
    
  },
  beforeDestroy() {

  }
}
</script>