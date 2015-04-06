var swig = require('swig');
var moment = require('moment');
var Table = require('cli-table');
var colors = require('colors');

swig.setFilter('ago', function (input) {
  return moment(input).fromNow();
});

swig.setFilter('heading', function (input) {
  return input.toUpperCase().bold.underline;
});

swig.setFilter('table', function (input, head) {
  var table = head ? new Table({'head': head}) : new Table();

  var rows = input.split('\n'); rows.pop();
  for(var i=0; i<rows.length; i++){
    var columns = rows[i].split('|');
    table.push(columns);
  }

  return table.toString();
});

exports.renderFile = function(file, data){
  return swig.renderFile(file, data);
};
