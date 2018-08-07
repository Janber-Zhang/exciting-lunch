<template>
  <div class="statistics-warp">

    <div id="menu_data"></div>

    <button class="close-btn" @click="closePanel">关闭</button>

  </div>
</template>
<style scoped>
  .statistics-warp {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
  }
  #menu_data {
    position: absolute;
    left: 20px;
    top: 40px;
    bottom: 0;
    right: 20px;
  }
  .close-btn {
    display: inline-block;
    width: 100px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #19BE72;
    margin: 5px 10px 0;
    background-color: #19BE72;
    color: #ffffff;
    font-size: 14px;
  }
</style>
<script>
import AllMenu from './../js/menu.js'
import AllUsers from './../js/user.js'
export default {
  created(){
    this.initData()
  },
  props: {
    data: { type: [Object, Array], required: true}
  },
  mounted(){
    this.initMenuData()
  },
  data(){
    return {
      menu_arr: [],
      user_arr: [],
      show_tips: false
    }
  },
  methods:{
    closePanel() {
      this.$emit('close')
    },
    initData() {
      var user_map = {};
      var menu_map = {};
      this.data.forEach(function(day){
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
      let user_arr = []
      let menu_arr = []
      Object.keys(user_map).forEach(key => {
        user_arr.push(user_map[key])
      })
      Object.keys(menu_map).forEach(key => {
        menu_arr.push({
          name: menu_map[key].name,
          y: menu_map[key].count
        })
      })
      this.user_arr = user_arr
      menu_arr.sort(function(pre, next) {
        return next.y - pre.y
      })
      window.a = menu_arr
      this.menu_arr = menu_arr
    },
    initMenuData() {
      let data = this.menu_arr.map((item, index) => {
        return {
          name: item.name,
          value: item.y,
          colorValue: index
        }
      })
      var chart = Highcharts.chart('menu_data', {
        colorAxis: {
          minColor: Highcharts.getOptions().colors[0],
          maxColor: '#FFFFFF'
        },
        series: [{
          type: "treemap",
          layoutAlgorithm: 'squarified',
          data: data
        }],
        title: {
          text: '热门菜品图'
        },
        tooltip: {
          pointFormat: '{point.name} : {point.value} (人/次)'
        }
      });
    }
  },
  computed:{
    
  }
}
</script>