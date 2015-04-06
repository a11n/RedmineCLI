var swig = require('swig');
var moment = require('moment');

swig.setFilter('ago', function (input) {
  return moment(input).fromNow();
});

exports.renderFile = function(file, data){
  return swig.renderFile(file, data);
};
