var axios = require('axios');
var config = require('../config/config.json');

var util = {};

util.query = function(url, httpType, param, cb) {
  httpType = httpType || 'get';
  apiUrl = config['newAPI'];
  var serviceUrl = apiUrl + '/' + url;
  if (httpType == 'get') {
    if (Object.keys(params).length){
      serviceUrl += '?';
      var i = 0;
      for (var key in params) {
        if (i) {
          serviceUrl += '&' + key + '=' + params[key];
        } else {
          serviceUrl += key + '=' + params[key];
        }
        i++
      }
    }
    axios.get(serviceUrl)
    .then((res_) => {
      cb(res_.data)
    })
    .catch(function(err){
      console.log(err);
    });
  }
  if (httpType == 'post') {
    console.log(serviceUrl, param)
    axios.post(serviceUrl, param).then((res_) => {
      cb(res_.data)
    })
    .catch(function(err){

    });
  }
}

module.exports = util;
