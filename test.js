var schedule = require('node-schedule');
var util = require('./libs/util.js')
function scheduleCron(){
  schedule.scheduleJob('1 * * * * *', function(){
    console.log('123')
    util.query('order/index/saveorder', 'post', {
      date: '2018-12-12',
      data: +new Date(),
      type: 'test'
    });
  }); 
}

scheduleCron();