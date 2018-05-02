var schedule = require('node-schedule');
function scheduleCron(){
  schedule.scheduleJob('0 22 21 * * *', function(){
    console.log('Hello World');
  }); 
}

scheduleCron();