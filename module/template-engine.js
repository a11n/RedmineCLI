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
  var style =  { 'padding-left': 0, 'padding-right': 1, 'head': ['bold'] };
  var chars = { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
         , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
         , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
         , 'right': '' , 'right-mid': '' , 'middle': ' ' };
  var table = new Table({'chars': chars, 'style': style, 'head': head || []});

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
