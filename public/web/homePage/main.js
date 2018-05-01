/**
 * Created by janber on 17/3/20.
 */
 import Vue          from 'vue';
 import './src/css/app.less';
 import App          from './src/views/main.vue'


new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
