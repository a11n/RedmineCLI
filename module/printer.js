var tmpl = require('./template-engine.js');

exports.printIssues = function(issues){
  var out = tmpl.renderFile('template/issues.tmpl', {'issues': issues});
  console.log(out);
}

exports.printIssue = function(issue){
  var out = tmpl.renderFile('template/issue.tmpl', issue);
  console.log(out);
}

exports.printProjects = function(projects){
  var out = tmpl.renderFile('template/projects.tmpl', {'projects': projects});
  console.log(out);
}
