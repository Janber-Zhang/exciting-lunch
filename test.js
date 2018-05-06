var schedule = require('node-schedule');
var util = require('./libs/util.js')
function scheduleCron(){
  schedule.scheduleJob('40 48 16 * * *', function(){
    console.log('123')
    util.query('order/index/saveorder', 'post', {
      date: '2018-12-12',
      data: 'asd'
    })
  }); 
}

scheduleCron();