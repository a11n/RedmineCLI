var swig = require('swig');
var moment = require('moment');
var Table = require('cli-table');
var colors = require('colors');

var ago = function (input) {
  return moment(input).fromNow();
}

var bold = function (input) {
  return input.bold;
}

var italic = function (input) {
  return input.italic;
}

var heading = function (input) {
  return input.toUpperCase().bold.underline;
};

var table = function (input, head) {
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
}

swig.setFilter('ago', ago);

swig.setFilter('bold', bold);

swig.setFilter('italic', italic);

swig.setFilter('heading', heading);

swig.setFilter('table', table);

exports.renderFile = function(file, data){
  file = __dirname + '/../' + file;
  return swig.renderFile(file, data);
};
